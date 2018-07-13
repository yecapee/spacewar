import Tone from 'tone';

var meter = new Tone.Meter();
var player = new Tone.Player({
    "url" : "http://grayscale.scene.pl/msx/zizibum.mp3",
    "loop" : true
}).connect(meter).toMaster();    

export default function () {
    player.start();
}