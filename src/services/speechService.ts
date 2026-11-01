// Text-to-Speech (TTS) Service using Web Speech API
// Designed for older adults: calm, slightly slower, clear articulation

class SpeechService {
  private enabled: boolean = true;
  private isSpeaking: boolean = false;

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const cleanText = text.replace(/<[^>]*>/g, '').trim();
      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.9; // Slightly slower, calm cadence for clear comprehension
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick warm, natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        v => (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Jenny')) && v.lang.startsWith('en')
      ) || voices.find(v => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.isSpeaking = false;
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const speech = new SpeechService();
