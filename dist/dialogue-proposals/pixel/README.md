# PS 像素對話窗提案

靜態比較入口 index.html，三個獨立頁：classic.html（鋼框藍窗）、tactical.html（灰綠戰術窗）、dramatic.html（黑底紫框）。三版維持敵方在上、我方在下，重點比較像素美術版型，並非上一輪的三種互動模式。

每頁支援七段初登場情境、逐字顯示、點擊畫面或 Space／Enter 推進、自動、重播及對話紀錄。?scene=hunter 可直連情境；?embed=1 為比較頁使用的雙方完整靜態縮圖。

介面由 HTML/CSS 繪製，沒有直接貼官方遊戲 UI。三版分別改變金屬框構造、頭像嵌入或外掛位置、姓名牌與階梯切角。頭像沿用先前原創素材，直接顯示清晰的賽璐璐圖片，不做像素化；像素風僅用在 UI。對白為既有稿的短句演出版，怪獸保留叫聲與動作表意。

繁體像素字型來自 TakWolf/fusion-pixel-font 官方 GitHub 2026.11.10 版，12px monospaced zh_hant OTF WOFF2。OFL 及三個上游字體的授權文字均存於 fonts/。無外部字型 CDN 依賴。

來源：
- https://github.com/TakWolf/fusion-pixel-font/releases/tag/2026.11.10
- https://www.mamecn.com/game/2268922/ （F 完結篇畫面研究，未取用其圖像作為頁面資產）
- https://www.video-games-museum.com/en/game/Super-Robot-Taisen-Alpha-Gaiden/31/2/36955 （α 外傳畫面研究）

build-game.cjs 保留整個 pixel 子頁。主遊戲沒有註冊對白或改變戰鬥時計。
