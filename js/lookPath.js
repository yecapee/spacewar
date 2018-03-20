import { w } from './config';
import {
  ezPosition,
  positionTosXsY,
  sXsYToPosition,
} from './positionMethod';

function circle(x, y, r, all, now, margin) {
  var ang = Math.PI * 2 / all;
  //var _margin = 2 * Math.PI / 360 * (margin || 0);
  var _margin = 0;
  var _x = Math.round(x + r * Math.cos(ang * now + _margin));
  var _y = Math.round(y + r * Math.sin(ang * now + _margin));
  // console.log(x,y,_x,_y);
  return sXsYToPosition(_x, _y);
}

export default {
  'zark': function (ps) {
    var rs = [ps];
    if (ps % w !== w - 1) {
      rs.push(ps - w + 1);
    }
    if (ps % w !== 0 || ps == 0) {
      rs.push(ps - w - 1);
    }
    return rs;
  },
  'fort': function (ps) {
    var rs = [ps];
    if (ps % w !== w - 1) {
      rs.push(ps - w + 1);
    }
    if (ps % w !== 0 || ps == 0) {
      rs.push(ps - w - 1);
    }
    if (ps - 2 * w > 0) {
      rs.push(ps - 2 * w);
    }
    return rs;
  },
  'point': function (ps) {
    return [ps];
  },
  'hp+': function (ps) {
    var rs = [];
    if (ps % w - 1 > 0) {
      rs = [...rs, (ps - w) - 1, (ps + w) - 1];
    }
    if (ps % w + 1 < w) {
      rs = [...rs, (ps - w) + 1, (ps + w) + 1];
    }
    return rs;
  },
  'SPIDER': function (ps) {
    var xy = ezPosition(ps);
    var rs = [xy(0, 0)];
    if (ps % w !== w - 1) {
      rs = [...rs, xy(1, -1), xy(1, -2), xy(1, 1)];
    }
    if (ps % w !== 0) {
      rs = [...rs, xy(-1, -1), xy(-1, -2), xy(-1, 1)];
    }
    return rs;
  },
  'TALONS': function (ps) {
    var xy = ezPosition(ps);
    var rs = [xy(0, -2), xy(0, 1)];
    if (ps % w !== w - 1) {
      rs = [...rs, xy(1, 0), xy(2, -1), xy(2, -2), xy(2, -3)];
    }
    if (ps % w !== 0) {
      rs = [...rs, xy(-1, 0), xy(-2, -1), xy(-2, -2), xy(-2, -3)];
    }
    return rs;
  },
  'MK-1': function (ps) {
    var rs = [ps, ps + w, ps + 3 * w];
    if (ps % w !== w - 1) {
      rs.push(ps + 2 * w + 1);
      rs.push(ps + 3 * w + 2);
      rs.push(ps + 4 * w + 1);
    }
    if (ps % w !== 0) {
      rs.push(ps + 2 * w - 1);
      rs.push(ps + 3 * w - 2);
      rs.push(ps + 4 * w - 1);
    }
    return rs;
  },
  'MK-2': function (ps) {
    var xy = ezPosition(ps);
    var rs = [xy(0, 0), xy(0, 1), xy(0, 3)];
    if (ps % w !== w - 1) {
      rs.push(xy(1, 2));
    }
    if (ps % w !== 0) {
      rs.push(xy(-1, 2));
    }
    return rs;
  },
  'MK-2.LIGHT': function (ps) {
    var xy = ezPosition(ps);
    var rs = [xy(0, 0), xy(0, 3)];
    if (ps % w !== w - 1) {
      rs.push(xy(1, 2));
    }
    if (ps % w !== 0) {
      rs.push(xy(-1, 2));
    }
    return rs;
  },
  'MK-3': function (ps) {
    var rs = [ps, ps + w, ps + 2 * w, ps + 4 * w,];
    if (ps % w !== w - 1) {
      rs.push(ps + 2 * w + 1);
      rs.push(ps + 3 * w + 1);
    }
    if (ps % w !== 0) {
      rs.push(ps + 2 * w - 1);
      rs.push(ps + 3 * w - 1);
    }
    return rs;
  },
  'CIRCLE': function (ps) {
    //var p0 = ezPosition(ps);
    var p0 = positionTosXsY(ps);
    var pointLength = 20;
    var rs = [];
    for (var i = 0; i <= pointLength; i++) {
      rs.push(circle(p0.x, p0.y, 5, pointLength, i, 0));
    }
    return rs;
  }
};