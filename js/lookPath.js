import { w } from './config';
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
  'point':function(ps){
    return [ps];
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
    var rs = [ps, ps + w, ps + 3 * w];
    if (ps % w !== w - 1) {
      rs.push(ps + 2 * w + 1);
    }
    if (ps % w !== 0) {
      rs.push(ps + 2 * w - 1);
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
};