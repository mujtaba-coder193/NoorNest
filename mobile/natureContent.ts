export type NatureCategory = 'animal' | 'bird' | 'fish' | 'flower';

export type NatureWord = {
  key: string;
  category: NatureCategory;
  name: string;
};

const WORDS_BY_CATEGORY: Record<NatureCategory, string[]> = {
  animal: [
    'Bear', 'Camel', 'Cat', 'Cow', 'Deer', 'Dog', 'Dolphin', 'Donkey', 'Elephant', 'Fox',
    'Frog', 'Giraffe', 'Goat', 'Horse', 'Kangaroo', 'Lion', 'Monkey', 'Panda', 'Pig', 'Rabbit',
    'Sheep', 'Tiger', 'Turtle', 'Whale', 'Zebra',
  ],
  bird: [
    'Chicken', 'Crow', 'Duck', 'Eagle', 'Flamingo', 'Goose', 'Hummingbird', 'Owl', 'Parrot',
    'Peacock', 'Penguin', 'Pigeon', 'Robin', 'Seagull', 'Sparrow', 'Swan', 'Toucan', 'Turkey',
    'Woodpecker',
  ],
  fish: [
    'Angelfish', 'Betta fish', 'Clownfish', 'Cod', 'Eel', 'Goldfish', 'Guppy', 'Mackerel',
    'Pufferfish', 'Salmon', 'Sardine', 'Seahorse', 'Shark', 'Stingray', 'Swordfish', 'Tilapia',
    'Trout', 'Tuna',
  ],
  flower: [
    'Bluebell', 'Buttercup', 'Carnation', 'Cherry blossom', 'Daffodil', 'Daisy', 'Dandelion',
    'Hibiscus', 'Jasmine', 'Lavender', 'Lily', 'Lotus', 'Marigold', 'Orchid', 'Pansy', 'Poppy',
    'Rose', 'Sunflower', 'Tulip', 'Violet',
  ],
};

export const NATURE_WORDS: NatureWord[] = Object.entries(WORDS_BY_CATEGORY).flatMap(
  ([category, names]) => names.map((name) => ({
    key: `${category}-${name.toLocaleLowerCase().replace(/\s+/g, '-')}`,
    category: category as NatureCategory,
    name,
  })),
);