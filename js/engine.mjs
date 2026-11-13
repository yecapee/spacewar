// Shared allocation-conscious primitives. No DOM or game globals.
export function compact(array, keep, release = () => {}) {
  let write = 0;
  for (let read = 0; read < array.length; read++) {
    const value = array[read];
    if (keep(value)) array[write++] = value;
    else release(value);
  }
  array.length = write;
  return array;
}

export function createPool(factory, limit = 512) {
  const free = [];
  let created = 0;
  return {
    acquire() { const value = free.pop() || (created++, factory()); value.pooled = false; return value; },
    release(value) { if (value.pooled) return; value.pooled = true; if (free.length < limit) free.push(value); },
    get created() { return created; }, get available() { return free.length; },
  };
}

export class SpatialGrid {
  constructor(size = 60) { this.size = size; this.buckets = new Map(); this.seen = new Set(); this.visits = 0; }
  key(x, y) { return (x + 32768) * 65536 + y + 32768; }
  clear() { for (const bucket of this.buckets.values()) bucket.length = 0; this.visits = 0; }
  insert(value, bounds) {
    const s = this.size;
    for (let y = Math.floor(bounds.minY / s); y <= Math.floor(bounds.maxY / s); y++) {
      for (let x = Math.floor(bounds.minX / s); x <= Math.floor(bounds.maxX / s); x++) {
        const key = this.key(x, y); let bucket = this.buckets.get(key);
        if (!bucket) this.buckets.set(key, bucket = []);
        bucket.push(value);
      }
    }
  }
  query(bounds, output = []) {
    output.length = 0; this.seen.clear(); const s = this.size;
    for (let y = Math.floor(bounds.minY / s); y <= Math.floor(bounds.maxY / s); y++) {
      for (let x = Math.floor(bounds.minX / s); x <= Math.floor(bounds.maxX / s); x++) {
        const bucket = this.buckets.get(this.key(x, y)); if (!bucket) continue;
        for (const value of bucket) { this.visits++; if (!this.seen.has(value)) { this.seen.add(value); output.push(value); } }
      }
    }
    return output;
  }
}

export function sweptBounds(from, to, padding = 0, output = {}) {
  output.minX = Math.min(from.x, to.x) - padding; output.maxX = Math.max(from.x, to.x) + padding;
  output.minY = Math.min(from.y, to.y) - padding; output.maxY = Math.max(from.y, to.y) + padding;
  return output;
}
export function segmentBox(from, to, x, y, halfX, halfY = halfX, previousX = x, previousY = y) {
  let enter = 0, leave = 1;
  for (let axis = 0; axis < 2; axis++) {
    const relative = axis ? from.y - previousY : from.x - previousX;
    const end = axis ? to.y - y : to.x - x;
    const half = axis ? halfY : halfX, delta = end - relative;
    if (Math.abs(delta) < 1e-9) { if (Math.abs(relative) > half) return null; continue; }
    const a = (-half - relative) / delta, b = (half - relative) / delta;
    enter = Math.max(enter, Math.min(a, b)); leave = Math.min(leave, Math.max(a, b));
    if (enter > leave) return null;
  }
  return enter;
}

export function createColliderCache(shapeFor, toXY, radius) {
  const entries = new WeakMap(); let tick = 0, builds = 0;
  const center = {}, previous = {};
  return {
    beginTick() { tick++; builds = 0; }, get builds() { return builds; },
    get(entity) {
      let entry = entries.get(entity);
      if (!entry) { entry = { entity, enemy: entity, points: [], cells: new Set(), bounds: {}, tick: -1 }; entries.set(entity, entry); }
      if (entry.tick === tick) return entry;
      const rotation = entity.look === 'CIRCLE' ? Math.round((entity.getST?.() || 0) / 20) : 0;
      if (entry.position !== entity.position || entry.look !== entity.look || entry.type !== entity.lookType || entry.rotation !== rotation || entry.revision !== entity.colliderRevision) {
        entry.pathObj = shapeFor(entity, entry.pathObj || []); entry.cells.clear();
        let count = 0;
        for (const value of entry.pathObj) {
          if (value.ps === undefined) continue;
          const point = entry.points[count] || (entry.points[count] = {});
          toXY(value.ps, point); point.position = value.ps; point.radius = radius; entry.cells.add(value.ps); count++;
        }
        entry.points.length = count; entry.position = entity.position; entry.look = entity.look; entry.type = entity.lookType; entry.rotation = rotation; entry.revision=entity.colliderRevision; builds++;
      }
      toXY(entity.position, center); toXY(entity.previousPosition ?? entity.position, previous);
      const b = entry.bounds; b.minX = b.minY = Infinity; b.maxX = b.maxY = -Infinity;
      for (const point of entry.points) {
        point.previousX = point.x + previous.x - center.x; point.previousY = point.y + previous.y - center.y;
        b.minX = Math.min(b.minX, point.x - radius, point.previousX - radius); b.maxX = Math.max(b.maxX, point.x + radius, point.previousX + radius);
        b.minY = Math.min(b.minY, point.y - radius, point.previousY - radius); b.maxY = Math.max(b.maxY, point.y + radius, point.previousY + radius);
      }
      entry.tick = tick; return entry;
    },
  };
}
