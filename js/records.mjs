export function createRecords(storage, interval = 40) {
  const read = (key) => { try { return Math.max(0, Number(storage.getItem(key)) || 0); } catch { return 0; } };
  const value = { bestScore: read('bestScore'), bestMileage: read('bestMileage') };
  const dirty = new Set(); let age = 0;
  return {
    get bestScore() { return value.bestScore; }, get bestMileage() { return value.bestMileage; },
    update(score, mileage) {
      for (const [key, next] of [['bestScore', score], ['bestMileage', mileage]]) if (next > value[key]) { value[key] = next; dirty.add(key); }
    },
    tick() { if (++age >= interval) { age = 0; this.flush(); } },
    flush() { for (const key of dirty) { try { storage.setItem(key, String(value[key])); } catch { continue; } dirty.delete(key); } },
  };
}
