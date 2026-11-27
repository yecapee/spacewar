import {actors,encounters} from '../content.mjs';
const $=s=>document.querySelector(s);
const variant=document.body.dataset.variant;
const params=new URLSearchParams(location.search);
const embedded=params.get('embed')==='1';
document.body.classList.toggle('embed',embedded);
const sceneId=params.get('scene');
let scene=encounters.find(e=>e.id===sceneId)||encounters.find(e=>e.id==='hunter');
let index=1,typed=0,timer,autoTimer,auto=false,ended=false,log=[];
const overrides={
 patrol:[['zark-zero','未登錄機，立刻掉頭！',''],['pilot','你們為什麼封鎖\n撤離航道？',''],['zark-zero','這是命令。\n全隊，開始攔截！',''],['pilot','那就先穿過\n你的火線。','']],
 fort:[['fort','識別失敗。\n追蹤解算完成。',''],['pilot','砲口跟著我轉……\n不能只往一邊躲。','']],
 plus:[['zark-plus','白色機，\n你的轉向我看見了。',''],['pilot','她的速度更快。\n不能被逼到邊緣！','']],
 rings:[['ring-alpha','主鎖定成立。\n封鎖正前方。',''],['pilot','兩個核心……\n不是單機！',''],['ring-beta','側翼同步。\n壓縮通行區域。',''],['pilot','別停在交叉線上。\n先找一側的缺口！','']],
 hunter:[['survival','……嘶——','壓低身體，目光轉向後方的空隙。'],['pilot','牠在找出口……\n先別堵住牠。',''],['survival','喀、喀……！','假意後退，尾巴卻緩慢蓄力。'],['pilot','是假退！\n注意牠的身體和尾巴！',''],['survival','嗚——吼！','護住受傷的軀幹，喉部泛起熱光。'],['pilot','熱源升高了！\n閃開牠的嘴部方向！','']],
 turret:[['turret','四向火控就緒。\n散射封鎖開始。',''],['pilot','彈幕正在展開。\n趁空隙還在，穿過去！','']],
 legacy:[['legacy-a','吼——！','正面個體抬頭，喉部紫光增強。'],['pilot','不是剛才那隻……\n還有第二個熱源！',''],['legacy-b','嗚……吼！','側翼個體繞行，與同伴拉開位置。'],['pilot','正面牽制、側面夾擊。\n牠們在配合！',''],['legacy-a','嘎——吼！','頭部轉向，準備沿前方掃射。'],['pilot','別被夾住！\n先留好撤出的方向！','']]
};
const lines=()=>overrides[scene.id].map(([actor,text,action])=>({actor,text,action}));
function portrait(image,id){
 image.src=`../assets/${actors[id].image}.webp`;
 image.alt=actors[id].name+'頭像';
}
function stop(){clearInterval(timer);clearTimeout(autoTimer);}
function setEnemy(id){$('#enemy-name').textContent=actors[id].name;portrait($('#enemy-portrait'),id);const a=actors[id];$('#target').src=a.sprite?`../assets/a22-${a.sprite}.png`:`../assets/${a.image}.webp`;$('#target').classList.toggle('creature',!a.sprite);}
function schedule(){clearTimeout(autoTimer);if(auto&&!ended)autoTimer=setTimeout(advance,2200);}
function buttonLabel(){$('#next').textContent=ended?'重新播放':typed<lines()[index].text.length?'顯示整句':'繼續';}
function complete(){clearInterval(timer);typed=lines()[index].text.length;$(lines()[index].actor==='pilot'?'#ally-text':'#enemy-text').textContent=lines()[index].text;buttonLabel();schedule();}
function render(){stop();ended=false;const line=lines()[index],isAlly=line.actor==='pilot';
 $('#enemy-panel').classList.toggle('inactive',isAlly);$('#enemy-panel').classList.toggle('active',!isAlly);
 $('#ally-panel').classList.toggle('inactive',!isAlly);$('#ally-panel').classList.toggle('active',isAlly);
 if(!isAlly)setEnemy(line.actor);
 $('#action').textContent=line.action||([...lines().slice(0,index+1)].reverse().find(l=>l.action)?.action)||'通訊接續中';
 $('#progress').textContent=`${String(index+1).padStart(2,'0')} / ${String(lines().length).padStart(2,'0')}`;
 $('#scene-tag').textContent=scene.title;
 const target=$(isAlly?'#ally-text':'#enemy-text');target.textContent='';typed=0;log=lines().slice(0,index+1);buttonLabel();
 if(embedded||matchMedia('(prefers-reduced-motion: reduce)').matches){complete();return;}
 timer=setInterval(()=>{typed++;target.textContent=line.text.slice(0,typed);if(typed>=line.text.length)complete();},45);
}
function begin(firstPair=false){for(const link of document.querySelectorAll('[data-variant-link]'))link.href=link.dataset.variantLink+'.html?scene='+scene.id;stop();index=firstPair?1:0;$('#ally-text').textContent='……確認前方訊號。';setEnemy(scene.enemies[0]);$('#enemy-text').textContent=lines()[0].text;render();}
function advance(){if(ended){begin();return;}if(typed<lines()[index].text.length){complete();return;}if(index<lines().length-1){index++;render();}else{stop();ended=true;$('#progress').textContent='END';$('#action').textContent='對話演出結束 · 原有戰鬥機制尚未接入';buttonLabel();}}
portrait($('#ally-portrait'),'pilot');
$('#scene').replaceChildren(...encounters.map(e=>{const o=document.createElement('option');o.value=e.id;o.textContent=e.title;return o;}));$('#scene').value=scene.id;
$('#scene').onchange=e=>{scene=encounters.find(s=>s.id===e.target.value);for(const link of document.querySelectorAll('[data-variant-link]'))link.href=link.dataset.variantLink+'.html?scene='+scene.id;begin(true);};
$('#next').onclick=advance;$('#replay').onclick=()=>begin();
$('#auto').onclick=()=>{auto=!auto;$('#auto').setAttribute('aria-pressed',String(auto));$('#auto').textContent=auto?'自動：開':'自動';if(auto&&typed>=lines()[index].text.length&&!ended)schedule();else clearTimeout(autoTimer);};
const logDialog=$('#log');$('#history').onclick=()=>{if(!ended)complete();clearTimeout(autoTimer);$('#log-lines').replaceChildren(...log.map(l=>{const d=document.createElement('div');d.className='log-line';const b=document.createElement('b'),p=document.createElement('p');b.textContent=actors[l.actor].name;p.textContent=l.text;d.append(b,p);if(l.action){const s=document.createElement('small');s.textContent=l.action;d.append(s);}return d;}));logDialog.showModal();};$('#close-log').onclick=()=>logDialog.close();logDialog.addEventListener('close',()=>{if(auto&&!ended)schedule();});
document.addEventListener('keydown',e=>{if(logDialog.open||['BUTTON','A','SELECT','INPUT','TEXTAREA'].includes(document.activeElement.tagName))return;if(e.code==='Space'||e.code==='Enter'){e.preventDefault();advance();}});
$('#battle').addEventListener('click',e=>{if(e.target.closest('button,a,select'))return;advance();});
begin(true);
