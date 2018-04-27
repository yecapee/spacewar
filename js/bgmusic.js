import Tone from 'tone';

export default function () {

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
      "", "", "", ""
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
  var piano2 = new Tone.Synth({
    "oscillator": {
      "type": "fmsine4",
      "modulationType": "square"
    },
    "volume": -Infinity
  }).toMaster();

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
    ]).start(0);
  loop2.interval = ".16";

  //

  var piano3 = new Tone.Synth({
    //volume: -28,
    volume: -Infinity,
    "oscillator": {
      "type": "amsine4",
      "modulationType": "square"
    }
  }).toMaster();

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
    ]).start(0);
  loop3.interval = ".16";

  //Tone.Transport.volume.value = -Infinity;
  Tone.Transport.start();
  piano2.volume.rampTo(-25, 12);
  piano3.volume.rampTo(-25, 15);

  bass1.volume.rampTo(-30, 8);
  bass2.volume.rampTo(-20, 5);

}