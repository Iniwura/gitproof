// Procedural Audio Haptics via Web Audio API (Zero External Assets, 0ms Network Latency)
class HapticAudioEngine {
  private ctx: AudioContext | null = null;
  private panner: StereoPannerNode | null = null;
  private muted: boolean = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      try {
        this.panner = this.ctx.createStereoPanner();
        this.panner.connect(this.ctx.destination);
      } catch {
        // Fallback for browsers without StereoPanner
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  /**
   * Tactile Mechanical Click on :active
   * @param pan Normalized stereo pan (-1.0 to +1.0)
   */
  public click(pan = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.panner) {
        this.panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
      }

      osc.type = 'triangle';
      // Pitch drops from 340Hz to 60Hz in 35ms to simulate a physical mechanical micro-switch
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.035);

      gain.gain.setValueAtTime(0.04, now); // Subconscious volume
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      if (this.panner) {
        osc.connect(gain);
        gain.connect(this.panner);
      } else {
        osc.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio safety
    }
  }

  /**
   * High-tech Sub-Navigation / Tab Toggle Tick
   */
  public tick(pan = 0) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (this.panner) {
        this.panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
      }

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      if (this.panner) {
        osc.connect(gain);
        gain.connect(this.panner);
      } else {
        osc.connect(gain);
        gain.connect(this.ctx.destination);
      }

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio safety
    }
  }

  /**
   * Consensus Verdict / Payout Success Chime
   */
  public success() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Dual harmonic chord: E5 (659Hz) and G#5 (830Hz)
      const notes = [659.25, 830.61];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.04;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.03, start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.22);
      });
    } catch {
      // Audio safety
    }
  }

  /**
   * Consensus Rejection / Error Thump
   */
  public error() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio safety
    }
  }
}

export const haptics = new HapticAudioEngine();
