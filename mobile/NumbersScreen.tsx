import { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Speech from 'expo-speech';

const NUMBER_WORDS = [
  'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
];

const TOTAL = NUMBER_WORDS.length;
const BIRDS_PER_ROW = 5;
const STAGGER_MS = 280;

export default function NumbersScreen() {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  // One value per possible bird, created once.
  const birds = useRef(Array.from({ length: TOTAL }, () => new Animated.Value(0))).current;
  const running = useRef<Animated.CompositeAnimation | null>(null);

  const count = index + 1;
  const word = NUMBER_WORDS[index];

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => sub.remove();
  }, []);

  const playBirds = useCallback(
    (n: number) => {
      running.current?.stop();
      birds.forEach((value) => value.setValue(0));

      if (reduceMotion) {
        birds.slice(0, n).forEach((value) => value.setValue(1));
        return;
      }

      const sequence = Animated.stagger(
        STAGGER_MS,
        birds.slice(0, n).map((value) =>
          Animated.spring(value, {
            toValue: 1,
            friction: 5,
            tension: 140,
            useNativeDriver: true,
          }),
        ),
      );
      running.current = sequence;
      sequence.start();
    },
    [birds, reduceMotion],
  );

  // Pop birds in when the screen opens and whenever the number changes.
  useEffect(() => {
    playBirds(count);
  }, [count, playBirds]);

  // Leaving the screen stops speech and animation.
  useEffect(() => {
    return () => {
      Speech.stop();
      running.current?.stop();
    };
  }, []);

  const go = (step: number) => {
    Speech.stop();
    setIndex((current) => (current + step + TOTAL) % TOTAL);
  };

  const hear = () => {
    Speech.stop();
    Speech.speak(word, { language: 'en-US', rate: 0.8 });
    playBirds(count);
  };

  const rows = Array.from({ length: Math.ceil(count / BIRDS_PER_ROW) }, (_, row) =>
    Array.from(
      { length: Math.min(BIRDS_PER_ROW, count - row * BIRDS_PER_ROW) },
      (_, col) => row * BIRDS_PER_ROW + col,
    ),
  );

  return (
    <View style={styles.container}>
      <View style={styles.numberBlock} accessible accessibilityLabel={`${count}, ${word}`}>
        <Text style={styles.numeral}>{count}</Text>
        <Text style={styles.word}>{word}</Text>
      </View>

      <View style={styles.birdArea} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.birdRow}>
            {row.map((birdIndex) => (
              <Animated.Text
                key={birdIndex}
                style={[
                  styles.bird,
                  {
                    opacity: birds[birdIndex].interpolate({
                      inputRange: [0, 0.6],
                      outputRange: [0, 1],
                      extrapolate: 'clamp',
                    }),
                    transform: [{ scale: birds[birdIndex] }],
                  },
                ]}
              >
                🐦
              </Animated.Text>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.controls}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
          onPress={() => go(-1)}
          accessibilityRole="button"
          accessibilityLabel="Previous number"
        >
          <Text style={styles.secondaryText}>Previous</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, styles.primary, pressed && styles.pressed]}
          onPress={hear}
          accessibilityRole="button"
          accessibilityLabel={`Hear ${word}`}
        >
          <Text style={styles.primaryText}>Hear number</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, styles.secondary, pressed && styles.pressed]}
          onPress={() => go(1)}
          accessibilityRole="button"
          accessibilityLabel="Next number"
        >
          <Text style={styles.secondaryText}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

// Colors are placeholders: swap in the shared palette used by Letters.
const BIRD_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  numberBlock: {
    alignItems: 'center',
  },
  numeral: {
    fontSize: 120,
    lineHeight: 130,
    fontWeight: '800',
    color: '#2B2B2B',
  },
  word: {
    fontSize: 32,
    fontWeight: '600',
    color: '#5A5A5A',
    textTransform: 'lowercase',
  },
  birdArea: {
    // Fixed row width keeps birds the same size and left-aligned in rows of five.
    width: BIRD_SIZE * BIRDS_PER_ROW,
    minHeight: BIRD_SIZE * 4,
    justifyContent: 'flex-start',
  },
  birdRow: {
    flexDirection: 'row',
    height: BIRD_SIZE,
  },
  bird: {
    width: BIRD_SIZE,
    height: BIRD_SIZE,
    fontSize: 36,
    lineHeight: BIRD_SIZE,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    minHeight: 52,
    paddingHorizontal: 18,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#2F6F5E',
  },
  secondary: {
    backgroundColor: '#FCECC3',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryText: {
    color: '#2B2B2B',
    fontSize: 16,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.75,
  },
});
