import { 
  w,
  h,
  renderData 
} from './config';

function positionLimit(nowPosition) {
  var leftlimt = this.mainX - (this.mainX % w);
  var rightlimt = leftlimt + w - 1;
  
  if (nowPosition > rightlimt) {
    this.mainX -= 1;
    return -1;
  }
  if (nowPosition < leftlimt) {
    this.mainX += 1;
    return -1;
  }
  this.mainX += w;
  return nowPosition;
};

export default {
  goStop: function () {
    var me = this;
    if (this.getST() < 6) this.position += w;
    if (this.getST() > 80) this.position += w;
    if (this.position > w * h - 1) {
      renderData.enemy.find(function (el, index) {
        if (el === me) renderData.enemy.splice(index, 1);
      })
    };
  },
  gostMove: function () {
    var me = this;
    var thisY = Math.floor(this.position / h);
    var r = h / 4;
    var nowY = Math.floor(this.mainX / w);
    var margin = Math.sin(Math.PI / r * nowY);
    var xMargin = Math.floor(margin * r);
    //console.log(nowY, margin);
    this.position = positionLimit.call(this, this.mainX + xMargin);
    while( this.position == -1 ) {
      　this.position = positionLimit.call(this, this.mainX + xMargin)
    }
    if (this.position > w * h - 1) {
      renderData.enemy.find(function (el, index) {
        if (el === me) renderData.enemy.splice(index, 1);
      })
    };
  },
  goToOut: function () {
    this.position += w;
    var me = this;
    if (this.position > w * h - 1) {
      renderData.enemy.find(function (el, index) {
        if (el === me) renderData.enemy.splice(index, 1);
      })
    };
  },
};