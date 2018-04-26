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