import lookPath from "./lookPath";
import movePathList from "./movePathList";
import { animation } from "./aniEffectMethod";
import { positionToXY } from "./positionMethod";
import { w, h, pixelWeigth, renderData } from "./config";
import bricks from "./bricks";

function restoreLifeAction(type, value, ship) {
  //'liftReset','liftMax-6','liftRestore-6'
  var actionMap = {
    liftReset: function (ship) {
      ship.life = ship.maxLife;
    },
    liftMax: function (ship, value) {
      var val = parseInt(value);
      ship.maxLife += val;
    },
    liftRestore: function (ship, value) {
      var val = parseInt(value);
      if (ship.life + val > ship.maxLife) {
        return (ship.life = ship.maxLife);
      }
      return (ship.life += val);
    },
  };

  if (actionMap[type]) actionMap[type](ship, value);
}

function itemMove() {
  if (movePathList[this.movePath] && this.getST() % this.moveTime == 0)
    movePathList[this.movePath].call(this, "mapObject");
}

// name: "Rock",
// movePath: "goToOut",
// moveTime: 10,
// look: "hp+",
// showPolling: [20, 100],

export default function ({
  name,
  position,
  movePath,
  moveTime = 1,
  repeatLock = 0,
  look
}) {
  this.name = name; //名字
  this.mainX = position;
  this.position = position; //位置
  this.movePath = movePath; //移動的路徑類型
  this.moveTime = moveTime; // 移動間隔
  this.repeatLock = repeatLock;
  this.look = look;

  var survivalTime = 0;

  this.getST = function () {
    return survivalTime;
  };

  this.graphic = function (viewDom) {
    var color = this.color;
    var enemyImg = document.getElementById(this.look);

    viewDom.shadowOffsetX = 2;
    viewDom.shadowOffsetY = 2;
    viewDom.shadowBlur = 10;
    viewDom.shadowColor = "rgba(0, 0, 0, 0.5)";
    viewDom.drawImage(
      enemyImg,
      positionToXY(this.position).x - enemyImg.width / 2,
      positionToXY(this.position).y - enemyImg.height,
      // enemyImg.width,
      // enemyImg.height
    );
    viewDom.shadowColor = "rgba(0, 0, 0, 0)";

  };

  this.action = function (renderType, viewDom, shipPs) {
    this.graphic(viewDom);
    if (renderType === "OBJ_MOVE") {
      itemMove.call(this);
      survivalTime++;
    }
  };
}
