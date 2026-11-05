export type DunyaItem = {
  id: string;
  title: string;
  leftEmoji: string;
  leftLabel: string;
  rightEmoji: string;
  rightLabel: string;
  cue: string;
};

export const OPPOSITES_ITEMS: readonly DunyaItem[] = [
  {
    id: 'big-small',
    title: 'Big & Small',
    leftEmoji: '🐘',
    leftLabel: 'BIG',
    rightEmoji: '🐭',
    rightLabel: 'Small',
    cue: 'An elephant takes big heavy steps, and a tiny mouse squeaks softly.',
  },
  {
    id: 'day-night',
    title: 'Day & Night',
    leftEmoji: '☀️',
    leftLabel: 'DAY',
    rightEmoji: '🌙',
    rightLabel: 'Night',
    cue: 'The bright sun warms the morning, and the quiet moon brings sleep.',
  },
  {
    id: 'hot-cold',
    title: 'Hot & Cold',
    leftEmoji: '☕',
    leftLabel: 'HOT',
    rightEmoji: '🧊',
    rightLabel: 'Cold',
    cue: 'Soup is warm and cozy, while ice cubes are cool and chilly.',
  },
  {
    id: 'fast-slow',
    title: 'Fast & Slow',
    leftEmoji: '🏎️',
    leftLabel: 'FAST',
    rightEmoji: '🐢',
    rightLabel: 'Slow',
    cue: 'The car zooms fast across the road, and the turtle moves slowly.',
  },
  {
    id: 'up-down',
    title: 'Up & Down',
    leftEmoji: '🎈',
    leftLabel: 'UP',
    rightEmoji: '🪨',
    rightLabel: 'Down',
    cue: 'The balloon floats high up into the sky, and the stone rests down.',
  },
];