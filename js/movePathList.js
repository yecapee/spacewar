import {
  w,
  h,
  renderData
} from './config';

import {
  positionTosXsY,
  ezPosition,
} from './positionMethod';

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

function positionScope(position) {
  var ps = positionTosXsY(position);
  return {
    TOP: ps.y === 0,
    RIGHT: ps.x === w - 1,
    BOTTOM: ps.y === h - 1,
    LEFT: ps.x === 0,
  };
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
    while (this.position == -1) {
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
  pingpong: function () {
    var xy = ezPosition(this.position);
    var prePs = positionTosXsY(this.prePosition);
    var nowPs = positionTosXsY(this.position);

    if (!this.prePosition) {
      this.prePosition = this.position;
      this.position = xy(1, 1);
      // console.log(this.prePosition,this.position,xy(1, 1));
      return;
    };

    var directionX = prePs.x < nowPs.x; // 1 >, 0 <
    var directionY = prePs.y < nowPs.y; // 1 V, 0 ^
    this.prePosition = this.position;

    var scope = positionScope(this.position);

    if (!directionX && !directionY) {
      if (scope.LEFT && scope.TOP) return xy(1, 1);

      if (scope.LEFT) return this.position = xy(1, -1);
      if (scope.TOP) return this.position = xy(-1, 1);
      return this.position = xy(-1, -1);
    };

    if (!directionX && directionY) {
      if (scope.LEFT && scope.BOTTOM) return xy(1, -1);

      if (scope.LEFT) return this.position = xy(1, 1);
      if (scope.BOTTOM) return this.position = xy(-1, -1);
      return this.position = xy(-1, 1);
    };

    if (directionX && !directionY) {
      if (scope.RIGHT && scope.TOP) return xy(-1, 1);

      if (scope.RIGHT) return this.position = xy(-1, -1);
      if (scope.TOP) return this.position = xy(1, 1);
      return this.position = xy(1, -1);
    };

    if (directionX && directionY) {
      if (scope.RIGHT && scope.BOTTOM) return xy(-1, -1);

      if (scope.RIGHT) return this.position = xy(-1, 1);
      if (scope.BOTTOM) return this.position = xy(1, -1);
      return this.position = xy(1, 1);
    };

  },
};