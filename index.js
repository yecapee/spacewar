import "./main.css";
import script from "./js/script";
import createEnemy from "./js/createEnemy";
import createShip from "./js/createShip";
import createItem from "./js/createItem";
import { createMovement, createFixedClock } from "./js/gameplay.mjs";
import feedback from "./js/feedback.mjs";
import world from './js/world';
import projectiles from './js/projectiles';
import { compact } from './js/engine.mjs';
import { createRecords } from './js/records.mjs';
import { drawProjectile } from './js/glowSprites.mjs';
import { createTouchGestures } from "./js/touchGestures.mjs";
import { ezPositionWithCheckScope } from "./js/positionMethod";
import {
  w,
  h,
  renderTime,
  renderData,
  vwidth,
  vheight,
  shipLife,
} from "./js/config";

const records = createRecords(localStorage);
const elements = new Map();
function element(id) { if (!elements.has(id)) elements.set(id, document.getElementById(id)); return elements.get(id); }
function property(id, key, value) { const node = element(id); if (node[key] !== value) node[key] = value; }
function style(id, key, value) { const node = element(id); if (node.style[key] !== value) node.style[key] = value; }
var renCount = 0;
var nextPolling = 1;
var killCount = 0;
var bgCount = 0;
var phase = "ready";
var deathFrames = 0;
var fireCooldown = 0;
var touchFiring = false;
var finalResult = null;
const touchGestures = createTouchGestures();
let activeTouchId = null;
let pendingTouchPosition = null;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const kaijuEncounter = /(?:^|[?&])encounter=kaiju(?:&|$)/.test(window.location?.search || '');
const multiKaijuEncounter = kaijuEncounter && /(?:^|[?&])wave=multi(?:&|$)/.test(window.location?.search || '');
function updateRecords(score,mileage) { if(!kaijuEncounter)records.update(score,mileage); }
const clock = createFixedClock(renderTime);
var ruleObj = {};
var scriptMileage = renCount;

var keyType = {
  UP: false,
  RIGHT: false,
  DOWN: false,
  LEFT: false,
  SPACE: false,
};

function resetInputs() {
  Object.keys(keyType).forEach((key) => keyType[key] = false);
  touchFiring = false;
  fireCooldown = 0;
  touchGestures.cancel();
  activeTouchId = null; pendingTouchPosition = null;
  if (ship) {
    ship.lookType = "CLOSE";
    ship.flightDirection = { x: 0, y: 0 };
  }
}

function actionMove() {
  if (ship.isDead) return;
  if (pendingTouchPosition !== null) { ship.position = pendingTouchPosition; pendingTouchPosition = null; }
  if (movement.position !== ship.position) movement.sync(ship.position);
  const direction = { x: Number(keyType.RIGHT) - Number(keyType.LEFT), y: Number(keyType.DOWN) - Number(keyType.UP) };
  ship.flightDirection = touchFiring && !direction.x && !direction.y ? null : direction;
  ship.position = movement.move(direction.x, direction.y);
  fireCooldown = Math.max(0, fireCooldown - 1);
  var firing = keyType.SPACE || touchFiring;
  ship.lookType = firing ? "OPEN" : "CLOSE";
  if (firing && fireCooldown === 0) {
    ship.shot();
    fireCooldown = Math.max(1, Math.round(1000 / ship.shotFps / renderTime));
  }
}

function clearRenderData() {
  renderData.enemy.length = 0;
  projectiles.clear(renderData.enemyBullet);
  if (ship) projectiles.clear(ship.bullet);
  renderData.item.length = 0;
  renderData.skills.length = 0;
  renderData.shipSkills.length = 0;
  ruleObj = {};

  //console.log(renderData);
}

const spawnPosition = w * Math.floor(h * .76) + Math.floor(w / 2);
function makeShip() {
  return new createShip({
  name: "ModularInterceptor",
  life: shipLife,
  position: spawnPosition,
  deadPosition: spawnPosition,
  look: "modular",
  skills: [
    {
      skillKey: 65,
      type: "atomicExplosionCanKill",
      launchTime: [250, 120, 6],
      skillPoint: function (ps) {
        var xy = ezPositionWithCheckScope(ps);
        var point = [[0, 0]];
        var rs = point.map(function (_xy) {
          return xy(_xy[0], _xy[1]);
        });
        return rs;
      },
    },
    {
      skillKey: 83,
      type: "airShield",
      launchTime: [250, 120, 6],
      skillPoint: function (ps) {
        var xy = ezPositionWithCheckScope(ps);
        var point = [[0, 0]];
        var rs = point.map(function (_xy) {
          return xy(_xy[0], _xy[1]);
        });
        return rs;
      },
    },
  ],
  deadCb: function () {
    updateRecords(killCount, scriptMileage); records.flush();
    finalResult = { score: killCount, mileage: scriptMileage };
    phase = "dying";
    deathFrames = 32;
    resetInputs();
    element("pauseButton").disabled = true;
  },
  });
}
var ship = makeShip();
const movement = createMovement(w, h, ship.position);


function updateSimulation() {
  if (phase === "playing") script(scriptMileage, ruleObj, nextPolling);
  var { stopCount, stopEnemyPush } = ruleObj;
  var boss = ruleObj.boss || [];
  if (phase === "playing") {
    var createObj = false;
    var item = ruleObj.item;

    // enemy push
    if (renCount == nextPolling && !stopEnemyPush) {
      for (var x = 0; x < ruleObj.enemyQuantity; x++) {
        var enemyObj = ruleObj.enemy[renCount % ruleObj.enemy.length];
        if (enemyObj) {
          enemyObj.position = Math.floor(Math.random() * w);
          enemyObj.deadCb = function () {
            killCount++;
            updateRecords(killCount, scriptMileage);
          };
          renderData.enemy.push(new createEnemy(enemyObj));
        }
      }
      if (ruleObj.enemyPolling) {
        nextPolling =
          renCount +
          Math.floor(
            Math.random() * ruleObj.enemyPolling[1] + ruleObj.enemyPolling[0]
          );
      }
    }

    if (nextPolling < renCount && ruleObj.enemyPolling) {
      nextPolling =
        renCount +
        Math.floor(
          Math.random() * ruleObj.enemyPolling[1] + ruleObj.enemyPolling[0]
        );
    }

    // boss push
    if (boss.length > 0) {
      var defPosition = Math.floor(Math.random() * w);
      boss.forEach(function (enemyObj, index) {
        // console.log(enemyObj.position);
        enemyObj.deadCb = function () {
          killCount++;
          updateRecords(killCount, scriptMileage);
          scriptMileage++;
        };
        renderData.enemy.push(new createEnemy(enemyObj));
      });
      ruleObj.boss = [];
    }
    //

    if (item) {
      item.forEach(function (itemData) {
        itemData.position = Math.floor(Math.random() * w);
        renderData.item.push(new createItem(itemData));
      });
      ruleObj.item = null;
    }

    bgCount++;

    renCount++;
    !stopCount && scriptMileage++;

    updateRecords(killCount, scriptMileage); records.tick();
  }

  if (phase === 'playing') {
    world.begin();
    projectiles.update(renderData.enemyBullet); projectiles.begin(renderData.enemyBullet);
    for (const enemy of renderData.enemy) enemy.update(ship);
    for (const item of renderData.item) item.update();
    world.rebuild(renderData);
    ship.update();
    compact(renderData.skills, skill => !skill.update(ship, world));
    compact(renderData.shipSkills, skill => !skill.update(ship, world));
    compact(renderData.enemy, enemy => enemy.life > 0 && !enemy.removed);
    compact(renderData.item, item => !item.removed);
    projectiles.cleanup(renderData.enemyBullet);
  }
  compact(renderData.aniEffect, effect => effect.update());
  feedback.update();
  updateHud();
}

function renderScene(alpha = 1) {
  const viewDom = context2d;
  viewDom.clearRect(0, 0, vwidth, vheight);
  if (phase === 'playing') ship.draw(viewDom, alpha);
  for (const bullet of renderData.enemyBullet) {
    const old = bullet.previousData || bullet.data;
    drawProjectile(viewDom, old.x + (bullet.data.x - old.x) * alpha, old.y + (bullet.data.y - old.y) * alpha, bullet.data.look);
  }
  for (const enemy of renderData.enemy) enemy.draw(viewDom, alpha);
  for (const skill of renderData.skills) skill.draw(viewDom, alpha);
  for (const skill of renderData.shipSkills) skill.draw(viewDom);
  if (ship.airShield) ship.airShield.draw(viewDom);
  for (const item of renderData.item) item.draw(viewDom);
  for (const effect of renderData.aniEffect) effect.draw(viewDom);
  const response = feedback.render(viewDom, reducedMotion.matches);
  style('view', 'transform', `translate(${response.x}px, ${response.y}px)`);
  style('damageFlash', 'opacity', String(response.flash));
  style('view', 'backgroundPositionY', `0px, ${bgCount * .35}px`);
}

function setText(id, value) {
  var node = element(id);
  if (node.textContent !== String(value)) node.textContent = String(value);
}

let healthCritical;
function updateHud() {
  setText("score", String(killCount).padStart(4, "0"));
  setText("bestScore", String(records.bestScore).padStart(4, "0"));
  setText("mileage", String(scriptMileage).padStart(4, "0"));
  setText("lifeText", `${ship.life} / ${ship.maxLife}`);
  var health = ship.life / ship.maxLife;
  style('life', 'width', `${health * 100}%`);
  if (healthCritical !== (health <= .4)) { healthCritical = health <= .4; element('healthPanel').classList.toggle('critical', healthCritical); }
  var shield = ship.airShield;
  var count = shield ? shield.remaining : 0;
  var maximum = shield ? shield.particles.length : 1;
  style('shieldMeter', 'width', `${count / maximum * 100}%`);
  setText("shieldStatus", ship.isDead ? "戰機已失聯" : shield
    ? `${shield.phase === "ready" ? (shield.tracking ? "迎擊威脅" : "防護中") : "展開中"} · ${count} / ${maximum} 粒`
    : "可施放 · S");
  property("shieldButton", "disabled", Boolean(shield) || phase !== "playing");
  property("attackButton", "disabled", phase !== "playing");
  setText("runStatus", phase === "paused" ? "暫停中" : phase === "over" || phase === "dying" ? "訊號中斷" : phase === "ready" ? "等待出擊" : "任務進行中");
}

const overlay = element("ready");
function showOverlay(screen) {
  overlay.hidden = false;
  overlay.dataset.screen = screen;
  element("startButton").focus({ preventScroll: true });
  element("resultSummary").hidden = screen !== "over";
  setText("overlayEyebrow", screen === "paused" ? "FLIGHT ON HOLD" : screen === "over" ? "SIGNAL LOST" : kaijuEncounter ? "BOSS ENCOUNTER / G-01" : "ARCADE / SURVIVAL");
  setText("overlayTitle", screen === "paused" ? "任務暫停" : screen === "over" ? "本次航行結束" : "SPACEWAR");
  setText("overlayDescription", screen === "paused" ? "深呼吸。準備好，再回到星海。" : screen === "over" ? "整理裝備，下一次飛得更遠。" : multiKaijuEncounter ? "多 Boss 遭遇戰：哥吉拉會分頭包抄，留意爆衝與掃射。" : kaijuEncounter ? "哥吉拉遭遇戰：留意蓄能，避開熱射線掃射。" : "在無盡星海中，留下一道航跡。");
  setText("startButton", screen === "paused" ? "繼續任務" : screen === "over" ? "再次出擊" : "開始出擊");
  if (screen === "over") {
    setText("resultScore", finalResult.score);
    setText("resultMileage", finalResult.mileage);
  }
}

function startRun() {
  records.flush();
  clearRenderData();
  renderData.aniEffect.length = 0;
  feedback.reset();
  ship = makeShip();
  movement.sync(ship.position);
  renCount = 0;
  scriptMileage = kaijuEncounter ? (multiKaijuEncounter ? 2401 : 2200) : 0;
  killCount = 0;
  bgCount = 0;
  nextPolling = 20;
  finalResult = null;
  resetInputs();
  phase = "playing";
  clock.reset();
  overlay.hidden = true;
  element("pauseButton").disabled = false;
  setText("pauseButton", "Ⅱ 暫停");
  updateHud();
  element("startButton").blur();
}

function togglePause(forcePause = false) {
  if (phase !== "playing" && phase !== "paused") return;
  if (phase === "playing") {
    records.flush();
    phase = "paused";
    resetInputs();
    showOverlay("paused");
    setText("pauseButton", "▶ 繼續");
  } else if (!forcePause) {
    phase = "playing";
    overlay.hidden = true;
    element("startButton").blur();
    setText("pauseButton", "Ⅱ 暫停");
  }
  clock.reset();
  updateHud();
}

element("startButton").onclick = () => phase === "paused" ? togglePause() : startRun();
element("pauseButton").onclick = () => togglePause();
element("restartButton").onclick = startRun;
element("attackButton").onclick = () => { if (phase === "playing") ship.skill(65); };
element("shieldButton").onclick = () => { if (phase === "playing") { ship.skill(83); updateHud(); } };

const keyMap = { ArrowUp: "UP", ArrowRight: "RIGHT", ArrowDown: "DOWN", ArrowLeft: "LEFT", Space: "SPACE" };
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && event.target.closest("button")) return;
  if (!keyMap[event.code] && !["KeyA", "KeyS", "KeyP", "KeyR", "Escape"].includes(event.code)) return;
  event.preventDefault();
  if (event.repeat) return;
  if (event.code === "Escape" || event.code === "KeyP") { togglePause(); return; }
  if (event.code === "KeyR") { startRun(); return; }
  if (phase !== "playing") {
    if (event.code === "Space" && phase !== "dying") {
      if (phase === "paused") togglePause(); else startRun();
    }
    return;
  }
  if (keyMap[event.code]) keyType[keyMap[event.code]] = true;
  if (event.code === "KeyA") ship.skill(65);
  if (event.code === "KeyS") { ship.skill(83); updateHud(); }
});
document.addEventListener("keyup", function (event) {
  if (keyMap[event.code]) keyType[keyMap[event.code]] = false;
});

const canvas = element("view");
const context2d = canvas.getContext("2d");
canvas.height = vheight;
canvas.width = vwidth;
document.documentElement.style.setProperty("--play-width", `${vwidth}px`);
function pointerMove(event) {
  var rect = canvas.getBoundingClientRect();
  var x = Math.max(1, Math.min(w - 2, Math.floor((event.clientX - rect.left) / rect.width * w)));
  var y = Math.max(1, Math.min(h - 2, Math.floor((event.clientY - rect.top) / rect.height * h)));
  pendingTouchPosition = w * y + x;
}
canvas.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse" || phase !== "playing") return;
  if (activeTouchId !== null) { touchGestures.cancel(); return; }
  activeTouchId = event.pointerId;
  event.preventDefault();
  canvas.setPointerCapture(event.pointerId);
  if (event.pointerType === 'touch') touchGestures.start({ x: event.clientX, y: event.clientY }, event.timeStamp);
  touchFiring = true;
  pointerMove(event);
});
canvas.addEventListener("pointermove", (event) => {
  if (event.pointerId === activeTouchId && touchFiring && phase === "playing") {
    touchGestures.move({ x: event.clientX, y: event.clientY });
    pointerMove(event);
  }
});
canvas.addEventListener("pointerup", (event) => {
  if (event.pointerId !== activeTouchId) return;
  const gesture = phase === 'playing' ? touchGestures.end({ x: event.clientX, y: event.clientY }, event.timeStamp) : null;
  touchFiring = false; activeTouchId = null;
  if (gesture) { ship.skill(gesture === 'shield' ? 83 : 65); updateHud(); }
});
function cancelTouch(event) {
  if (event.pointerId !== activeTouchId) return;
  touchFiring = false; activeTouchId = null; touchGestures.cancel();
}
canvas.addEventListener("pointercancel", cancelTouch);
canvas.addEventListener("lostpointercapture", cancelTouch);
window.addEventListener("pagehide", () => records.flush());
window.addEventListener("blur", () => togglePause(true));
document.addEventListener("visibilitychange", () => { if (document.hidden) togglePause(true); });

function step(timestamp) {
  if (phase === "playing" || phase === "dying") {
    clock.advance(timestamp, () => {
      if (phase === "playing") { ship.previousPosition = ship.simulationPosition; actionMove(); }
      if (phase === "playing" || phase === "dying") updateSimulation();
      if (phase === "dying" && --deathFrames <= 0) {
        phase = "over";
        showOverlay("over");
        updateHud();
      }
    });
  } else clock.reset();
  if (phase === 'playing' || phase === 'dying') renderScene(clock.alpha);
  requestAnimationFrame(step);
}
showOverlay("ready");
updateHud();
requestAnimationFrame(step);

window.r = renderData;

//todo

// 來一點速度感的特效
//*把敵人也改成可以用其他磚塊拼

// 加入盾牌道具
// 加入近戰道具
// 玩家特殊技
