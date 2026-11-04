import * as Speech from 'expo-speech';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

const NUMBER_WORDS = [
  'one', 'two', 'three', 'four', 'five',
  'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen',
  'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty',
] as const;

const TOTAL = NUMBER_WORDS.length;
const BIRDS_PER_ROW = 5;
const MAX_ROWS = TOTAL / BIRDS_PER_ROW;
const MAX_CONTENT_WIDTH = 620;
const SCREEN_PADDING = 22;
const BIRD_CARD_PADDING = 14;
const NEST_ROW_HEIGHT = 44;

// Animation tuning. Everything is slow and soft on purpose.
const STAGGER_MS = 350; // gap between one bird leaving the nest and the next
const FLIGHT_MS = 900; // how long one bird takes to fly to its spot
const IDLE_BOB = true; // set to false for completely still birds after landing
const BOB_DISTANCE = 3; // px, tiny on purpose
const BOB_HALF_CYCLE_MS = 1100;

// Keypoints for the curved flight path and the wing flutter.
const PATH_STEPS = [0, 0.25, 0.5, 0.75, 1];
const FLUTTER_STEPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const FLUTTER_ANGLES = ['-14deg', '10deg', '-10deg', '8deg', '-4deg', '0deg'];

type NumbersScreenProps = {
  onBack: () => void;
};

export default function NumbersScreen({ onBack }: NumbersScreenProps) {
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const { width } = useWindowDimensions();

  // flights: 0 = in the nest, 1 = landed. bobs: slow up/down after landing.
  const [flights] = useState(() => Array.from({ length: TOTAL }, () => new Animated.Value(0)));
  const [bobs] = useState(() => Array.from({ length: TOTAL }, () => new Animated.Value(0)));
  const running = useRef<Animated.CompositeAnimation | null>(null);

  const count = index + 1;
  const word = NUMBER_WORDS[index];

  // Birds are always the same size, so 5 looks like more than 2.
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH) - SCREEN_PADDING * 2;
  const innerWidth = contentWidth - BIRD_CARD_PADDING * 2;
  const birdSize = Math.min(64, Math.floor(innerWidth / BIRDS_PER_ROW));

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => subscription.remove();
  }, []);

  const playBirds = useCallback(
    (n: number) => {
      // Cancel any in-flight sequence before starting a new one.
      running.current?.stop();
      flights.forEach((value) => value.setValue(0));
      bobs.forEach((value) => value.setValue(0));

      if (reduceMotion) {
        flights.slice(0, n).forEach((value) => value.setValue(1));
        return;
      }

      const sequence = Animated.stagger(
        STAGGER_MS,
        flights.slice(0, n).map((flight, i) =>
          Animated.sequence([
            Animated.timing(flight, {
              toValue: 1,
              duration: FLIGHT_MS,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            ...(IDLE_BOB
              ? [
                  Animated.loop(
                    Animated.sequence([
                      Animated.timing(bobs[i], {
                        toValue: 1,
                        duration: BOB_HALF_CYCLE_MS,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                      }),
                      Animated.timing(bobs[i], {
                        toValue: 0,
                        duration: BOB_HALF_CYCLE_MS,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                      }),
                    ]),
                  ),
                ]
              : []),
          ]),
        ),
      );
      running.current = sequence;
      sequence.start();
    },
    [flights, bobs, reduceMotion],
  );

  // Birds leave the nest when the screen opens and whenever the number changes.
  // Speech never starts by itself: the grown-up taps Hear.
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

  const moveNumber = (direction: -1 | 1) => {
    Speech.stop();
    setIndex((current) => (current + direction + TOTAL) % TOTAL);
  };

  const hearNumber = () => {
    Speech.stop();
    Speech.speak(word, { language: 'en-US', rate: 0.82, pitch: 1.05 });
    playBirds(count);
  };

  const handleBack = () => {
    Speech.stop();
    running.current?.stop();
    onBack();
  };

  const rows = Array.from({ length: Math.ceil(count / BIRDS_PER_ROW) }, (_, row) =>
    Array.from(
      { length: Math.min(BIRDS_PER_ROW, count - row * BIRDS_PER_ROW) },
      (_, col) => row * BIRDS_PER_ROW + col,
    ),
  );

  const renderBird = (birdIndex: number) => {
    const col = birdIndex % BIRDS_PER_ROW;
    const row = Math.floor(birdIndex / BIRDS_PER_ROW);

    // Where this bird starts, relative to where it lands: on the nest, top right.
    const startX = innerWidth - birdSize - col * birdSize;
    const startY = (NEST_ROW_HEIGHT - birdSize) / 2 - NEST_ROW_HEIGHT - row * birdSize;
    const lift = birdSize * 0.9;

    const flight = flights[birdIndex];
    const bob = bobs[birdIndex];

    return (
      <Animated.Text
        key={birdIndex}
        style={[
          styles.bird,
          {
            width: birdSize,
            height: birdSize,
            lineHeight: birdSize,
            fontSize: Math.round(birdSize * 0.68),
            opacity: flight.interpolate({
              inputRange: [0, 0.12],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            transform: [
              {
                translateX: flight.interpolate({
                  inputRange: [0, 1],
                  outputRange: [startX, 0],
                }),
              },
              {
                // A curved path: straight line to the spot, plus a gentle arc upward.
                translateY: flight.interpolate({
                  inputRange: PATH_STEPS,
                  outputRange: PATH_STEPS.map((p) => startY * (1 - p) - lift * Math.sin(Math.PI * p)),
                }),
              },
              {
                // Slow, tiny bob after landing.
                translateY: bob.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -BOB_DISTANCE],
                }),
              },
              {
                // Soft wing flutter that settles to level.
                rotate: flight.interpolate({
                  inputRange: FLUTTER_STEPS,
                  outputRange: FLUTTER_ANGLES,
                }),
              },
              {
                // Small to full size, with a soft squash on landing.
                scale: flight.interpolate({
                  inputRange: [0, 0.75, 0.9, 1],
                  outputRange: [0.6, 1, 1.1, 1],
                }),
              },
            ],
          },
        ]}
      >
        🐦
      </Animated.Text>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={handleBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Home</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>N</Text>
          </View>
          <View>
            <Text style={styles.brandName}>NoorNest</Text>
            <Text style={styles.brandCaption}>GROWING IN FAITH & WONDER</Text>
          </View>
          <View style={styles.languagePill}>
            <Text style={styles.languageText}>EN</Text>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>A SHARED COUNTING MOMENT</Text>
          <Text style={styles.title}>Let’s count{'\n'}together</Text>
        </View>

        <View style={styles.lessonCard} accessible accessibilityLabel={`${count}, ${word}`}>
          <Text style={styles.lessonEyebrow}>HOW MANY?</Text>
          <Text style={styles.bigNumber}>{count}</Text>
          <Text style={styles.numberWord}>{word}</Text>
        </View>

        <View
          style={[
            styles.birdCard,
            { height: birdSize * MAX_ROWS + NEST_ROW_HEIGHT + BIRD_CARD_PADDING * 2 },
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={[styles.nestRow, { height: NEST_ROW_HEIGHT }]}>
            <Text style={[styles.nest, { width: birdSize }]}>🪺</Text>
          </View>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={[styles.birdRow, { height: birdSize }]}>
              {row.map(renderBird)}
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Hear the number ${word}`}
            onPress={hearNumber}
            style={({ pressed }) => [styles.hearButton, pressed && styles.pressed]}
          >
            <Text style={styles.hearIcon}>♫</Text>
            <Text style={styles.hearLabel}>Hear number</Text>
          </Pressable>
        </View>

        <View style={styles.navigation}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Previous number"
            onPress={() => moveNumber(-1)}
            style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
          >
            <Text style={styles.navArrow}>‹</Text>
          </Pressable>
          <Text style={styles.navHint}>A QUIET MOMENT TOGETHER</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Next number"
            onPress={() => moveNumber(1)}
            style={({ pressed }) => [styles.navButton, styles.nextButton, pressed && styles.pressed]}
          >
            <Text style={styles.navArrow}>›</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

// Styles mirror the Letters screen in App.tsx.
const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SCREEN_PADDING,
    paddingTop: 16,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  backButton: {
    minHeight: 38,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 12,
  },
  backArrow: {
    color: '#176B67',
    fontSize: 28,
    lineHeight: 32,
    marginRight: 5,
    marginTop: -3,
  },
  backLabel: {
    color: '#176B67',
    fontSize: 13,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#176B67',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
  },
  brandName: {
    color: '#183B38',
    fontSize: 18,
    fontWeight: '800',
  },
  brandCaption: {
    color: '#71817D',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginTop: 2,
  },
  languagePill: {
    marginLeft: 'auto',
    minWidth: 42,
    height: 34,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: '#E5F1EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageText: {
    color: '#176B67',
    fontSize: 12,
    fontWeight: '800',
  },
  titleBlock: {
    marginTop: 30,
    marginBottom: 20,
  },
  eyebrow: {
    color: '#D46C53',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    color: '#183B38',
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
  },
  lessonCard: {
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#DDF0E9',
  },
  lessonEyebrow: {
    color: '#176B67',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bigNumber: {
    color: '#183B38',
    fontSize: 92,
    lineHeight: 100,
    fontWeight: '800',
    marginLeft: -4,
  },
  numberWord: {
    color: '#183B38',
    fontSize: 22,
    fontWeight: '700',
  },
  birdCard: {
    marginTop: 12,
    borderRadius: 22,
    padding: BIRD_CARD_PADDING,
    backgroundColor: '#FFF8E8',
    alignItems: 'flex-start',
  },
  nestRow: {
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  nest: {
    fontSize: 34,
    textAlign: 'center',
  },
  birdRow: {
    flexDirection: 'row',
  },
  bird: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 14,
  },
  hearButton: {
    flex: 1,
    minHeight: 62,
    borderRadius: 14,
    backgroundColor: '#176B67',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hearIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    marginRight: 8,
  },
  hearLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 12,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  nextButton: {
    backgroundColor: '#FFC857',
    borderColor: '#FFC857',
  },
  navArrow: {
    color: '#183B38',
    fontSize: 30,
    lineHeight: 34,
    marginTop: -4,
  },
  navHint: {
    color: '#71817D',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  pressed: {
    opacity: 0.78,
  },
});