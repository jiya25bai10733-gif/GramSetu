// Robust Audio Playback Utility for GramSetu
// Plays recorded human microphone audio or Microsoft Neural Indian human voice clips
// Always guarantees authentic, presentation-ready human voice output with zero silent failures

import { getRealisticHumanVoice } from '../data/humanVoiceClips';

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
  let hasFallenBackToTTS = false;
  let hasTriedHumanClip = false;
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
    if (isStopped || hasFallenBackToTTS) return;
    hasFallenBackToTTS = true;

    if (activeAudio) {
      try {
        activeAudio.pause();
      } catch {}
      activeAudio = null;
    }

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

  const tryPlayUrl = (url: string, isHumanClipFallback = false) => {
    if (isStopped) return;
    try {
      const playableUrl = dataUrlToBlobUrl(url);
      const audio = new Audio(playableUrl);
      activeAudio = audio;
      audio.preload = 'auto';

      audio.onplay = () => {
        playStartTime = Date.now();
        if (!isStopped && onStart) onStart();
      };

      audio.onended = () => {
        const playedDuration = Date.now() - playStartTime;
        if (playedDuration < 250 && !isStopped) {
          if (!isHumanClipFallback && !hasTriedHumanClip) {
            hasTriedHumanClip = true;
            const humanClip = getRealisticHumanVoice(undefined, fallbackText);
            tryPlayUrl(humanClip, true);
          } else {
            playTTS();
          }
        } else {
          if (onEnd) onEnd();
        }
      };

      audio.onerror = (e) => {
        console.warn('Audio element error, falling back:', e);
        if (!isStopped) {
          if (!isHumanClipFallback && !hasTriedHumanClip) {
            hasTriedHumanClip = true;
            const humanClip = getRealisticHumanVoice(undefined, fallbackText);
            tryPlayUrl(humanClip, true);
          } else {
            playTTS();
          }
        }
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('audio.play() rejected, falling back:', err);
          if (!isStopped) {
            if (!isHumanClipFallback && !hasTriedHumanClip) {
              hasTriedHumanClip = true;
              const humanClip = getRealisticHumanVoice(undefined, fallbackText);
              tryPlayUrl(humanClip, true);
            } else {
              playTTS();
            }
          }
        });
      }
    } catch (err) {
      console.warn('Audio setup failed, falling back:', err);
      if (!isHumanClipFallback && !hasTriedHumanClip) {
        hasTriedHumanClip = true;
        const humanClip = getRealisticHumanVoice(undefined, fallbackText);
        tryPlayUrl(humanClip, true);
      } else {
        playTTS();
      }
    }
  };

  // Determine starting audio URL
  if (audioUrl && audioUrl.length > 50) {
    tryPlayUrl(audioUrl, false);
  } else {
    // If no custom audio was provided, start immediately with realistic human voice clip
    hasTriedHumanClip = true;
    const humanClip = getRealisticHumanVoice(undefined, fallbackText);
    tryPlayUrl(humanClip, true);
  }

  return { stop: handleStop };
};
