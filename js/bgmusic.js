import Tone from 'tone';

export default function () {
  Tone.Transport.timeSignature = [6, 4];
  Tone.Transport.bpm.value = 180;

  //

  //
  var bass1 = new Tone.PolySynth({
    polyphony: 8,
    // volume: -40,
    volume: -Infinity,
    detune: 0,
    voice: Tone.Synth
  }).toMaster();

  var bassloop1 = new Tone.Pattern(function (time, note) {
    bass1.triggerAttackRelease(note, ".16", time);
  }, [
      "E5", "", "E5", "E5",
      "", "", "", "",
      "", "", "", "",
      "", "", "", "",
    ]).start(0);
  bassloop1.interval = ".16";

  //

  var bass2 = new Tone.PolySynth({
    polyphony: 8,
    //volume: -20,
    volume: -Infinity,
    detune: 0,
    voice: Tone.Synth
  }).toMaster();

  var bassloop2 = new Tone.Pattern(function (time, note) {
    bass2.triggerAttackRelease(note, ".16", time);
  }, [
      "E2", "E2", "E2", "G2"
    ]).start(0);

  bassloop2.interval = ".16";

  //
  //var noise = new Tone.OscillatorNode(bass2).start().toMaster();
  //
  var merge = new Tone.Merge();

  var reverb = new Tone.Freeverb({
    "roomSize" : 0.2,
    "wet" : 0.3
  });
  merge.chain(reverb, Tone.Master);


  //
  var piano2 = new Tone.Synth({
    "oscillator": {
      "detune": 0,
      "type": "custom",
      "partials" : [2, 1, 2, 2],
      "phase": 0,
      "volume": 0
    },
    "envelope": {
      "attack": 0.005,
      "decay": 0.3,
      "sustain": 0.2,
      "release": 1,
    },
    "portamento": 0.01,
    "volume": -Infinity
  }).connect(merge.left);

  var loop2 = new Tone.Pattern(function (time, note) {
    piano2.triggerAttackRelease(note, "4n", time);
  }, [
      "E3", "E3", "E3", "G3",
      "G3", "G3", "E3", "D4",
      "B3", "G3", "D3", "B2",
      "E2", "G2", "B2", "D2",

      "E3", "E3", "E3", "G3",
      "G3", "G3", "E3", "D4",
      "B3", "G3", "D3", "B2",
      "E2", "G2", "B2", "D2",

      "E3", "E3", "E3", "G3",
      "G3", "G3", "E3", "D4",
      "B3", "G3", "D3", "B2",
      "E2", "G2", "B2", "D2",

      "E3", "E3", "E3", "G3",
      "G3", "G3", "E3", "D4",
      "B3", "G3", "D3", "B2",
      "E2", "G2", "B2", "D2",

      // "B3", "G3", "D3", "B2",
      // "E2", "G2", "B2", "D2",
      // "B3", "G3", "D3", "B2",
      // "E2", "G2", "B2", "D2",
    ]).start(0);
  loop2.interval = ".16";

  //

  var piano3 = new Tone.Synth({
    //volume: -28,
    volume: -Infinity,
    "oscillator": {
      "detune": 0,
      "type": "custom",
      "partials" : [2, 1, 2, 2],
      "phase": 0,
      "volume": 0
    },
    "envelope": {
      "attack": 0.005,
      "decay": 0.3,
      "sustain": 0.2,
      "release": 1,
    },
    "portamento": 0.01,
  }).connect(merge.right);

  var loop3 = new Tone.Pattern(function (time, note) {
    piano3.triggerAttackRelease(note, "4n", time);
  }, [
    "E4", "E4", "E4", "G4",
    "G4", "G4", "E4", "D5",
    "B4", "G4", "D4", "B3",
    "E3", "G3", "B3", "D3",

    "E4", "E4", "E4", "G4",
    "G4", "G4", "E4", "D5",
    "B4", "G4", "D4", "B3",
    "E3", "G3", "B3", "D3",

    "E4", "E4", "E4", "G4",
    "G4", "G4", "E4", "D5",
    "B4", "G4", "D4", "B3",
    "E3", "G3", "B3", "D3",

    "E4", "E4", "E4", "G4",
    "G4", "G4", "E4", "D5",
    "B4", "G4", "D4", "B3",
    "E3", "G3", "B3", "D3",

    // "B4", "G4", "D4", "B3",
    // "E3", "G3", "B3", "D3",
    // "B4", "G4", "D4", "B3",
    // "E3", "G3", "B3", "D3",
  ]).start(0);
  loop3.interval = ".16";

  //loop3.playbackRate = 0.985;

  //Tone.Transport.volume.value = -Infinity;
  //Tone.Transport.start();
  piano2.volume.rampTo(-25, 12);
  piano3.volume.rampTo(-25, 15);

  bass1.volume.rampTo(-40, 8);
  bass2.volume.rampTo(-28, 5);

}