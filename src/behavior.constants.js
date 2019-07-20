export const PRESETS = {
  faded: [{ opacity: 0 }, { opacity: 1 }],
};

export const LAYOUT_PRESETS = {
  absolute: { bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 },
  centered: { alignSelf: 'center' },
  fixed: { position: 'absolute' },
  full: { flex: 1 },
  landing: { alignItems: 'center', flex: 1, justifyContent: 'center' },
};

export const PROPS = [
  { prop: 'opacity', default: 1 },
  { prop: 'rotate', default: '0deg', transform: true },
  { prop: 'scale', default: 1, transform: true },
  { prop: 'translateX', default: 0, transform: true },
  { prop: 'translateY', default: 0, transform: true },
];
