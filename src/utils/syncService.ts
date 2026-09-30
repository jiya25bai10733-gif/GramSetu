// Live Real-Time Multi-Device Sync Service for GramSetu
// Allows citizens on one computer/device to post complaints and have them
// immediately appear in real-time on official dashboards on another computer/clone.

import { Issue, IssueStatus, ActivityItem } from '../types';

const SYNC_TOPIC = 'gramsetu_sync_live_central_panchayat_sehore';
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

export const broadcastSyncEvent = async (payload: Omit<SyncPayload, 'originDeviceId' | 'timestamp'>) => {
  try {
    const fullPayload: SyncPayload = {
      ...payload,
      originDeviceId: DEVICE_ID,
      timestamp: Date.now()
    };

    await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fullPayload)
    });
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
        if (item.event === 'message' && item.message) {
          const payload = JSON.parse(item.message) as SyncPayload;
          if (payload && payload.type) {
            events.push(payload);
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
  try {
    const es = new EventSource(`${SYNC_URL}/sse`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'message' && data.message) {
          const payload = JSON.parse(data.message) as SyncPayload;
          // Ignore messages originating from self
          if (payload && payload.originDeviceId !== DEVICE_ID) {
            onEvent(payload);
          }
        }
      } catch (err) {
        console.warn('Error parsing incoming sync event:', err);
      }
    };

    es.onerror = () => {
      // EventSource auto-reconnects on error
    };

    return () => {
      es.close();
    };
  } catch (err) {
    console.warn('SSE subscription failed:', err);
    return () => {};
  }
};
