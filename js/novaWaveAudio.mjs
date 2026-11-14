// A broadband pressure snap and a short air tail, with no melody or FM whistle.
// Generate once per voice, then reuse the buffers for every skill activation.
export function createNovaWaveAudio(sampleRate, variant = 0) {
  const duration = .14;
  const samples = new Float32Array(Math.ceil(sampleRate * duration));
  let seed = (0x4e4f5641 + variant * 1013) >>> 0;
  let low = 0, rumble = 0, phase = 0, peak = 0;
  const highpass = 1 - Math.exp(-2 * Math.PI * 180 / sampleRate);
  for (let i = 0; i < samples.length; i++) {
    const t = i / sampleRate;
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = seed / 2147483648 - 1;
    const cutoff = 850 + 2300 * Math.exp(-t * 40);
    low += (1 - Math.exp(-2 * Math.PI * cutoff / sampleRate)) * (noise - low);
    rumble += highpass * (low - rumble);
    const attack = 1 - Math.exp(-t / .0018);
    const air = (low - rumble) * attack * (Math.exp(-t / .024) + .12 * Math.exp(-t / .044));
    phase += 2 * Math.PI * (58 + 65 * Math.exp(-t / .012)) / sampleRate;
    const body = Math.sin(phase) * attack * Math.exp(-t / .018) * .22;
    // Fade the final tail to zero so retriggering never exposes a cut edge.
    const fade = Math.min(1, (samples.length - 1 - i) / (sampleRate * .012));
    const value = (air + body) * fade;
    samples[i] = value;
    peak = Math.max(peak, Math.abs(value));
  }
  if (peak) for (let i = 0; i < samples.length; i++) samples[i] *= .65 / peak;
  return samples;
}
