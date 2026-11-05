/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio ocean wave and sea breeze synthesizer (Zero external MP3 dependencies)

class OceanAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private waveGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private waveInterval: number | null = null;

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Wave node
    this.waveGain = this.ctx.createGain();
    this.waveGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.waveGain.connect(this.masterGain);

    // Wind node
    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.windGain.connect(this.masterGain);

    // Start noise sources
    this.startWindNoise();
    this.startWaveSimulation();
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('AudioContext missing');
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise approximation
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
    }
    return buffer;
  }

  private startWindNoise() {
    if (!this.ctx || !this.windGain) return;
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.windGain);
    noiseSource.start();
  }

  private startWaveSimulation() {
    if (!this.ctx || !this.waveGain) return;
    const noiseBuffer = this.createNoiseBuffer();

    const triggerSwell = () => {
      if (!this.ctx || !this.waveGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      const waveSource = this.ctx.createBufferSource();
      waveSource.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 1.8);
      filter.frequency.exponentialRampToValueAtTime(120, now + 4.2);

      const swellGain = this.ctx.createGain();
      swellGain.gain.setValueAtTime(0.001, now);
      swellGain.gain.exponentialRampToValueAtTime(0.25, now + 1.8);
      swellGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

      waveSource.connect(filter);
      filter.connect(swellGain);
      swellGain.connect(this.waveGain);

      waveSource.start(now);
      waveSource.stop(now + 4.6);
    };

    triggerSwell();
    this.waveInterval = window.setInterval(triggerSwell, 4800);
  }

  public toggle(force?: boolean): boolean {
    const shouldPlay = force !== undefined ? force : !this.isPlaying;
    if (shouldPlay) {
      this.init();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isPlaying = true;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      }
    } else {
      this.isPlaying = false;
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    }
    return this.isPlaying;
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const oceanAudio = new OceanAudioSynthesizer();
