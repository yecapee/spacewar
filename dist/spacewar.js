require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var s=e[n]=new t.Module(n);r[n][0].call(s.exports,i,s,s.exports)}return e[n].exports}function o(r){this.id=r,this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.isParcelRequire=!0,t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({10:[function(require,module,exports) {

},{"./img/spacebg.png":[["0be558690d0b1f803f034b043d9bd2f2.png",21],21]}],18:[function(require,module,exports) {
var e={isMobile:function(){var e,i=!1;return e=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|iPad|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(i=!0),i}},i=(e.isMobile(),40),o=(e.isMobile(),30),t=e.isMobile()?60:40,a=8,r=e.isMobile()?10:15,n=e.isMobile()?window.innerWidth:window.innerHeight>=window.innerWidth?window.innerWidth:window.innerHeight/4*3,s=window.innerHeight;exports.atc=e,exports.moveFps=i,exports.bulletFps=o,exports.controlFps=t,exports.pixelWeigth=r,exports.vwidth=n,exports.vheight=s,exports.w=Math.floor(n/r),exports.h=Math.floor(s/r),exports.renderTime=1e3/i,exports.bulletTime=1e3/o,exports.controlTime=1e3/t,exports.shotTime=1e3/a,exports.moveTime=1e3/30,exports.shipLife=5,exports.renderData={enemy:[],enemyBullet:[],aniEffect:[]};
},{}],11:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var w=require("./config");exports.default={zark:function(u){var r=[u];return u%w.w!=w.w-1&&r.push(u-w.w+1),u%w.w==0&&0!=u||r.push(u-w.w-1),r},fort:function(u){var r=[u];return u%w.w!=w.w-1&&r.push(u-w.w+1),u%w.w==0&&0!=u||r.push(u-w.w-1),u-2*w.w>0&&r.push(u-2*w.w),r},point:function(w){return[w]},"MK-1":function(u){var r=[u,u+w.w,u+3*w.w];return u%w.w!=w.w-1&&(r.push(u+2*w.w+1),r.push(u+3*w.w+2),r.push(u+4*w.w+1)),u%w.w!=0&&(r.push(u+2*w.w-1),r.push(u+3*w.w-2),r.push(u+4*w.w-1)),r},"MK-2":function(u){var r=[u,u+w.w,u+3*w.w];return u%w.w!=w.w-1&&r.push(u+2*w.w+1),u%w.w!=0&&r.push(u+2*w.w-1),r},"MK-3":function(u){var r=[u,u+w.w,u+2*w.w,u+4*w.w];return u%w.w!=w.w-1&&(r.push(u+2*w.w+1),r.push(u+3*w.w+1)),u%w.w!=0&&(r.push(u+2*w.w-1),r.push(u+3*w.w-1)),r}};
},{"./config":18}],12:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var i=require("./config");function t(t){var n=this.mainX-this.mainX%i.w,e=n+i.w-1;return this.mainX+=i.w,t>e?e:t<n?n:t}exports.default={goStop:function(){var t=this;this.getST()<6&&(this.position+=i.w),this.getST()>80&&(this.position+=i.w),this.position>i.w*i.h-1&&i.renderData.enemy.find(function(n,e){n===t&&i.renderData.enemy.splice(e,1)})},gostMove:function(){var n=this,e=(Math.floor(this.position/i.h),i.h/4),o=Math.floor(this.mainX/i.w),s=Math.sin(Math.PI/e*o),a=Math.floor(s*e);this.position=t.call(this,this.mainX+a),this.position>i.w*i.h-1&&i.renderData.enemy.find(function(t,e){t===n&&i.renderData.enemy.splice(e,1)})},goToOut:function(){this.position+=i.w;var t=this;this.position>i.w*i.h-1&&i.renderData.enemy.find(function(n,e){n===t&&i.renderData.enemy.splice(e,1)})}};
},{"./config":18}],16:[function(require,module,exports) {
"use strict";var e=require("./config");exports.animation=function(n,r){var i=1;return function t(a){i==n&&e.renderData.aniEffect.splice(e.renderData.aniEffect.indexOf(t),1),r(i,a),i++}};
},{"./config":18}],17:[function(require,module,exports) {
"use strict";var i=require("./config");exports.positionToXY=function(t){var o=t%i.w,e=Math.round((t-o)/i.w);return{ps:t,x:o*i.pixelWeigth+i.pixelWeigth/2,y:e*window.innerHeight/i.h,__x:o,__y:e,limit:i.w*i.h-1}},exports.xyToPosition=function(t,o){var e=(t-i.pixelWeigth/2)/i.pixelWeigth;return o/i.pixelWeigth*i.w+e},exports.positionTosXsY=function(t){var o=t%i.w;return{x:o,y:Math.round((t-o)/i.w)}},exports.sXsYToPosition=function(t,o){return o*i.w+t};
},{"./config":18}],22:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var o=require("./config"),i=require("./positionMethod");exports.default={normal:function(t,n){var r=t,s=45;return function(t){s--;var n=(0,i.positionTosXsY)(r),e=(0,i.positionTosXsY)(r+o.w*o.h),u=1/45*(45-s),a=Math.round(n.x+(e.x-n.x)*u),l=Math.round(n.y+(e.y-n.y)*u),x=(0,i.positionToXY)(r),p=(0,i.positionToXY)(r+o.w*o.h),y=(u=1/45*(45-s),x.x+(p.x-x.x)*u),c=x.y+(p.y-x.y)*u;return{position:(0,i.sXsYToPosition)(a,l),x:y,y:c,look:"laser",w:20,h:60,clear:s<-1}}},track:function(t,n){var r=t,s=n||30,e=null,u=null;return function(t){var n=(0,i.positionTosXsY)(r);e||(e=(0,i.positionTosXsY)(t));var a=1/30*(30-s),l=Math.round(n.x+(e.x-n.x)*a),x=Math.round(n.y+(e.y-n.y)*a),p=(0,i.positionToXY)(r),y=o.pixelWeigth/2;u||(u=(0,i.positionToXY)(t));a=1/30*(30-s);var c=p.x+y+(u.x-p.x+y)*a,h=p.y+0+(u.y-p.y+0)*a;return s--,{position:(0,i.sXsYToPosition)(l,x),x:c,y:h,look:"bulletBall",w:15,h:15,clear:s<-15||l<0||l>o.w-1}}}};
},{"./config":18,"./positionMethod":17}],14:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(t){this.name=t.name,this.life=t.life,this.mainX=t.position,this.position=t.position,this.shot=t.shot,this.shotTime=t.shotTime,this.movePath=t.movePath,this.moveTime=t.moveTime||1,this.look=t.look,this.bulletType=t.bulletType||"normal";var e=t.deadCb||function(){},o=!1,h=0;this.getST=function(){return h},this.wasHit=function(t,e,s){var n=this;i.default[this.look](this.position).includes(t)&&(o=!0,this.life--,this.life<1?(l.renderData.enemy.find(function(t,i){if(t===n){localStorage.getItem("bestScore");l.renderData.enemy.splice(i,1)}}),this.dead()):(this.grapic.call(this,e),s&&s()))},this.grapic=function(t){var e=o?"red":"white";i.default[this.look](this.position).forEach(function(i,o){var s=(0,n.positionToXY)(i);t.beginPath(),t.rect(s.x-l.pixelWeigth/2,s.y,l.pixelWeigth,l.pixelWeigth),t.fillStyle=e,t.fill()})},this.action=function(t,i,e){if(this.grapic.call(this,i),"OBJ_MOVE"===t){if(u.call(this),h%this.shotTime[0]<this.shotTime[1])h%this.shotTime[0]%this.shotTime[2]==0&&this.shot&&f(this.position,this.bulletType,e);h++,o=!1}},this.dead=function(){var t=this.position,i=(0,n.positionToXY)(t),o=document.getElementById("explosion");l.renderData.aniEffect.push((0,s.animation)(50,function(t,e){e.drawImage(o,i.x-(50-t)/2,i.y,120-t,120-t)})),e()}};var t=require("./lookPath"),i=r(t),e=require("./movePathList"),o=r(e),s=require("./aniEffectMethod"),n=require("./positionMethod"),h=require("./enemyBulletType"),a=r(h),l=require("./config");function r(t){return t&&t.__esModule?t:{default:t}}function u(){o.default[this.movePath]&&this.getST()%this.moveTime==0&&o.default[this.movePath].call(this)}function f(t,i,e){var o=l.renderData.enemyBullet,s=a.default[i](t);o.reduce(function(i,e){return i||e.data.position===t},!1)||o.push({data:s(e),fn:s})}
},{"./lookPath":11,"./movePathList":12,"./aniEffectMethod":16,"./positionMethod":17,"./enemyBulletType":22,"./config":18}],13:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e,o){var t=a[e];t&&Object.keys(t).forEach(function(e){o[e]=t[e]})};var e=require("./config"),o=require("./createEnemy"),t=n(o);function n(e){return e&&e.__esModule?e:{default:e}}var m={name:"ZARK-ZERO",life:1,shot:!0,shotTime:[200,54,9],movePath:"gostMove",moveTime:5,look:"zark",bulletType:"normal"},l={name:"ZARK-ZERO",life:1,shot:!0,shotTime:[200,81,9],movePath:"gostMove",moveTime:3,look:"zark",bulletType:"normal"},i={name:"FORT",life:1,shot:!0,shotTime:[200,54,9],movePath:"goToOut",moveTime:5,look:"fort",bulletType:"track"},a={0:{enemy:[m],enemyPolling:[20,100],enemyQuantity:1},800:{enemy:[m,i],enemyPolling:[15,80],enemyQuantity:1},1600:{enemy:[l,i],enemyPolling:[15,75],enemyQuantity:1}};
},{"./config":18,"./createEnemy":14}],23:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./config"),o=require("./positionMethod");function r(r,t,i){var n=r;function u(r){n-=e.w;var t=(0,o.positionToXY)(n);return{position:n,x:t.x,y:t.y,look:"shipBulletNormal",w:20,h:60,clear:n<0}}t.push({data:u(),fn:u})}exports.default={normal:r,treble:function(e,o,t){r(e-1,o),r(e,o),r(e+1,o)}};
},{"./config":18,"./positionMethod":17}],15:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(i){this.name=i.name,this.life=i.life,this.deadPosition=i.position,this.position=i.position,this.killCount=0,this.bullet=[],this.bulletType="normal",this.look=i.look,this.isDead=!1;var e=i.deadCb||function(){};this.wasHit=function(i,e,n){var a=t.default[this.look](this.position),o=r.renderData.enemy.reduce(function(i,e){return[].concat(f(i),f(t.default[e.look](e.position)))},[]),h=a.reduce(function(i,t){return i||o.includes(t)},!1);(a.includes(i)||a.includes(i+r.w)||h)&&(this.life--,r.renderData.aniEffect.push((0,s.animation)(10,function(i,t){a.forEach(function(i,e){var n=(0,l.positionToXY)(i);t.fillStyle="rgba(255,0,0,.8)",t.fillRect(n.x-r.pixelWeigth/2,n.y,r.pixelWeigth,r.pixelWeigth+1)})}.bind(this))),r.renderData.enemyBullet.splice(e,1),this.life<1&&(this.life=0,this.isDead=!0,this.dead()))},this.shot=function(){if(!this.isDead){o.default[this.bulletType](this.position,this.bullet);var i=this.position;r.renderData.aniEffect.push((0,s.animation)(30,function(t,e){var n=4+20*Math.random(),a=4+20*Math.random(),o=5*Math.random(),s=5*Math.random(),r=(0,l.positionToXY)(i),h=1/30*(30-t),f=(1-h)*(1-h)*r.x+2*h*(1-h)*r.x+h*h*(r.x-n),u=(1-h)*(1-h)*r.y+2*h*(1-h)*(r.y-n)+h*h*(r.y-n),d=(1-h)*(1-h)*r.x+2*h*(1-h)*r.x+h*h*(r.x+a),c=(1-h)*(1-h)*r.y+2*h*(1-h)*(r.y-a)+h*h*(r.y-a);e.fillStyle=t%2?"rgba(255,255,255,.8)":"rgba(255,255,0,.8)",e.fillRect(f-o,u,3,3),e.fillRect(d+s,c,3,3)}))}},this.grapic=function(i){var e=this.wasHit.bind(this),n=this.isDead;u.call(this),d.call(this,i),n||(t.default[this.look](this.position).forEach(function(t,e){var n=(0,l.positionToXY)(t);i.beginPath(),i.rect(n.x-r.pixelWeigth/2,n.y,r.pixelWeigth,r.pixelWeigth+1),i.fillStyle="white",i.fill()}),r.renderData.enemyBullet.forEach(function(t,n){e(t.data.position,n,i)}))},this.dead=function(){var t=this.position,n=(0,l.positionToXY)(t),a=document.getElementById("explosion");r.renderData.aniEffect.push((0,s.animation)(50,function(t,e){e.drawImage(a,n.x-(50-t)/2,n.y,120-t,120-t),50==t&&(this.life=i.life,this.position=this.deadPosition,this.isDead=!1,this.bullet=[])}.bind(this))),e()}};var i=require("./lookPath"),t=h(i),e=require("./movePathList"),n=h(e),a=require("./shipBulletType"),o=h(a),s=require("./aniEffectMethod"),l=require("./positionMethod"),r=require("./config");function h(i){return i&&i.__esModule?i:{default:i}}function f(i){if(Array.isArray(i)){for(var t=0,e=Array(i.length);t<i.length;t++)e[t]=i[t];return e}return Array.from(i)}function u(){var i=this.bullet;for(var t in i)i[t].data=i[t].fn(),i[t].data.clear&&i.splice(t,1)}function d(i){var t=r.renderData.enemyBullet,e=this.bullet;e.map(function(n){var a=n.data.position,o=document.getElementById(n.data.look);i.drawImage(o,n.data.x-6.5,n.data.y-5,13,64),t.forEach(function(i,o){i.data.position===a&&(t.splice(o,1),e.splice(e.indexOf(n),1)),i.data.position===a+r.w&&(t.splice(o,1),e.splice(e.indexOf(n),1))}),r.renderData.enemy.map(function(t){t.wasHit(a,i,function(){e.splice(e.indexOf(n),1)}),t.wasHit(a+r.w,i,function(){e.splice(e.indexOf(n),1)})})})}
},{"./lookPath":11,"./movePathList":12,"./shipBulletType":23,"./aniEffectMethod":16,"./positionMethod":17,"./config":18}],2:[function(require,module,exports) {
"use strict";require("./main.css");var e=require("./js/lookPath"),t=h(e),n=require("./js/movePathList"),o=h(n),i=require("./js/script"),a=h(i),r=require("./js/createEnemy"),c=h(r),u=require("./js/createShip"),d=h(u),l=require("./js/aniEffectMethod"),s=require("./js/positionMethod"),f=require("./js/config");function h(e){return e&&e.__esModule?e:{default:e}}var m,v=0,p=1,w=0,y=0,g={},E={UP:!1,RIGHT:!1,DOWN:!1,LEFT:!1,SPACE:!1};function M(e,t){var n={38:function(){"keydown"==t&&(E.UP=!0),"keyup"==t&&(E.UP=!1)},39:function(){"keydown"==t&&(E.RIGHT=!0),"keyup"==t&&(E.RIGHT=!1)},40:function(){"keydown"==t&&(E.DOWN=!0),"keyup"==t&&(E.DOWN=!1)},37:function(){"keydown"==t&&(E.LEFT=!0),"keyup"==t&&(E.LEFT=!1)},32:function(){"keydown"==t&&(E.SPACE=!0,B.shot()),"keyup"==t&&(E.SPACE=!1)}};n[e]&&n[e]()}function I(e){var t={UP:function(){var t=e.position;e.position=t-f.w>-1?t-f.w:t},RIGHT:function(){var t=e.position;t+1<=f.w*f.h-1&&(t+1)%f.w!=0&&(e.position=t+1)},DOWN:function(){var t=e.position,n=Math.round((t-t%f.w)/f.w);t+f.w<f.w*f.h&&(e.position=n<f.h?t+f.w:t)},LEFT:function(){var t=e.position;t-1>-1&&t%f.w!=0&&(e.position=t-1)},SPACE:function(){k()}};for(var n in E)1==E[n]&&t[n]();E.SPACE||L()}function k(){m||(m=setInterval(function(){B.shot()},f.shotTime))}function L(){clearInterval(m),m=null}function T(e){var t=f.renderData.enemyBullet;for(var n in t)t[n].data=t[n].fn(e),t[n].data.clear&&t.splice(n,1)}var B=new d.default({name:"MK-2",life:f.shipLife,position:f.w*Math.floor(f.h/2)-Math.floor(f.w/2),deadPosition:f.w*Math.floor(f.h/2)-Math.floor(f.w/2),look:"MK-2",deadCb:function(){w=0,v=0,p=100}});function P(e){var t=localStorage.getItem("bestScore")||0,n=localStorage.getItem("bestMileage")||0;if((0,a.default)(v,g),"OBJ_MOVE"===e){if(v==p){for(var o=0;o<g.enemyQuantity;o++){var i=g.enemy[v%g.enemy.length];i.position=Math.floor(Math.random()*f.w),i.deadCb=function(){t<++w&&localStorage.setItem("bestScore",w)};var r=new c.default(i);f.renderData.enemy.push(r)}p=v+Math.floor(Math.random()*g.enemyPolling[1]+g.enemyPolling[0])}y++,n<++v&&localStorage.setItem("bestMileage",v)}"BULLET_MOVE"===e&&T(B.position);var u=document.getElementById("view").getContext("2d");u.clearRect(0,0,f.vwidth,f.vheight),B.grapic(u),f.renderData.enemyBullet.map(function(e){(0,s.positionToXY)(e.data.position);var t=document.getElementById(e.data.look);u.drawImage(t,e.data.x-7.5,e.data.y-5,e.data.w,e.data.h)}),f.renderData.enemy.map(function(t){t.action(e,u,B.position)}),f.renderData.aniEffect.forEach(function(e){e(u)}),document.getElementById("view").style.backgroundPositionY=y+"px",document.getElementById("score").innerHTML='Score: <div class="score">'+w+"</div><br/> Mileage: "+v+"<br/>Best score: "+(localStorage.getItem("bestScore")||0)+"<br/> Best Mileage: "+n+"<br/> Life: "+B.life,document.getElementById("life").style.width=100/f.shipLife*B.life+"%"}function S(e){P(e)}function b(e){if((e=e||window.event).preventDefault(),e.touches[0]){var t=Math.floor(e.touches[0].pageX/f.pixelWeigth),n=Math.floor(e.touches[0].pageY/f.pixelWeigth),o=f.w*n+t;B.position=o,k()}}document.addEventListener("keydown",function(e){M(e.keyCode,"keydown")},!1),document.addEventListener("keyup",function(e){M(e.keyCode,"keyup")},!1),document.addEventListener("touchstart",b,!1),document.addEventListener("touchmove",b,!1),document.addEventListener("touchend",L,!1),document.getElementById("view").height=f.vheight,document.getElementById("view").width=f.vwidth,setInterval(function(){S("OBJ_MOVE")},f.renderTime),setInterval(function(){S("CONTROL_MOVE"),!f.atc.isMobile()&&I(B)},f.controlTime),setInterval(function(){S("BULLET_MOVE")},f.bulletTime);
},{"./main.css":10,"./js/lookPath":11,"./js/movePathList":12,"./js/script":13,"./js/createEnemy":14,"./js/createShip":15,"./js/aniEffectMethod":16,"./js/positionMethod":17,"./js/config":18}]},{},[2])