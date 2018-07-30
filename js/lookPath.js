import {
  w,
  h
} from './config';

import {
  ezPosition,
  positionTosXsY,
  sXsYToPosition,
  touchScope,
  ezPositionWithCheckScope
} from './positionMethod';

function circle(x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  var _margin = 2 * Math.PI / 360 * (margin || 0);
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));
  return {
    position: sXsYToPosition(_x, _y),
    outScope: _x < 0 || _x > w - 1 || _y < 0 || _y > h - 1,
  }
}

function circleMap() {
  var renCount = 0;
  return function (ps, getmap) {
    var p0 = positionTosXsY(ps);
    var pointLength = 8;
    var rs = [];
    for (var i = 0; i <= pointLength; i++) {
      var psData = circle(p0.x, p0.y, 5, pointLength, i, Math.round(renCount / 20));
      !psData.outScope && rs.push({ ps: psData.position, brickType: '0' });
    }
    if (!getmap) renCount++;
    return rs;
  }
}

function createMapfn(pathArr) {
  return function (ps) {
    var xy = ezPositionWithCheckScope(ps);
    var path = pathArr;
    var rs = [
      ...path.map(function (_xy) {
        return { ps: xy(_xy[0], _xy[1]), brickType: '0' };
      })
    ];
    return rs.filter(function (obj) {
      return obj.ps;
    });
  }
}

export default {
  'zark': createMapfn([[0, 0], [1, -1], [-1, -1]]),
  'fort': createMapfn([[0, 0], [1, -1], [-1, -1], [0, -2]]),
  'turret': createMapfn([[1,1],[-1,-1],[-1,1],[1,-1],[0,0]]),
  'point': createMapfn([[0, 0]]),
  'porweUp': createMapfn([[-1,-1],[1,-1],[1,1],[-1,1]]),
  'hp+': createMapfn([[-1,-1],[1,-1],[1,1],[-1,1]]),
  'MONSTER0': createMapfn([[-1, -1], [-1, 0], [-1, 1], [-1, 2], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [2, -1], [1, -1], [0, -1], [0, -2], [1, -2], [3, -2], [3, -1], [3, 0], [3, 1], [3, 2], [2, 3], [1, 3], [0, 3], [-1, 3], [-2, 2], [-2, 0], [-2, 1], [-2, -1], [-2, -2], [-1, -3], [0, -3], [1, -3], [2, -3], [2, -4], [-1, -4]]),
  'MONSTER1': createMapfn([[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-3, 1], [-4, 1], [-5, 0], [-3, 2], [-3, 3], [-2, 4], [-5, 2], [-5, 3], [-5, 4], [-4, 4], [-4, 5], [-6, 5], [-6, 6], [-5, 6], [-4, 6], [-3, 6], [-1, 5], [0, 5], [1, 5], [-1, 6], [-2, 6], [1, 6], [2, 6], [3, 5], [2, 4], [3, 6], [5, 5], [7, 5], [7, 6], [6, 6], [5, 6], [4, 6], [6, 4], [5, 3], [5, 2], [4, 1], [4, 0], [2, 1], [1, 2], [1, 3], [3, 3], [5, -1], [5, -2], [5, -3], [4, -4], [4, -5], [3, -6], [2, -7], [1, -7], [0, -7], [-1, -7], [-2, -7], [-3, -6], [-3, -5], [-4, -5], [-5, -4], [-6, -4], [-7, -3], [-7, -2], [-6, -2], [-5, -2], [-6, -1], [-4, -2], [-1, -5], [0, -5], [0, -4], [1, -4], [1, -3], [0, -3], [-1, -3]]),
  'MONSTER1_openmouth':createMapfn([[-3,2],[-3,3],[-2,4],[-5,3],[-5,4],[-4,4],[-4,5],[-6,5],[-6,6],[-5,6],[-4,6],[-3,6],[-1,5],[0,5],[1,5],[-1,6],[-2,6],[1,6],[2,6],[3,5],[2,4],[3,6],[5,5],[7,5],[7,6],[6,6],[5,6],[4,6],[6,4],[5,3],[5,2],[4,1],[4,0],[2,1],[1,2],[1,3],[3,3],[5,-1],[5,-2],[5,-3],[4,-4],[4,-5],[3,-6],[2,-7],[0,-8],[1,-8],[-1,-8],[-4,2],[-6,3],[0,-4],[0,-5],[1,-5],[1,-4],[0,-6],[-1,-4],[-1,-6],[-3,-8],[-2,-8],[-7,-6],[-7,3],[-7,2],[-7,-5],[-6,-5],[-5,-4],[-5,0],[-5,1],[-6,1],[-7,1],[-4,0],[-2,1],[-4,-1],[-5,-5],[-4,-4],[-4,-3],[-3,-2],[-3,-1],[-5,-7],[-6,-7],[-4,-7],[-7,-4],[-6,-3],[-6,-2],[-6,-1],[-7,0]]),
  'SPIDER': createMapfn([[0, 0], [1, -1], [1, -2], [1, 1], [1, 2], [-1, 2], [-1, 1], [-1, -1], [-1, -2]]),
  'CIRCLE': circleMap(),
  'crystal-plus': function (ps, type) {
    var xy = ezPositionWithCheckScope(ps);
    var rs = [];
    var open = type === 'OPEN';
    //var open = false;
    if (open) {
      rs = [
        { ps: xy(-1, -1), brickType: 'd0' }, { ps: xy(1, -1), brickType: 'b0' },
        { ps: xy(-2, 0), brickType: 'd0' }, { ps: xy(-1, 0), brickType: 'd1' }, { ps: xy(0, 0), brickType: '7' }, { ps: xy(1, 0), brickType: 'b1' }, { ps: xy(2, 0), brickType: 'b0' },
        { ps: xy(-2, 1), brickType: 'crystal5' }, { ps: xy(-1, 1), brickType: '2' }, { ps: xy(0, 1), brickType: '5' }, { ps: xy(1, 1), brickType: '3' }, { ps: xy(2, 1), brickType: 'crystal3' },
      ];
    }
    if (!open) {
      rs = [
        { ps: xy(0, -1), brickType: 'crystal1' },
        { ps: xy(-2, 0), brickType: 'd0' }, { ps: xy(-1, 0), brickType: 'd0' }, { ps: xy(0, 0), brickType: '0' }, { ps: xy(1, 0), brickType: 'b0' }, { ps: xy(2, 0), brickType: 'b0' },
        { ps: xy(-2, 1), brickType: 'crystal5' }, { ps: xy(-1, 1), brickType: 'crystal5' }, { ps: xy(0, 1), brickType: 'crystal4' }, { ps: xy(1, 1), brickType: 'crystal3' }, { ps: xy(2, 1), brickType: 'crystal3' },
      ];
    }
    xy(0, 0, true);
    return rs;
  },
  'crystal': function (ps, type) {
    var xy = ezPositionWithCheckScope(ps);
    var rs = [];
    var open = type === 'OPEN';
    //var open = false;

    if (open) {
      rs = [
        { ps: xy(-1, -1), brickType: 'd0' }, { ps: xy(1, -1), brickType: 'b0' },
        { ps: xy(-1, 0), brickType: 'd1' }, { ps: xy(0, 0), brickType: '7' }, { ps: xy(1, 0), brickType: 'b1' },
        { ps: xy(-1, 1), brickType: '2' }, { ps: xy(0, 1), brickType: '5' }, { ps: xy(1, 1), brickType: '3' },
      ];
    }
    if (!open) {
      rs = [
        { ps: xy(0, -1), brickType: 'crystal1' },
        { ps: xy(-1, 0), brickType: 'd0' }, { ps: xy(0, 0), brickType: '0' }, { ps: xy(1, 0), brickType: 'b0' },
        { ps: xy(-1, 1), brickType: 'crystal5' }, { ps: xy(0, 1), brickType: 'crystal4' }, { ps: xy(1, 1), brickType: 'crystal3' },
      ];
    }
    xy(0, 0, true);
    return rs;
  },
};


