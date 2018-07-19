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
	'claw1': createMapfn([[2,-2],[3,-3],[2,-3],[0,-3],[4,-1]]),
	'claw2': createMapfn([[1,-1],[1,-2],[2,-2],[3,-3],[2,-3],[0,-3],[-1,-3],[-1,-2],[4,-1],[3,0],[3,1]]),
	'claw3': createMapfn([[0,0],[0,1],[1,-1],[1,0],[1,-2],[-1,1],[2,-2],[3,-3],[2,-3],[0,-3],[-1,-3],[-1,-2],[-2,-1],[-2,0],[4,-1],[3,0],[3,1],[2,2],[2,3],[3,2],[-1,-1]]),
	'claw4': createMapfn([[0,0],[0,1],[0,2],[1,-1],[1,0],[1,-2],[-1,3],[-1,1],[2,-2],[3,-3],[2,-3],[-1,2],[0,-3],[-1,-3],[-1,-2],[-2,-1],[-2,0],[-3,0],[-3,1],[4,-1],[3,0],[3,1],[2,2],[2,3],[1,4],[3,2],[-1,-1],[1,5]]),
	'claw5': createMapfn([[0,0],[0,1],[0,2],[1,-1],[1,0],[1,-2],[-1,3],[-1,4],[-2,4],[-1,1],[2,-2],[3,-3],[2,-3],[-1,2],[0,-3],[-1,-3],[-1,-2],[-2,-1],[-2,0],[-3,0],[-3,1],[-4,2],[-3,2],[4,-1],[3,0],[3,1],[2,2],[2,3],[1,4],[3,2],[-1,-1],[-1,6],[-3,5],[-5,3],[1,5]]),
	'CIRCLE': circleMap()
};