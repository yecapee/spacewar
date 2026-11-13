export const PLAYER_PALETTE = Object.freeze({
  shell: '#FFFFFF', side: '#b7c0c3', steel: '#d6dfdc',
  accent: '#ff927d', canopy: '#28677a', glow: '#72edcc',
});

let nextInstance = 0;
export function createShipVisual(initialCenter, cellSize) {
  let previous = { ...initialCenter };
  const state = {
    deployment: 0, bank: 0, pitch: 0, yaw: 0, thrustX: 0, thrustY: 0,
    upgraded: false, tailThruster: true, palette: PLAYER_PALETTE,
    instanceId: ++nextInstance, reducedMotion: false,
  };
  const clamp = (value, limit = 1) => Math.max(-limit, Math.min(limit, value));
  function approach(value, target, blend) {
    const next = value + (target - value) * blend;
    return Math.abs(next - target) < .001 ? target || 0 : next;
  }
  return {
    update(center, { firing = false, upgraded = false, reducedMotion = false, direction = null } = {}) {
      const dx = center.x - previous.x, dy = center.y - previous.y;
      const inputX = clamp(direction ? direction.x : dx / cellSize);
      const inputY = clamp(direction ? direction.y : dy / cellSize);
      const targetDeployment = firing ? 1 : 0;
      state.deployment += clamp(targetDeployment - state.deployment, .09);
      state.bank = approach(state.bank, reducedMotion ? 0 : -inputX * .34, .22);
      state.pitch = approach(state.pitch, reducedMotion ? 0 : inputY * .17, .22);
      state.yaw = approach(state.yaw, reducedMotion ? 0 : -inputX * .08, .22);
      // Keyboard intent keeps a stable flight pose between rounded grid steps;
      // touch control falls back to its actual displacement.
      state.thrustX = approach(state.thrustX, inputX, reducedMotion ? 1 : .3);
      state.thrustY = approach(state.thrustY, inputY, reducedMotion ? 1 : .3);
      state.upgraded = upgraded;
      state.reducedMotion = reducedMotion;
      previous = { x: center.x, y: center.y };
      return state;
    },
  };
}
