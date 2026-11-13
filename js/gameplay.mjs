// Keep simulation time independent of the display refresh rate.
export function createFixedClock(stepMs, maxSteps = 5) {
  let previous = null;
  let accumulated = 0;
  return {
    reset() { previous = null; accumulated = 0; },
    advance(timestamp, tick) {
      if (previous === null) { previous = timestamp; return; }
      accumulated += Math.min(Math.max(0, timestamp - previous), stepMs * maxSteps);
      previous = timestamp;
      while (accumulated >= stepMs) {
        accumulated -= stepMs;
        tick();
      }
    },
  };
}

export function createMovement(width, height, position) {
  const controller = {
    x: position % width,
    y: Math.floor(position / width),
    position,
    sync(next) {
      this.x = next % width;
      this.y = Math.floor(next / width);
      this.position = next;
    },
    move(dx, dy) {
      const length = Math.hypot(dx, dy);
      if (length) {
        this.x = Math.max(1, Math.min(width - 2, this.x + dx / length));
        this.y = Math.max(1, Math.min(height - 2, this.y + dy / length));
      }
      this.position = Math.round(this.y) * width + Math.round(this.x);
      return this.position;
    },
  };
  return controller;
}
