// First-encounter scripts approved with the A / classic window proposal.
export const dialogueCast={
  "pilot": {
    "name": "我方駕駛員",
    "image": "pilot"
  },
  "zark-zero": {
    "name": "灰隼",
    "image": "zark-zero"
  },
  "fort": {
    "name": "FORT 管制核心",
    "image": "fort"
  },
  "zark-plus": {
    "name": "羅薇",
    "image": "zark-plus"
  },
  "ring-alpha": {
    "name": "雙環 α",
    "image": "ring-alpha"
  },
  "ring-beta": {
    "name": "雙環 β",
    "image": "ring-beta"
  },
  "survival": {
    "name": "求生獵手",
    "image": "survival"
  },
  "turret": {
    "name": "砲台火控核心",
    "image": "turret"
  },
  "legacy-a": {
    "name": "舊巨獸 α",
    "image": "legacy-a"
  },
  "legacy-b": {
    "name": "舊巨獸 β",
    "image": "legacy-b"
  }
};
export const dialogueEvents=[
  {
    "id": "patrol",
    "title": "01 初航巡邏",
    "enemies": [
      "zark-zero"
    ],
    "lines": [
      {
        "actor": "zark-zero",
        "text": "未登錄機，這裡是封鎖空域。立刻掉頭。",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "通訊還能接通……你們為什麼封鎖撤離航道？",
        "action": ""
      },
      {
        "actor": "zark-zero",
        "text": "命令不是給你討論的。攔截！",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "那就先穿過你的火線。",
        "action": ""
      }
    ]
  },
  {
    "id": "fort",
    "title": "02 交叉火網",
    "enemies": [
      "fort"
    ],
    "lines": [
      {
        "actor": "fort",
        "text": "識別失敗。追蹤解算完成。",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "砲口在跟著我轉……不能只往同一邊躲。",
        "action": ""
      }
    ]
  },
  {
    "id": "plus",
    "title": "02 高速截擊",
    "enemies": [
      "zark-plus"
    ],
    "lines": [
      {
        "actor": "zark-plus",
        "text": "巡邏隊讓開。白色機，你的轉向我看見了。",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "速度比剛才快。留好退路，別被她逼到邊緣。",
        "action": ""
      }
    ]
  },
  {
    "id": "rings",
    "title": "03 雙環封鎖",
    "enemies": [
      "ring-alpha",
      "ring-beta"
    ],
    "lines": [
      {
        "actor": "ring-alpha",
        "text": "主鎖定成立。封鎖正前方。",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "兩個核心……不是單機。",
        "action": ""
      },
      {
        "actor": "ring-beta",
        "text": "側翼同步。壓縮通行區域。",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "不能停在交叉線上。先看清一側，再找缺口。",
        "action": ""
      }
    ]
  },
  {
    "id": "hunter",
    "title": "05 求生獵手",
    "enemies": [
      "survival"
    ],
    "lines": [
      {
        "actor": "survival",
        "text": "……嘶——",
        "action": "壓低身體，目光掠過戰機，轉向後方的空隙。"
      },
      {
        "actor": "pilot",
        "text": "牠沒有一直盯著我……是在找出口。",
        "action": ""
      },
      {
        "actor": "survival",
        "text": "喀、喀……！",
        "action": "假意後退，頸部卻先轉向側面，尾巴緩慢蓄力。"
      },
      {
        "actor": "pilot",
        "text": "是假退！別追著牠的頭，注意身體和尾巴。",
        "action": ""
      },
      {
        "actor": "survival",
        "text": "嗚——吼！",
        "action": "護住受傷的軀幹，張口威嚇；喉部閃過灼熱亮光。"
      },
      {
        "actor": "pilot",
        "text": "牠在求生。先保住距離，別把自己送進牠的近身範圍。",
        "action": ""
      }
    ]
  },
  {
    "id": "turret",
    "title": "08 突破封鎖",
    "enemies": [
      "turret"
    ],
    "lines": [
      {
        "actor": "turret",
        "text": "四向火控就緒。散射封鎖開始。",
        "action": ""
      },
      {
        "actor": "pilot",
        "text": "彈幕會向外展開。先找空隙，別等它合上才動。",
        "action": ""
      }
    ]
  },
  {
    "id": "legacy",
    "title": "12 雙獸壓境",
    "enemies": [
      "legacy-a",
      "legacy-b"
    ],
    "lines": [
      {
        "actor": "legacy-a",
        "text": "吼——！",
        "action": "正面抬頭，喉部紫光增強。"
      },
      {
        "actor": "pilot",
        "text": "不是剛才那隻……還有第二個熱源！",
        "action": ""
      },
      {
        "actor": "legacy-b",
        "text": "嗚……吼！",
        "action": "從側翼逼近，與前方個體拉開位置。"
      },
      {
        "actor": "pilot",
        "text": "一隻壓住正面，一隻繞到側邊。牠們在配合。",
        "action": ""
      },
      {
        "actor": "legacy-a",
        "text": "嘎——吼！",
        "action": "頭部轉向，沿前方展開掃射姿態。"
      },
      {
        "actor": "pilot",
        "text": "別被夾住。留意兩隻的頭部，先保留能穿出的方向。",
        "action": ""
      }
    ]
  }
];
