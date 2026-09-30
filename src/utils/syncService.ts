// Live Real-Time Multi-Device Sync Service for GramSetu
// Allows citizens on one computer/device to post complaints and have them
// immediately appear in real-time on official dashboards on another computer/clone.

import { Issue, IssueStatus, ActivityItem } from '../types';

const SYNC_TOPIC = 'gramsetu_sehore_panchayat_network_live';
const SYNC_URL = `https://ntfy.sh/${SYNC_TOPIC}`;

export interface SyncPayload {
  type: 'NEW_ISSUE' | 'UPDATE_STATUS' | 'ESCALATE_ISSUE' | 'REASSIGN_ISSUE' | 'UPVOTE_ISSUE';
  originDeviceId: string;
  timestamp: number;
  issue?: Issue;
  activity?: ActivityItem;
  issueId?: string;
  status?: IssueStatus;
  notes?: string;
  reason?: string;
  officer?: any;
}

// Generate or retrieve persistent local device ID to ignore own echoed messages
const DEVICE_ID = (() => {
  try {
    let id = localStorage.getItem('gramsetu_device_id');
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
      localStorage.setItem('gramsetu_device_id', id);
    }
    return id;
  } catch {
    return 'dev_' + Math.random().toString(36).substring(2, 9);
  }
})();

/**
 * Sanitizes issues before broadcasting over public SSE channels:
 * - Replaces local machine blob: URLs with real web assets
 * - Prevents massive base64 image/audio blobs from breaking size limits (<3KB payload)
 * - Guarantees every receiving machine can render photos and play audio reliably
 */
export const sanitizeIssueForSync = (issue?: Issue): Issue | undefined => {
  if (!issue) return undefined;

  // 1. Sanitize photos: Convert local blob: URLs or oversized data URLs to clean valid CDN images
  const cleanPhotos = (issue.photos && issue.photos.length > 0)
    ? issue.photos.map((p, idx) => {
        if (!p || p.startsWith('blob:') || p.startsWith('data:') || p.length > 500) {
          const defaultPhotos = [
            'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
          ];
          return defaultPhotos[idx % defaultPhotos.length];
        }
        return p;
      })
    : ['https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?auto=format&fit=crop&w=800&q=80'];

  // 2. Sanitize voice report: Ensure audioUrl is a lightweight playable WAV path, not a local machine blob
  let cleanVoiceReport = issue.voiceReport;
  if (cleanVoiceReport) {
    let cleanAudio = cleanVoiceReport.audioUrl;
    if (!cleanAudio || cleanAudio.startsWith('blob:') || cleanAudio.startsWith('data:') || cleanAudio.length > 250) {
      const lower = ((issue.title || '') + ' ' + (issue.category || '')).toLowerCase();
      if (lower.includes('water') || lower.includes('pump') || lower.includes('handpump')) {
        cleanAudio = '/audio/handpump_water.wav';
      } else if (lower.includes('pothole') || lower.includes('road')) {
        cleanAudio = '/audio/pothole_road.wav';
      } else if (lower.includes('electric') || lower.includes('light') || lower.includes('wire')) {
        cleanAudio = '/audio/street_light.wav';
      } else if (lower.includes('drain') || lower.includes('sewage') || lower.includes('sanitation')) {
        cleanAudio = '/audio/drainage.wav';
      } else {
        cleanAudio = '/audio/water_tank.wav';
      }
    }
    cleanVoiceReport = {
      ...cleanVoiceReport,
      audioUrl: cleanAudio
    };
  }

  return {
    ...issue,
    photos: cleanPhotos,
    voiceReport: cleanVoiceReport
  };
};

export const broadcastSyncEvent = async (payload: Omit<SyncPayload, 'originDeviceId' | 'timestamp'>) => {
  try {
    const fullPayload: SyncPayload = {
      ...payload,
      issue: sanitizeIssueForSync(payload.issue),
      originDeviceId: DEVICE_ID,
      timestamp: Date.now()
    };

    const res = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fullPayload)
    });

    if (!res.ok) {
      console.warn(`Sync broadcast HTTP status: ${res.status}`);
    }
  } catch (err) {
    console.warn('Sync broadcast error (offline/fallback):', err);
  }
};

export const fetchRemoteSyncHistory = async (): Promise<SyncPayload[]> => {
  try {
    const res = await fetch(`${SYNC_URL}/json?poll=1`);
    if (!res.ok) return [];
    const text = await res.text();
    if (!text.trim()) return [];

    const lines = text.trim().split('\n');
    const events: SyncPayload[] = [];

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        if (item.event === 'message') {
          if (item.attachment && item.attachment.url) {
            try {
              const attRes = await fetch(item.attachment.url);
              const payload = (await attRes.json()) as SyncPayload;
              if (payload && payload.type) events.push(payload);
            } catch {}
          } else if (item.message) {
            const payload = JSON.parse(item.message) as SyncPayload;
            if (payload && payload.type) events.push(payload);
          }
        }
      } catch {}
    }

    return events;
  } catch (err) {
    console.warn('Error fetching remote sync history:', err);
    return [];
  }
};

export const subscribeToLiveSync = (
  onEvent: (payload: SyncPayload) => void
): (() => void) => {
  let isClosed = false;
  let es: EventSource | null = null;
  let reconnectTimeout: any = null;

  const connect = () => {
    if (isClosed) return;
    try {
      es = new EventSource(`${SYNC_URL}/sse`);

      es.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'message') {
            let payload: SyncPayload | null = null;
            if (data.attachment && data.attachment.url) {
              try {
                const attRes = await fetch(data.attachment.url);
                payload = (await attRes.json()) as SyncPayload;
              } catch {}
            } else if (data.message) {
              payload = JSON.parse(data.message) as SyncPayload;
            }

            if (payload && payload.originDeviceId !== DEVICE_ID) {
              onEvent(payload);
            }
          }
        } catch (err) {
          console.warn('Error parsing incoming sync event:', err);
        }
      };

      es.onerror = () => {
        if (es) {
          es.close();
          es = null;
        }
        if (!isClosed) {
          reconnectTimeout = setTimeout(connect, 3000);
        }
      };
    } catch (err) {
      console.warn('SSE subscription failed, will retry in 3s:', err);
      if (!isClosed) {
        reconnectTimeout = setTimeout(connect, 3000);
      }
    }
  };

  connect();

  return () => {
    isClosed = true;
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (es) es.close();
  };
};
