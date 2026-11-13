const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function isCircle(points, duration) {
  if (duration < 100 || duration > 3200 || points.length < 6) return false;
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const width = maxX - minX, height = maxY - minY;
  if (Math.min(width, height) < 24 || width / height < .32 || width / height > 3.1) return false;
  const radius = (width + height) / 4;
  if (distance(points[0], points[points.length - 1]) > Math.max(22, radius * 1.8)) return false;
  const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  let turn = 0, absoluteTurn = 0, length = 0;
  for (let i = 1; i < points.length; i++) {
    // Normalize the axes so a thumb-drawn oval counts like a round loop.
    let angle = Math.atan2((points[i].y - center.y) / height, (points[i].x - center.x) / width)
      - Math.atan2((points[i - 1].y - center.y) / height, (points[i - 1].x - center.x) / width);
    angle = Math.atan2(Math.sin(angle), Math.cos(angle));
    turn += angle; absoluteTurn += Math.abs(angle); length += distance(points[i], points[i - 1]);
  }
  return Math.abs(turn) >= 4.4 && Math.abs(turn) < 8.5 && Math.abs(turn) / absoluteTurn > .65 && length > radius * 4 && length < radius * 12;
}

function endsInCircle(points, started, ended) {
  const check = start => {
    const time = points[start].time ?? started + (ended - started) * start / Math.max(1, points.length - 1);
    return isCircle(points.slice(start), ended - time);
  };
  if (check(0)) return true;
  // Also recognize a recent loop after a long movement drag, with bounded work.
  for (let count = 6; count < points.length; count = Math.max(count + 1, Math.ceil(count * 1.18))) {
    if (check(points.length - count)) return true;
  }
  return false;
}

export function createTouchGestures() {
  let path = null, lastTap = null, started = 0, maxTravel = 0;
  return {
    start(point, time) { path = [{ ...point, time }]; started = time; maxTravel = 0; },
    move(point, time) {
      if (!path) return;
      maxTravel = Math.max(maxTravel, distance(path[0], point));
      if (distance(path[path.length - 1], point) >= 2) {
        // Retain the full gesture at lower density instead of freezing the first samples.
        if (path.length >= 512) path = path.filter((_, index) => index % 2 === 0 || index === path.length - 1);
        path.push({ ...point, time });
      }
    },
    end(point, time) {
      if (!path) return null;
      this.move(point, time);
      const points = path; path = null;
      if (endsInCircle(points, started, time)) { lastTap = null; return 'shield'; }
      if (time - started <= 230 && maxTravel <= 14) {
        if (lastTap && started - lastTap.time >= 0 && started - lastTap.time <= 320 && distance(lastTap.point, point) <= 28) {
          lastTap = null; return 'attack';
        }
        lastTap = { point: { ...point }, time };
      } else lastTap = null;
      return null;
    },
    cancel() { path = null; lastTap = null; },
  };
}
