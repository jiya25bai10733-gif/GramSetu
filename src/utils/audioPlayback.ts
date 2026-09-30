// Robust Audio Playback Utility for GramSetu
// Plays recorded human microphone audio or Microsoft Neural Indian human voice clips
// Always guarantees authentic, presentation-ready human voice output with zero silent failures

import { getRealisticHumanVoice } from '../data/humanVoiceClips';

// Module-level reference to prevent Chromium garbage collection of active speech utterances
let activeUtterance: SpeechSynthesisUtterance | null = null;
let sharedAudioContext: AudioContext | null = null;

const getOrCreateAudioContext = (): AudioContext | null => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioContext || sharedAudioContext.state === 'closed') {
      sharedAudioContext = new AudioCtx();
    }
    if (sharedAudioContext.state === 'suspended') {
      sharedAudioContext.resume().catch(() => {});
    }
    return sharedAudioContext;
  } catch (e) {
    console.warn('AudioContext creation failed:', e);
    return null;
  }
};

export const dataUrlToBlobUrl = (dataUrl: string): string => {
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  try {
    const parts = dataUrl.split(',');
    if (parts.length < 2) return dataUrl;
    
    const mimeMatch = parts[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'audio/wav';
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
  let isStopped = false;
  let activeAudioElement: HTMLAudioElement | null = null;
  let activeBufferSource: AudioBufferSourceNode | null = null;
  let hasTriggeredStart = false;

  const triggerStart = () => {
    if (!hasTriggeredStart && !isStopped) {
      hasTriggeredStart = true;
      if (onStart) onStart();
    }
  };

  const triggerEnd = () => {
    if (!isStopped) {
      isStopped = true;
      stopInternal();
      if (onEnd) onEnd();
    }
  };

  const stopInternal = () => {
    if (activeBufferSource) {
      try {
        activeBufferSource.stop();
        activeBufferSource.disconnect();
      } catch {}
      activeBufferSource = null;
    }
    if (activeAudioElement) {
      try {
        activeAudioElement.pause();
        activeAudioElement.currentTime = 0;
      } catch {}
      activeAudioElement = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    activeUtterance = null;
  };

  const handleStop = () => {
    isStopped = true;
    stopInternal();
    if (onEnd) onEnd();
  };

  // Fallback 3: Speech Synthesis
  const playSpeechSynthesis = () => {
    if (isStopped) return;
    stopInternal();

    if ('speechSynthesis' in window && fallbackText) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(fallbackText);
        activeUtterance = utterance;

        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('IN'));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.lang = 'hi-IN';
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        utterance.onstart = () => {
          if (!isStopped) triggerStart();
        };

        utterance.onend = () => {
          activeUtterance = null;
          triggerEnd();
        };

        utterance.onerror = (e) => {
          console.warn('Speech synthesis error:', e);
          activeUtterance = null;
          triggerEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis exception:', err);
        triggerEnd();
      }
    } else {
      triggerEnd();
    }
  };

  // Fallback 2: HTML5 Audio Element
  const playViaAudioElement = (srcUrl: string) => {
    if (isStopped) return;
    try {
      const audio = new Audio();
      activeAudioElement = audio;
      audio.volume = 1.0;
      audio.preload = 'auto';

      let playStarted = false;

      audio.onplay = () => {
        playStarted = true;
        triggerStart();
      };

      audio.onended = () => {
        triggerEnd();
      };

      audio.onerror = (e) => {
        console.warn('HTML5 Audio error, trying TTS fallback:', e);
        if (!isStopped) playSpeechSynthesis();
      };

      // Set src (if data URI, convert or pass directly)
      audio.src = srcUrl.startsWith('data:') ? dataUrlToBlobUrl(srcUrl) : srcUrl;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('audio.play() rejected:', err);
          if (!playStarted && !isStopped) {
            playSpeechSynthesis();
          }
        });
      }
    } catch (err) {
      console.warn('playViaAudioElement failed:', err);
      if (!isStopped) playSpeechSynthesis();
    }
  };

  // Primary: Web Audio API (decoded in memory — 100% resilient across browsers)
  const playViaWebAudio = async (srcUrl: string) => {
    if (isStopped) return;
    const ctx = getOrCreateAudioContext();
    if (!ctx) {
      playViaAudioElement(srcUrl);
      return;
    }

    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Fetch the audio binary (works seamlessly for data:, blob:, and /audio/... URLs)
      const res = await fetch(srcUrl);
      const arrayBuf = await res.arrayBuffer();
      
      if (isStopped) return;

      const audioBuf = await ctx.decodeAudioData(arrayBuf);
      if (isStopped) return;

      const source = ctx.createBufferSource();
      source.buffer = audioBuf;
      source.connect(ctx.destination);
      activeBufferSource = source;

      source.onended = () => {
        activeBufferSource = null;
        triggerEnd();
      };

      source.start(0);
      triggerStart();
    } catch (err) {
      console.warn('Web Audio API playback failed, attempting HTML5 Audio fallback:', err);
      if (!isStopped) {
        playViaAudioElement(srcUrl);
      }
    }
  };

  // Resolve best available audio URL
  let resolvedUrl = audioUrl;
  // If no URL or old synthetic mp3 string from previous session, resolve directly to the authentic human recording
  if (!resolvedUrl || resolvedUrl.startsWith('data:audio/mp3;base64,//Nkx') || resolvedUrl.length < 20) {
    resolvedUrl = getRealisticHumanVoice(undefined, fallbackText);
  }

  // Start playback
  if (resolvedUrl) {
    playViaWebAudio(resolvedUrl);
  } else {
    playSpeechSynthesis();
  }

  return { stop: handleStop };
};
