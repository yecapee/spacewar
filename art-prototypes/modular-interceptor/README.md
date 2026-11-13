# 模組化戰機 3D 原型

以簡化低多邊形造型探索主角機：中央駕駛艙、固定後置引擎、雙側武器匣與雙節折臂。普通型態收攏；攻擊型態展開折臂、後滑護蓋並伸出砲管。此資料夾為獨立美術原型，尚未接入遊戲。

## 檔案

- `modular-interceptor.glb`：普通型態起始，包含 `Deploy` 與 `Retract` 兩段各 2 秒動畫。
- `modular-interceptor-normal.glb`：普通型態靜態模型。
- `modular-interceptor-attack.glb`：攻擊型態靜態模型。
- `preview.html`：互動預覽，可拖曳旋轉、滾輪縮放、切換型態及拖曳展開滑桿。首次開啟需要網路載入固定版本 Three.js。
- `model.mjs`：模型幾何與折臂機構來源。
- `export.mjs`：匯出 GLB 與機構檢查。

模型使用獨立命名零件、純材質且無外部貼圖，共 86 個 mesh、4,344 個三角形。機頭朝 -Z，上方為 +Y；尺寸為概念設計單位。

## 重新匯出

匯出程式需要 Three.js 0.170.0。可在專用工具目錄安裝，透過 `SPACEWAR_THREE_ROOT` 指向該套件根目錄，不需要更動遊戲依賴：

```sh
SPACEWAR_THREE_ROOT=/path/to/three node art-prototypes/modular-interceptor/export.mjs
```

匯出時檢查 101 個展開進度，確認兩節折臂維持固定長度，並檢查幾何資料與 GLB 結構。已另行重新載入動畫 GLB，確認兩段動畫的終點位置與原始模型一致。
