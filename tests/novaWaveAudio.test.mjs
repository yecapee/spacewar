import test from 'node:test';
import assert from 'node:assert/strict';
import { createNovaWaveAudio } from '../js/novaWaveAudio.mjs';

const peak = data => data.reduce((max, sample) => Math.max(max, Math.abs(sample)), 0);
const rms = data => Math.sqrt(data.reduce((sum, sample) => sum + sample * sample, 0) / data.length);

test('wave buffers remain finite, bounded and silent at the cut edges at common sample rates', () => {
  for (const rate of [22050, 44100, 48000, 96000]) {
    const data = createNovaWaveAudio(rate);
    assert.equal(data.length, Math.ceil(rate * .14));
    assert(data.every(Number.isFinite));
    assert(data[0] === 0 && data.at(-1) === 0);
    assert(peak(data) <= .651);
    assert(rms(data.slice(Math.floor(rate * .1))) < rms(data.slice(0, Math.floor(rate * .04))) * .08);
  }
});

test('four overlapping waves have mixing headroom and end without a lingering tone', () => {
  const rate = 48000, mix = new Float32Array(rate);
  for (let wave = 0; wave < 4; wave++) {
    const data = createNovaWaveAudio(rate, wave), offset = Math.round(wave * .1 * rate);
    data.forEach((sample, index) => { mix[offset + index] += sample * 10 ** (-11 / 20); });
  }
  assert(peak(mix) < .3);
  assert(rms(mix.slice(0, rate / 2)) > .005);
  assert.equal(peak(mix.slice(rate / 2)), 0);
});

test('each wave has a repeatable noise texture without reusing identical samples', () => {
  assert.deepEqual(createNovaWaveAudio(48000, 1), createNovaWaveAudio(48000, 1));
  assert.notDeepEqual(createNovaWaveAudio(48000, 1), createNovaWaveAudio(48000, 2));
});
