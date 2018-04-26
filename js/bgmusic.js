import Tone from 'tone';

export default function () {

  // var bass = new Tone.Synth({
  //   "oscillator" : {
  //     "type" : "fmsine4",
  //     "modulationType" : "square"
  //   }
  // }).toMaster();

  var bass = new Tone.PolySynth({
    polyphony: 8,
    volume: -25,
    detune: 0,
    voice: Tone.Synth
  }).toMaster();

  var loop = new Tone.Pattern(function (time, note) {
    bass.triggerAttackRelease(note, "2n", time);
  }, [
      "E2", "G3", "E2", "E2"
    ]).start(0);
  loop.interval = "4n";

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
    ]).start(0);
  loop2.interval = "16n";

  //

  // var piano3 = new Tone.Synth({
  //   "oscillator" : {
  //     "type" : "fmsine4",
  //     "modulationType" : "square"
  //   }
  // }).toMaster();

  // var loop3 = new Tone.Pattern(function(time, note){
  //   piano2.triggerAttackRelease(note, "4n", time);
  // }, [
  //   "C3","C3","C3","E3", 
  //   "E3","E3","C3","B3", 
  //   "G3","E3","B2","F2", 
  //   "B1","C2","E2","G2"
  // ]).start(0);
  // loop3.interval = "16n";

  //Tone.Transport.volume.value = -Infinity;
  Tone.Transport.start();
  piano2.volume.rampTo(-25, 5);

}