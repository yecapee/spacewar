const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function isCircle(points, duration) {
  if (duration < 180 || duration > 1800 || points.length < 10) return false;
  const xs = points.map((p) => p.x), ys = points.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const width = maxX - minX, height = maxY - minY;
  if (Math.min(width, height) < 36 || width / height < .55 || width / height > 1.8) return false;
  const radius = (width + height) / 4;
  if (distance(points[0], points[points.length - 1]) > Math.max(18, radius * .65)) return false;
  const center = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  let turn = 0, absoluteTurn = 0, length = 0;
  for (let i = 1; i < points.length; i++) {
    let angle = Math.atan2(points[i].y - center.y, points[i].x - center.x) - Math.atan2(points[i - 1].y - center.y, points[i - 1].x - center.x);
    angle = Math.atan2(Math.sin(angle), Math.cos(angle));
    turn += angle; absoluteTurn += Math.abs(angle); length += distance(points[i], points[i - 1]);
  }
  return Math.abs(turn) >= 5 && Math.abs(turn) < 8.5 && Math.abs(turn) / absoluteTurn > .8 && length > radius * 4.5 && length < radius * 9;
}

export function createTouchGestures() {
  let path = null, lastTap = null, started = 0, maxTravel = 0;
  return {
    start(point, time) { path = [{ ...point }]; started = time; maxTravel = 0; },
    move(point) {
      if (!path) return;
      maxTravel = Math.max(maxTravel, distance(path[0], point));
      if (distance(path[path.length - 1], point) >= 3 && path.length < 256) path.push({ ...point });
    },
    end(point, time) {
      if (!path) return null;
      this.move(point);
      const points = path; path = null;
      if (isCircle(points, time - started)) { lastTap = null; return 'shield'; }
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
