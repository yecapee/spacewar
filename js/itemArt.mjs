export const ITEM_RESOLUTION = 96;
export const itemArt = {
  repair: { label: '修復補給', color: '#86ffd0' },
  hull: { label: '機體強化', color: '#cf9cff' },
  triple: { label: '三向火力', color: '#ffbc55' },
};

export function itemArtKey(item) {
  if (item.changeBullet === 'treble') return 'triple';
  if (item.restoreLife?.some(action => action.startsWith('liftMax-'))) return 'hull';
  return 'repair';
}
