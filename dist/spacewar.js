require=function(r,e,n){function t(n,o){function i(r){return t(i.resolve(r))}function f(e){return r[n][1][e]||e}if(!e[n]){if(!r[n]){var c="function"==typeof require&&require;if(!o&&c)return c(n,!0);if(u)return u(n,!0);var l=new Error("Cannot find module '"+n+"'");throw l.code="MODULE_NOT_FOUND",l}i.resolve=f;var s=e[n]=new t.Module(n);r[n][0].call(s.exports,i,s,s.exports)}return e[n].exports}function o(r){this.id=r,this.bundle=t,this.exports={}}var u="function"==typeof require&&require;t.isParcelRequire=!0,t.Module=o,t.modules=r,t.cache=e,t.parent=u;for(var i=0;i<n.length;i++)t(n[i]);return t}({10:[function(require,module,exports) {

},{"./img/spacebg.png":[["21b8e1d576e52bb748c5ee8b4b661590.png",23],23]}],18:[function(require,module,exports) {
var e={isMobile:function(){var e,i=!1;return e=navigator.userAgent||navigator.vendor||window.opera,(/(android|bb\d+|meego).+mobile|iPad|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|webgolds|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(i=!0),i}},i=(e.isMobile(),40),o=(e.isMobile(),30),t=e.isMobile()?60:40,a=e.isMobile()?10:15,r=e.isMobile()?window.innerWidth:window.innerHeight>=window.innerWidth?window.innerWidth:window.innerHeight/4*3,n=window.innerHeight;exports.atc=e,exports.moveFps=i,exports.bulletFps=o,exports.controlFps=t,exports.pixelWeigth=a,exports.vwidth=r,exports.vheight=n,exports.w=Math.floor(r/a),exports.h=Math.floor(n/a),exports.renderTime=1e3/i,exports.bulletTime=1e3/o,exports.controlTime=1e3/t,exports.moveTime=1e3/30,exports.shipLife=5,exports.renderData={enemy:[],enemyBullet:[],aniEffect:[],item:[]};
},{}],17:[function(require,module,exports) {
"use strict";var t=require("./config"),o=function(o){var r=o%t.w;return{x:r,y:Math.round((o-r)/t.w)}};exports.positionToXY=function(o){var r=o%t.w,i=Math.round((o-r)/t.w);return{ps:o,x:r*t.pixelWeigth+t.pixelWeigth/2,y:i*window.innerHeight/t.h,__x:r,__y:i,limit:t.w*t.h-1}},exports.xyToPosition=function(o,r){var i=(o-t.pixelWeigth/2)/t.pixelWeigth;return r/t.pixelWeigth*t.w+i},exports.positionTosXsY=o,exports.sXsYToPosition=function(o,r){return r*t.w+o},exports.ezPosition=function(o){var r=o;return function(o,i){return r+i*t.w+o}},exports.ezPositionWithCheckScope=function(r){var i=r,n=o(i);return function(o,r){var e=n.x+o,u=n.y+r,x=i+r*t.w+o;return e<0||e>t.w-1||u<0||u>t.h-1?void 0:x}},exports.touchScope=function(r){var i=o(r);return{TOP:0===i.y,RIGHT:i.x===t.w-1,BOTTOM:i.y===t.h-1,LEFT:0===i.x}},exports.outScope=function(r){var i=o(r);return{TOP:i.y<0,RIGHT:i.x>t.w-1,BOTTOM:i.y>t.h-1,LEFT:i.x<0}};
},{"./config":18}],12:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var r=require("./config"),p=require("./positionMethod");function s(r){if(Array.isArray(r)){for(var p=0,s=Array(r.length);p<r.length;p++)s[p]=r[p];return s}return Array.from(r)}function c(s,c,e,i,t,n){var o=2*Math.PI/i,u=2*Math.PI/360*(n||0),y=Math.round(s+e*Math.cos(o*t+u)),a=Math.round(c+e*Math.sin(o*t+u));return{position:(0,p.sXsYToPosition)(y,a),outScope:y<0||y>r.w-1||a<0||a>r.h-1}}function e(){var r=0;return function(s,e){for(var i=(0,p.positionTosXsY)(s),t=[],n=0;n<=8;n++){var o=c(i.x,i.y,5,8,n,Math.round(r/20));!o.outScope&&t.push(o.position)}return e||r++,t}}exports.default={zark:function(p){var s=[p];return p%r.w!=r.w-1&&s.push(p-r.w+1),p%r.w==0&&0!=p||s.push(p-r.w-1),s},fort:function(p){var s=[p];return p%r.w!=r.w-1&&s.push(p-r.w+1),p%r.w==0&&0!=p||s.push(p-r.w-1),p-2*r.w>0&&s.push(p-2*r.w),s},point:function(r){return[r]},"hp+":function(p){var c=[];return p%r.w-1>0&&(c=[].concat(s(c),[p-r.w-1,p+r.w-1])),p%r.w+1<r.w&&(c=[].concat(s(c),[p-r.w+1,p+r.w+1])),c},SPIDER:function(c){var e=(0,p.ezPosition)(c),i=[e(0,0)];return c%r.w!=r.w-1&&(i=[].concat(s(i),[e(1,-1),e(1,-2),e(1,1)])),c%r.w!=0&&(i=[].concat(s(i),[e(-1,-1),e(-1,-2),e(-1,1)])),i},"crystal-plus":function(r,s){var c=(0,p.ezPositionWithCheckScope)(r),e=[],i="OPEN"===s;return i&&(e=[{ps:c(-1,-1),brickType:"d0"},{ps:c(1,-1),brickType:"b0"},{ps:c(-2,0),brickType:"d0"},{ps:c(-1,0),brickType:"d1"},{ps:c(0,0),brickType:"7"},{ps:c(1,0),brickType:"b1"},{ps:c(2,0),brickType:"b0"},{ps:c(-2,1),brickType:"crystal5"},{ps:c(-1,1),brickType:"2"},{ps:c(0,1),brickType:"5"},{ps:c(1,1),brickType:"3"},{ps:c(2,1),brickType:"crystal3"}]),i||(e=[{ps:c(0,-1),brickType:"crystal1"},{ps:c(-2,0),brickType:"d0"},{ps:c(-1,0),brickType:"d0"},{ps:c(0,0),brickType:"0"},{ps:c(1,0),brickType:"b0"},{ps:c(2,0),brickType:"b0"},{ps:c(-2,1),brickType:"crystal5"},{ps:c(-1,1),brickType:"crystal5"},{ps:c(0,1),brickType:"crystal4"},{ps:c(1,1),brickType:"crystal3"},{ps:c(2,1),brickType:"crystal3"}]),e},"MK-1":function(p){var s=[p,p+r.w,p+3*r.w];return p%r.w!=r.w-1&&(s.push(p+2*r.w+1),s.push(p+3*r.w+2),s.push(p+4*r.w+1)),p%r.w!=0&&(s.push(p+2*r.w-1),s.push(p+3*r.w-2),s.push(p+4*r.w-1)),s},crystal:function(r,s){var c=(0,p.ezPositionWithCheckScope)(r),e=[],i="OPEN"===s;return i&&(e=[{ps:c(-1,-1),brickType:"d0"},{ps:c(1,-1),brickType:"b0"},{ps:c(-1,0),brickType:"d1"},{ps:c(0,0),brickType:"7"},{ps:c(1,0),brickType:"b1"},{ps:c(-1,1),brickType:"2"},{ps:c(0,1),brickType:"5"},{ps:c(1,1),brickType:"3"}]),i||(e=[{ps:c(0,-1),brickType:"crystal1"},{ps:c(-1,0),brickType:"d0"},{ps:c(0,0),brickType:"0"},{ps:c(1,0),brickType:"b0"},{ps:c(-1,1),brickType:"crystal5"},{ps:c(0,1),brickType:"crystal4"},{ps:c(1,1),brickType:"crystal3"}]),e},"MK-2.LIGHT":function(s){var c=(0,p.ezPosition)(s),e=[c(0,0),c(0,3)];return s%r.w!=r.w-1&&e.push(c(1,2)),s%r.w!=0&&e.push(c(-1,2)),e},"MK-3":function(p){var s=[p,p+r.w,p+2*r.w,p+4*r.w];return p%r.w!=r.w-1&&(s.push(p+2*r.w+1),s.push(p+3*r.w+1)),p%r.w!=0&&(s.push(p+2*r.w-1),s.push(p+3*r.w-1)),s},CIRCLE:e()};
},{"./config":18,"./positionMethod":17}],11:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var i=require("./config"),t=require("./positionMethod");function o(t){var o=this.mainX-this.mainX%i.w;return t>o+i.w-1?(this.mainX-=1,-1):t<o?(this.mainX+=1,-1):(this.mainX+=i.w,t)}exports.default={goStop:function(){var t=this;this.getST()<6&&(this.position+=i.w),this.getST()>80&&(this.position+=i.w),this.position>i.w*i.h-1&&i.renderData.enemy.find(function(o,s){o===t&&i.renderData.enemy.splice(s,1)})},gostMove:function(){var t=this,s=(Math.floor(this.position/i.h),i.h/4),n=Math.floor(this.mainX/i.w),h=Math.sin(Math.PI/s*n),e=Math.floor(h*s);for(this.position=o.call(this,this.mainX+e);-1==this.position;)this.position=o.call(this,this.mainX+e);this.position>i.w*i.h-1&&i.renderData.enemy.find(function(o,s){o===t&&i.renderData.enemy.splice(s,1)})},goToOut:function(){this.position+=i.w;var t=this;this.position>i.w*i.h-1&&i.renderData.enemy.find(function(o,s){o===t&&i.renderData.enemy.splice(s,1)})},pingpong:function(){var i=(0,t.ezPosition)(this.position),o=(0,t.positionTosXsY)(this.prePosition),s=(0,t.positionTosXsY)(this.position);if(!this.prePosition)return this.prePosition=this.position,void(this.position=i(1,1));var n=o.x<s.x,h=o.y<s.y;this.prePosition=this.position;var e=(0,t.touchScope)(this.position);return n||h?!n&&h?e.LEFT&&e.BOTTOM?i(1,-1):e.LEFT?this.position=i(1,1):e.BOTTOM?this.position=i(-1,-1):this.position=i(-1,1):n&&!h?e.RIGHT&&e.TOP?i(-1,1):e.RIGHT?this.position=i(-1,-1):e.TOP?this.position=i(1,1):this.position=i(1,-1):n&&h?e.RIGHT&&e.BOTTOM?i(-1,-1):e.RIGHT?this.position=i(-1,1):e.BOTTOM?this.position=i(1,-1):this.position=i(1,1):void 0:e.LEFT&&e.TOP?i(1,1):e.LEFT?this.position=i(1,-1):e.TOP?this.position=i(-1,1):this.position=i(-1,-1)}};
},{"./config":18,"./positionMethod":17}],15:[function(require,module,exports) {
"use strict";var n=require("./config");exports.animation=function(r,t){var e=1;return function a(i){e==r&&n.renderData.aniEffect.splice(n.renderData.aniEffect.indexOf(a),1),t(e,i),e++}},exports.circle=function(n,r,t,e,a){var i=2*Math.PI/e;return{x:n+t*Math.cos(i*a),y:r+t*Math.sin(i*a)}};
},{"./config":18}],24:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var o=require("./config"),t=require("./positionMethod");exports.default={normal:function(i,r){var n=i,s=45;return function(i){s--;var r=(0,t.positionTosXsY)(n),e=(0,t.positionTosXsY)(n+o.w*o.h),a=1/45*(45-s),u=Math.round(r.x+(e.x-r.x)*a),x=Math.round(r.y+(e.y-r.y)*a),l=(0,t.positionToXY)(n),y=(0,t.positionToXY)(n+o.w*o.h),p=(a=1/45*(45-s),l.x+(y.x-l.x)*a),h=l.y+(y.y-l.y)*a;return{position:(0,t.sXsYToPosition)(u,x),x:p,y:h,look:"laser",w:20,h:60,clear:s<-1}}},track:function(i){var r,n,s=i,e=null,a=null;return function(i){var u=(0,t.positionTosXsY)(s);e||(e=(0,t.positionTosXsY)(i),r=Math.floor(2*Math.sqrt((u.x-e.x)*(u.x-e.x)+(u.y-e.y)*(u.y-e.y))),n=r-1);var x=1/r*(r-n),l=Math.round(u.x+(e.x-u.x)*x),y=Math.round(u.y+(e.y-u.y)*x),p=(0,t.positionToXY)(s),h=o.pixelWeigth/2;a||(a=(0,t.positionToXY)(i));var c=p.x+h+(a.x-p.x+h)*x,T=p.y+0+(a.y-p.y+0)*x;return n--,{position:(0,t.sXsYToPosition)(l,y),x:c,y:T,look:"bulletBall",w:15,h:15,clear:n<-15||l<0||l>o.w-1}}}};
},{"./config":18,"./positionMethod":17}],14:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(t){this.name=t.name,this.life=t.life,this.mainX=t.position,this.position=t.position,this.shot=t.shot,this.shotTime=t.shotTime,this.movePath=t.movePath,this.moveTime=t.moveTime||1,this.look=t.look,this.bulletType=t.bulletType||"normal";var e=t.deadCb||function(){},o=!1,h=0;this.getST=function(){return h},this.wasHit=function(t,e,s){var n=this;i.default[this.look](this.position,"GETMAP").includes(t)&&(o=!0,this.life--,this.life<1?(l.renderData.enemy.find(function(t,i){if(t===n){localStorage.getItem("bestScore");l.renderData.enemy.splice(i,1)}}),this.dead()):(this.grapic.call(this,e),s&&s()))},this.grapic=function(t){var e=o?"red":"white";i.default[this.look](this.position).forEach(function(i,o){var s=(0,n.positionToXY)(i);t.beginPath(),t.rect(s.x-l.pixelWeigth/2,s.y,l.pixelWeigth,l.pixelWeigth),t.fillStyle=e,t.fill()})},this.action=function(t,i,e){if(this.grapic(i),"OBJ_MOVE"===t){if(u.call(this),h%this.shotTime[0]<this.shotTime[1])h%this.shotTime[0]%this.shotTime[2]==0&&this.shot&&f(this.position,this.bulletType,e);h++,o=!1}},this.dead=function(){var t=this.position,i=(0,n.positionToXY)(t),o=document.getElementById("explosion");l.renderData.aniEffect.push((0,s.animation)(50,function(t,e){e.drawImage(o,i.x-(50-t)/2,i.y,120-t,120-t)})),e()}};var t=require("./lookPath"),i=r(t),e=require("./movePathList"),o=r(e),s=require("./aniEffectMethod"),n=require("./positionMethod"),h=require("./enemyBulletType"),a=r(h),l=require("./config");function r(t){return t&&t.__esModule?t:{default:t}}function u(){o.default[this.movePath]&&this.getST()%this.moveTime==0&&o.default[this.movePath].call(this)}function f(t,i,e){var o=l.renderData.enemyBullet,s=a.default[i](t);o.reduce(function(i,e){return i||e.data.position===t},!1)||o.push({data:s(e),fn:s})}
},{"./lookPath":12,"./movePathList":11,"./aniEffectMethod":15,"./positionMethod":17,"./enemyBulletType":24,"./config":18}],13:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(e,o){var t=y[e];t&&(Object.keys(t).forEach(function(e){o[e]=t[e]}),console.log("script : ",o))};var e=require("./config"),o=require("./createEnemy"),t=l(o),n=require("./aniEffectMethod"),i=require("./positionMethod");function l(e){return e&&e.__esModule?e:{default:e}}var r={name:"ZARK-ZERO",life:1,shot:!0,shotTime:[200,54,9],movePath:"gostMove",moveTime:5,look:"zark",bulletType:"normal"},a={name:"ZARK-PLUS",life:1,shot:!0,shotTime:[200,81,9],movePath:"gostMove",moveTime:3,look:"zark",bulletType:"normal"},m={name:"FORT",life:1,shot:!0,shotTime:[200,54,9],movePath:"goToOut",moveTime:5,look:"fort",bulletType:"track"},s={name:"test",life:20,shot:!0,shotTime:[100,54,9],movePath:"pingpong",moveTime:3,look:"CIRCLE",position:Math.round(e.w/3)-5,bulletType:"track"},f=Object.assign({},s,{position:2*Math.round(e.w/3)+5}),c={name:"greenPoint",movePath:"pingpong",moveTime:10,restoreLife:["liftMax-2","liftReset"],look:"hp+",color:"rgba(0,255,0,1)",effect:function(o){e.renderData.aniEffect.push((0,n.animation)(80,function(e,t){for(var l=(0,i.positionToXY)(o.position),r=1;r<=5;r++){var a=(0,n.circle)(l.x,l.y,1.5*e,5,r);t.fillStyle="rgba(0,255,0,.8)",t.fillRect(a.x,a.y,15,15)}}))}},u={name:"greenPoint",movePath:"pingpong",moveTime:10,restoreLife:["liftRestore-1"],look:"hp+",color:"rgba(255,255,0,1)",effect:function(o){e.renderData.aniEffect.push((0,n.animation)(80,function(e,t){for(var l=(0,i.positionToXY)(o.position),r=1;r<=5;r++){var a=(0,n.circle)(l.x,l.y,1.5*e,5,r);t.fillStyle="rgba(255,255,0,.8)",t.fillRect(a.x,a.y,15,15)}}))}},p={name:"greenPoint",movePath:"pingpong",moveTime:10,changeBullet:"treble",look:"hp+",color:"rgba(255,0,0,1)",effect:function(o){o.look="crystal-plus",e.renderData.aniEffect.push((0,n.animation)(80,function(e,t){for(var l=(0,i.positionToXY)(o.position),r=1;r<=5;r++){var a=(0,n.circle)(l.x,l.y,1.5*e,5,r);t.fillStyle="rgba(255,0,0,.8)",t.fillRect(a.x,a.y,15,15)}}))}},y={0:{enemy:[r],enemyPolling:[20,100],enemyQuantity:1,stopCount:!1},800:{enemy:[r,m],enemyPolling:[15,80],enemyQuantity:1},1600:{enemy:[a,m],enemyPolling:[15,75],enemyQuantity:1},1601:{item:[c]},1700:{enemy:[]},1800:{item:[u]},1805:{boss:[s],stopCount:!0},1806:{boss:[f],stopCount:!0},1809:{stopCount:!1},1820:{enemy:[a,m],enemyPolling:[15,75],item:[p]},2100:{enemy:[a,m],enemyPolling:[15,55],item:[c]},3400:{item:[u]},4500:{enemyPolling:[15,45]},5600:{item:[u]},5700:{enemyPolling:[10,35]}};
},{"./config":18,"./createEnemy":14,"./aniEffectMethod":15,"./positionMethod":17}],25:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./config"),o=require("./positionMethod");function r(r,t,i){var n=r;function u(r){n-=e.w;var t=(0,o.positionToXY)(n);return{position:n,x:t.x,y:t.y,look:"shipBulletNormal",w:20,h:60,clear:n<0}}t.push({data:u(),fn:u})}exports.default={normal:r,treble:function(o,t,i){r(o,t),o%e.w>1&&r(o-1,t),o%e.w<e.w-1&&r(o+1,t)}};
},{"./config":18,"./positionMethod":17}],26:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(i,e,t){if(i)return"number"==typeof i?l[0](i,e,t):l[i.brickType](i.ps,e,t)};var i=require("./positionMethod"),e=require("./config"),l={0:function(l,t,o){var n=(0,i.positionToXY)(l);t.beginPath(),t.rect(n.x-e.pixelWeigth/2,n.y,e.pixelWeigth,e.pixelWeigth),t.fillStyle=o||"white",t.fill()},1:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h,n.y+e.pixelWeigth),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},2:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},3:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+e.pixelWeigth,n.y),t.lineTo(h,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},4:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2;t.beginPath(),t.moveTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.lineTo(h,n.y+e.pixelWeigth+1),t.fillStyle=o||"white",t.fill()},5:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+e.pixelWeigth,n.y),t.lineTo(h+p,n.y+p),t.fillStyle=o||"white",t.fill()},6:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.lineTo(h+p,n.y+p),t.fillStyle=o||"white",t.fill()},7:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h+p,n.y+p),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.lineTo(h,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},8:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+p,n.y+p),t.lineTo(h,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},b0:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+p,n.y+e.pixelWeigth),t.lineTo(h,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},b1:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+p,n.y),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.lineTo(h,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},d0:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.lineTo(h+p,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},d1:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h+p,n.y),t.lineTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.lineTo(h,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},crystal1:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h+p,n.y),t.lineTo(h,n.y+e.pixelWeigth),t.lineTo(h+e.pixelWeigth,n.y+e.pixelWeigth),t.fillStyle=o||"white",t.fill()},crystal3:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+p,n.y),t.lineTo(h,n.y+p),t.fillStyle=o||"white",t.fill()},crystal4:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h,n.y),t.lineTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+p),t.lineTo(h+p,n.y+e.pixelWeigth),t.lineTo(h,n.y+p),t.fillStyle=o||"white",t.fill()},crystal5:function(l,t,o){var n=(0,i.positionToXY)(l),h=n.x-e.pixelWeigth/2,p=e.pixelWeigth/2;t.beginPath(),t.moveTo(h+p,n.y),t.lineTo(h+e.pixelWeigth,n.y),t.lineTo(h+e.pixelWeigth,n.y+p),t.fillStyle=o||"white",t.fill()}};
},{"./positionMethod":17,"./config":18}],19:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(i){this.name=i.name,this.life=i.life,this.deadPosition=i.position,this.position=i.position,this.prePosition,this.killCount=0,this.bullet=[],this.bulletType="normal",this.look=i.look,this.isDead=!1,this.shotFps=8,this.maxLife=i.life;var e=i.deadCb||function(){};this.wasHit=function(i){var t=i.bulletPs,e=i.bulletIndex,n=(i.viewDom,i.shipPath),o=i.pathObj;(n.includes(t)||n.includes(t+u.w))&&(this.life--,u.renderData.aniEffect.push((0,s.animation)(10,function(i,t){o.forEach(function(i,e){(0,r.default)(i,t,"rgba(255,0,0,.8)")})}.bind(this))),u.renderData.enemyBullet.splice(e,1),this.life<1&&(this.life=0,this.isDead=!0,this.dead()))},this.touch=function(i){i.viewDom;var t=i.touchEnemy,e=i.pathObj;t&&(this.life--,u.renderData.aniEffect.push((0,s.animation)(10,function(i,t){e.forEach(function(i,e){(0,r.default)(i,t,"rgba(255,0,0,.8)")})}.bind(this))),this.life<1&&(this.life=0,this.isDead=!0,this.dead()))},this.shot=function(){if(!this.isDead){a.default[this.bulletType](this.position,this.bullet);var i=this.position;u.renderData.aniEffect.push((0,s.animation)(30,function(t,e){var n=4+20*Math.random(),o=4+20*Math.random(),a=5*Math.random(),s=5*Math.random(),l=(0,h.positionToXY)(i),r=1/30*(30-t),u=(1-r)*(1-r)*l.x+2*r*(1-r)*l.x+r*r*(l.x-n),f=(1-r)*(1-r)*l.y+2*r*(1-r)*(l.y-n)+r*r*(l.y-n),d=(1-r)*(1-r)*l.x+2*r*(1-r)*l.x+r*r*(l.x+o),c=(1-r)*(1-r)*l.y+2*r*(1-r)*(l.y-o)+r*r*(l.y-o);e.fillStyle=t%2?"rgba(255,255,255,.8)":"rgba(255,255,0,.8)",e.fillRect(u-a,f,3,3),e.fillRect(d+s,c,3,3)}))}},this.grapic=function(i){var e=this,n=this.wasHit.bind(this),o=this.touch.bind(this),a=this.isDead,s=t.default[this.look](this.position,this.lookType).map(function(i){return i.ps}),l=t.default[this.look](this.position,this.lookType);if(c.call(this),p.call(this,i),!a){t.default[this.look](this.position,this.lookType).forEach(function(t,e){(0,r.default)(t,i)});var h=u.renderData.enemy.reduce(function(i,e){return[].concat(d(i),d(t.default[e.look](e.position)))},[]);o({touchEnemy:s.reduce(function(i,t){return i||h.includes(t)},!1),viewDom:i,pathObj:l}),u.renderData.enemyBullet.forEach(function(t,e){n({bulletPs:t.data.position,bulletIndex:e,viewDom:i,shipPath:s,pathObj:l})}),u.renderData.item.forEach(function(i,n){var o=t.default[i.look](i.position);s.reduce(function(i,t){return i||o.includes(t)},!1)&&i.wasPickUp(e)})}},this.dead=function(){var t=this.position,n=(0,h.positionToXY)(t),o=document.getElementById("explosion");u.renderData.aniEffect.push((0,s.animation)(50,function(t,e){e.drawImage(o,n.x-(50-t)/2,n.y,120-t,120-t),50==t&&(this.life=i.life,this.maxLife=i.life,this.position=this.deadPosition,this.isDead=!1,this.bullet=[],this.bulletType="normal",this.look=i.look)}.bind(this))),e()}};var i=require("./lookPath"),t=f(i),e=require("./movePathList"),n=f(e),o=require("./shipBulletType"),a=f(o),s=require("./aniEffectMethod"),l=require("./bricks"),r=f(l),h=require("./positionMethod"),u=require("./config");function f(i){return i&&i.__esModule?i:{default:i}}function d(i){if(Array.isArray(i)){for(var t=0,e=Array(i.length);t<i.length;t++)e[t]=i[t];return e}return Array.from(i)}function c(){var i=this.bullet;for(var t in i)i[t].data=i[t].fn(),i[t].data.clear&&i.splice(t,1)}function p(i){var t=u.renderData.enemyBullet,e=this.bullet;e.map(function(n){var o=n.data.position,a=document.getElementById(n.data.look);i.drawImage(a,n.data.x-6.5,n.data.y-5,13,64),t.forEach(function(i,a){i.data.position===o&&(t.splice(a,1),e.splice(e.indexOf(n),1)),i.data.position===o+u.w&&(t.splice(a,1),e.splice(e.indexOf(n),1))}),u.renderData.enemy.map(function(t){t.wasHit(o,i,function(){e.splice(e.indexOf(n),1)}),t.wasHit(o+u.w,i,function(){e.splice(e.indexOf(n),1)})})})}
},{"./lookPath":12,"./movePathList":11,"./shipBulletType":25,"./aniEffectMethod":15,"./bricks":26,"./positionMethod":17,"./config":18}],16:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=function(i){this.name=i.name,this.mainX=i.position,this.position=i.position,this.movePath=i.movePath,this.moveTime=i.moveTime||1,this.color=i.color,this.look=i.look,this.restoreLife=i.restoreLife||[],this.changeBullet=i.changeBullet||"";var e=i.effect||function(){},o=0;this.getST=function(){return o},this.grapic=function(i){var e=this.color;t.default[this.look](this.position).forEach(function(t,o){var n=(0,s.positionToXY)(t);i.beginPath(),i.rect(n.x-r.pixelWeigth/2,n.y,r.pixelWeigth,r.pixelWeigth),i.fillStyle=e,i.fill()})},this.action=function(i,t,e){this.grapic(t),"OBJ_MOVE"===i&&(l.call(this),o++)},this.wasPickUp=function(i){r.renderData.item.splice(r.renderData.item.indexOf(this),1);var t=this.position,o=((0,s.positionToXY)(t),this.restoreLife),n=this.changeBullet;o.length>0&&o.forEach(function(t){var e=t.split("-");h(e[0],e[1],i)}),n&&(i.bulletType=n),e(i)}};var i=require("./lookPath"),t=a(i),e=require("./movePathList"),o=a(e),n=require("./aniEffectMethod"),s=require("./positionMethod"),r=require("./config");function a(i){return i&&i.__esModule?i:{default:i}}function h(i,t,e){var o={liftReset:function(i){i.life=i.maxLife},liftMax:function(i,t){var e=parseInt(t);i.maxLife+=e},liftRestore:function(i,t){var e=parseInt(t);return i.life+e>i.maxLife?i.life=i.maxLife:i.life+=e}};o[i]&&o[i](e,t)}function l(){o.default[this.movePath]&&this.getST()%this.moveTime==0&&o.default[this.movePath].call(this)}
},{"./lookPath":12,"./movePathList":11,"./aniEffectMethod":15,"./positionMethod":17,"./config":18}],2:[function(require,module,exports) {
"use strict";require("./main.css");var e=require("./js/lookPath"),t=p(e),n=require("./js/movePathList"),o=p(n),i=require("./js/script"),a=p(i),r=require("./js/createEnemy"),c=p(r),d=require("./js/createShip"),u=p(d),s=require("./js/createItem"),l=p(s),f=require("./js/aniEffectMethod"),h=require("./js/positionMethod"),m=require("./js/config");function p(e){return e&&e.__esModule?e:{default:e}}var y,v=0,w=1,E=0,g=0,M={},k={UP:!1,RIGHT:!1,DOWN:!1,LEFT:!1,SPACE:!1};function I(e,t){var n={38:function(){"keydown"==t&&(k.UP=!0),"keyup"==t&&(k.UP=!1)},39:function(){"keydown"==t&&(k.RIGHT=!0),"keyup"==t&&(k.RIGHT=!1)},40:function(){"keydown"==t&&(k.DOWN=!0),"keyup"==t&&(k.DOWN=!1)},37:function(){"keydown"==t&&(k.LEFT=!0),"keyup"==t&&(k.LEFT=!1)},32:function(){"keydown"==t&&(k.SPACE=!0,B.shot()),"keyup"==t&&(k.SPACE=!1)}};n[e]&&n[e]()}function L(e){var t={UP:function(){var t=e.position;e.position=t-m.w>-1?t-m.w:t},RIGHT:function(){var t=e.position;t+1<=m.w*m.h-1&&(t+1)%m.w!=0&&(e.position=t+1)},DOWN:function(){var t=e.position,n=Math.round((t-t%m.w)/m.w);t+m.w<m.w*m.h&&(e.position=n<m.h?t+m.w:t)},LEFT:function(){var t=e.position;t-1>-1&&t%m.w!=0&&(e.position=t-1)},SPACE:function(){S()}};for(var n in k)1==k[n]&&t[n]();k.SPACE||b()}function S(){y||(y=setInterval(function(){B.shot(),B.lookType="OPEN"},1e3/B.shotFps))}function b(){clearInterval(y),B.lookType="CLOSE",y=null}function P(e){var t=m.renderData.enemyBullet;for(var n in t)t[n].data=t[n].fn(e),t[n].data.clear&&t.splice(n,1)}function T(){m.renderData.enemy=[],m.renderData.item=[]}var B=new u.default({name:"CrystalShip",life:m.shipLife,position:m.w*Math.floor(m.h/2)-Math.floor(m.w/2),deadPosition:m.w*Math.floor(m.h/2)-Math.floor(m.w/2),look:"crystal",deadCb:function(e){E=0,v=0,w=100,T()}});function C(e){var t=localStorage.getItem("bestScore")||0,n=localStorage.getItem("bestMileage")||0,o=M.stopCount,i=M.boss||[];if((0,a.default)(v,M),"OBJ_MOVE"===e){var r=M.item;if(v==w&&!o){for(var d=0;d<M.enemyQuantity;d++){var u=M.enemy[v%M.enemy.length];u&&(u.position=Math.floor(Math.random()*m.w),u.deadCb=function(){t<++E&&localStorage.setItem("bestScore",E)},m.renderData.enemy.push(new c.default(u)))}M.enemyPolling&&(w=v+Math.floor(Math.random()*M.enemyPolling[1]+M.enemyPolling[0]))}if(i.length){Math.floor(Math.random()*m.w);i.forEach(function(e,n){e.deadCb=function(){t<++E&&localStorage.setItem("bestScore",E),v++},m.renderData.enemy.push(new c.default(e))}),M.boss=[],v++}r&&(r.forEach(function(e){e.position=Math.floor(Math.random()*m.w),m.renderData.item.push(new l.default(e))}),M.item=null),g++,!o&&v++,n<v&&localStorage.setItem("bestMileage",v)}"BULLET_MOVE"===e&&P(B.position);var s=document.getElementById("view").getContext("2d");s.clearRect(0,0,m.vwidth,m.vheight),B.grapic(s),m.renderData.enemyBullet.map(function(e){(0,h.positionToXY)(e.data.position);var t=document.getElementById(e.data.look);s.drawImage(t,e.data.x-7.5,e.data.y-5,e.data.w,e.data.h)}),m.renderData.enemy.forEach(function(t){t.action(e,s,B.position)}),m.renderData.item.forEach(function(t){t.action(e,s,B.position)}),m.renderData.aniEffect.forEach(function(e){e(s)}),document.getElementById("view").style.backgroundPositionY=g+"px",document.getElementById("score").innerHTML='Score: <div class="score">'+E+"</div><br/> Mileage: "+v+"<br/>Best score: "+(localStorage.getItem("bestScore")||0)+"<br/> Best Mileage: "+n+"<br/> Life: "+B.life+"/"+B.maxLife,document.getElementById("life").style.width=100/B.maxLife*B.life+"%"}function D(e){C(e)}function O(e){if((e=e||window.event).preventDefault(),e.touches[0]){var t=Math.floor(e.touches[0].pageX/m.pixelWeigth),n=Math.floor(e.touches[0].pageY/m.pixelWeigth),o=m.w*n+t;B.position=o,S()}}document.addEventListener("keydown",function(e){I(e.keyCode,"keydown")},!1),document.addEventListener("keyup",function(e){I(e.keyCode,"keyup")},!1),document.addEventListener("touchstart",O,!1),document.addEventListener("touchmove",O,!1),document.addEventListener("touchend",b,!1),document.getElementById("view").height=m.vheight,document.getElementById("view").width=m.vwidth,setInterval(function(){D("OBJ_MOVE"),D("CONTROL_MOVE"),!m.atc.isMobile()&&L(B),D("BULLET_MOVE")},m.renderTime);
},{"./main.css":10,"./js/lookPath":12,"./js/movePathList":11,"./js/script":13,"./js/createEnemy":14,"./js/createShip":19,"./js/createItem":16,"./js/aniEffectMethod":15,"./js/positionMethod":17,"./js/config":18}]},{},[2])