import Tone from 'tone';

var synth = new Tone.FMSynth().toMaster()

export function deadSound() {  
  synth.triggerAttackRelease('C#2', .1, '+0')
  synth.triggerAttackRelease('C2', .05, '+.15')
}

var noise = new Tone.Noise({
  "volume":-Infinity,
  "type": "brown",
  "fadeIn": 500000,
  "fadeOut": 400,
});

//make an autofilter to shape the noise
var autoFilter = new Tone.AutoFilter({
  "frequency": ".5",
  "min": 800,
  "max": 15000,
}).toMaster();

noise.connect(autoFilter);

export function explosionSound() {
  // synth.triggerAttackRelease('C#2', .05, '+0')
  // synth.triggerAttackRelease('C#2', .05, '+1')
  // synth.triggerAttackRelease('C2', .1, '+1.5')

  noise.start().volume.rampTo(-8, 0);
  noise.volume.rampTo(-Infinity, 3);
}

const sonicSynth = new Tone.MembraneSynth({
  pitchDecay: .015,
  octaves: 2,
  envelope: { attack: .001, decay: .06, sustain: 0, release: .03 },
}).toMaster();
sonicSynth.volume.value = -22;
const impactSynth = new Tone.MembraneSynth({
  pitchDecay: .07,
  octaves: 5,
  envelope: { attack: .002, decay: .28, sustain: 0, release: .2 },
}).toMaster();
impactSynth.volume.value = -13;

// A short, brighter cue stays distinct from the initial bass impact.
// Its envelope ends before the next volley, keeping rapid waves from piling up.
const laserSynth = new Tone.FMSynth({
  harmonicity: 3,
  modulationIndex: 8,
  oscillator: { type: 'triangle' },
  modulation: { type: 'square' },
  envelope: { attack: .001, decay: .045, sustain: 0, release: .025 },
  modulationEnvelope: { attack: .001, decay: .035, sustain: 0, release: .02 },
}).toMaster();
laserSynth.volume.value = -21;
const laserPitches = [880, 1046.5, 1174.7, 1318.5];

export function sonicBoomSound() {
  sonicSynth.triggerAttackRelease('C4', .04);
}
export function heavyWaveSound() {
  impactSynth.triggerAttackRelease('C1', .12);
}

export function laserWaveSound(waveIndex = 0) {
  const time = Tone.now();
  const pitch = laserPitches[waveIndex % laserPitches.length];
  laserSynth.triggerAttackRelease(pitch, .035, time);
  laserSynth.frequency.exponentialRampToValueAtTime(pitch * .35, time + .065);
}
