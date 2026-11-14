SPACEWAR 怪獸獨立遭遇戰（修正版）

此頁直接 import 專案 index.js，完全共用原有遊戲迴圈。
戰機：原本 5 格生命、方向鍵移動、Space 向上連射。
A：原本的攻擊波／短雷射；S：原本的粒子空氣盾。
手機：拖曳移動並射擊、畫圈放盾、雙擊攻擊波。
P / Esc 暫停，R 重開。

獨立腳本 survival-controller.mjs 只負責怪獸決策與位移。
它依賴同資料夾的 creature-actions.mjs（動作參數）、body-motion.mjs（關節擺動），以及專案 js/kaijuSweep.mjs（原本的投影方向換算）。
AI、動作參數與關節擺動可分別調整；控制器不建立戰機、不修改戰機 HP、不建立自己的彈道系統。
怪獸生命沿用原本 GOZILLA 的 800，所有承傷由既有 wasHit 流程產生。
肉搏呼叫既有 ship.injured，熱射線共用 js/kaijuAttack.mjs，沿用粒子盾攔截與受傷無敵時間。

viewer.mjs：載入 setup.mjs，再載入原本 index.js。
setup.mjs：只註冊獨立遭遇戰，主遊戲不會載入這個模組。
spacewar-visual.mjs：既有減面模型、骨架姿勢、嘴部與投影命中輪廓。
spacewar-attack.mjs：怪獸肉搏判定與既有熱射線技能的接合。

AI 最近 8 秒實際掉血達 48 且仍受威脅時，預警→張嘴蓄熱→射線→衰弱撤離。
射線冷卻 16 秒；沒有受傷時，不會按固定週期放射線。
下方可指定下一個移動、肉搏或欺騙動作；射線不能手動繞過承傷條件。

驗證：node --test tests/survivalEncounter.test.mjs
此版本取代先前自行建立的戰鬥模擬場。

全身連動：body-motion.mjs 驅動骨盆、兩節軀幹、兩節頸部、頭部與十五節尾骨，共 21 個既有加權關節；固定 40 Hz 更新，逐節延遲、步態波與急停慣性，蓄熱／射線時穩定頭頸。
