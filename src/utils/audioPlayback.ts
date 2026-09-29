// Robust Audio Playback Utility for GramSetu
// Handles base64 data URLs, Blob URLs, WebM decoding, and SpeechSynthesis fallbacks

// Module-level reference to prevent Chromium garbage collection of active speech utterances
let activeUtterance: SpeechSynthesisUtterance | null = null;

export const dataUrlToBlobUrl = (dataUrl: string): string => {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return dataUrl;
    
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'audio/webm';
    const binaryStr = atob(parts[1]);
    const len = binaryStr.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn('Error converting data URL to blob URL:', err);
    return dataUrl;
  }
};

export const playAudioWithFallback = (
  audioUrl: string | undefined,
  fallbackText: string,
  onStart?: () => void,
  onEnd?: () => void
): { stop: () => void } => {
  let activeAudio: HTMLAudioElement | null = null;
  let isStopped = false;
  let hasFallenBack = false;
  let playStartTime = 0;

  const handleStop = () => {
    isStopped = true;
    if (activeAudio) {
      try {
        activeAudio.pause();
        activeAudio.currentTime = 0;
      } catch {}
      activeAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  const playTTS = () => {
    if (isStopped || hasFallenBack) return;
    hasFallenBack = true;

    if (activeAudio) {
      try {
        activeAudio.pause();
      } catch {}
      activeAudio = null;
    }

    if ('speechSynthesis' in window && fallbackText) {
      try {
        // Resume synthesis if Chrome put it in paused state
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(fallbackText);
        activeUtterance = utterance; // Prevent GC

        // Look for Hindi or Indian English voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('IN'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.lang = 'hi-IN';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          if (!isStopped && onStart) onStart();
        };

        utterance.onend = () => {
          activeUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          activeUtterance = null;
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis exception:', err);
        activeUtterance = null;
        if (onEnd) onEnd();
      }
    } else {
      if (onEnd) onEnd();
    }
  };

  // If audio URL is available and has non-trivial payload
  if (audioUrl && audioUrl.length > 50) {
    try {
      const playableUrl = dataUrlToBlobUrl(audioUrl);
      const audio = new Audio(playableUrl);
      activeAudio = audio;
      audio.preload = 'auto';

      audio.onplay = () => {
        playStartTime = Date.now();
        if (!isStopped && onStart) onStart();
      };

      audio.onended = () => {
        const playedDuration = Date.now() - playStartTime;
        // If the audio ended almost instantly (< 250ms) without real audio content, fallback to TTS
        if (playedDuration < 250 && !hasFallenBack && fallbackText) {
          console.info('Audio ended too quickly, using speech synthesis fallback');
          playTTS();
        } else {
          if (onEnd) onEnd();
        }
      };

      audio.onerror = (e) => {
        console.warn('HTMLAudio error, falling back to voice synthesis:', e);
        if (!isStopped && !hasFallenBack) {
          playTTS();
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('audio.play() rejected, falling back to voice synthesis:', err);
          if (!isStopped && !hasFallenBack) {
            playTTS();
          }
        });
      }
    } catch (err) {
      console.warn('Audio initialization failed, using TTS fallback:', err);
      playTTS();
    }
  } else {
    playTTS();
  }

  return { stop: handleStop };
};
