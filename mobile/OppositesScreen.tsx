import { useState } from 'react';
import * as Speech from 'expo-speech';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type OppositePair = {
  id: string;
  title: string;
  leftEmoji: string;
  leftLabel: string;
  rightEmoji: string;
  rightLabel: string;
  cue: string;
};

const OPPOSITES: readonly OppositePair[] = [
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

type OppositesScreenProps = {
  readonly onBack: () => void;
};

export default function OppositesScreen({ onBack }: OppositesScreenProps) {
  const [selectedId, setSelectedId] = useState(OPPOSITES[0].id);

  // Linter-compliant lazy state initializers for Animated values
  const [leftScaleAnim] = useState(() => new Animated.Value(1));
  const [rightScaleAnim] = useState(() => new Animated.Value(1));

  const currentPair = OPPOSITES.find((pair) => pair.id === selectedId) ?? OPPOSITES[0];

  const animateSide = (side: 'left' | 'right') => {
    const targetAnim = side === 'left' ? leftScaleAnim : rightScaleAnim;

    Animated.sequence([
      Animated.timing(targetAnim, { toValue: 1.25, duration: 120, useNativeDriver: true }),
      Animated.spring(targetAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  const speak = (text: string) => {
    void Speech.stop();
    Speech.speak(text, { language: 'en-US', rate: 0.8, pitch: 1.05 });
  };

  const handleTapSide = (side: 'left' | 'right', text: string) => {
    animateSide(side);
    speak(text);
  };

  const goBack = () => {
    void Speech.stop();
    onBack();
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable accessibilityRole="button" onPress={goBack} style={styles.backButton}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Home</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>N</Text></View>
          <View>
            <Text style={styles.brandName}>NoorNest</Text>
            <Text style={styles.brandCaption}>GROWING IN FAITH & WONDER</Text>
          </View>
          <Text style={styles.headerArt}>⚖️</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>EVERYDAY CONCEPTS · DUNYA</Text>
          <Text style={styles.title}>Opposites &amp; Big Concepts</Text>
        </View>

        {/* Interactive Dual Animation Card */}
        <View style={styles.interactiveCard}>
          <Text style={styles.pairTitle}>{currentPair.title}</Text>

          <View style={styles.stage}>
            {/* Left Big Concept */}
            <Pressable
              accessibilityRole="button"
              onPress={() => handleTapSide('left', currentPair.leftLabel)}
              style={styles.sideWell}
            >
              <Animated.Text style={[styles.emojiBig, { transform: [{ scale: leftScaleAnim }] }]}>
                {currentPair.leftEmoji}
              </Animated.Text>
              <Text style={styles.sideLabelBig}>{currentPair.leftLabel}</Text>
            </Pressable>

            <View style={styles.dividerDot} />

            {/* Right Small Concept */}
            <Pressable
              accessibilityRole="button"
              onPress={() => handleTapSide('right', currentPair.rightLabel)}
              style={styles.sideWell}
            >
              <Animated.Text style={[styles.emojiSmall, { transform: [{ scale: rightScaleAnim }] }]}>
                {currentPair.rightEmoji}
              </Animated.Text>
              <Text style={styles.sideLabelSmall}>{currentPair.rightLabel}</Text>
            </Pressable>
          </View>

          <Text style={styles.cueText}>{currentPair.cue}</Text>

          <Pressable
            accessibilityRole="button"
            onPress={() => speak(`${currentPair.leftLabel} and ${currentPair.rightLabel}. ${currentPair.cue}`)}
            style={({ pressed }) => [styles.hearButton, pressed && styles.pressed]}
          >
            <Text style={styles.hearIcon}>♫</Text>
            <Text style={styles.hearText}>Hear Story Together</Text>
          </Pressable>
        </View>

        {/* Picker Buttons */}
        <View style={styles.grid}>
          {OPPOSITES.map((pair) => {
            const isSelected = pair.id === selectedId;
            return (
              <Pressable
                key={pair.id}
                onPress={() => setSelectedId(pair.id)}
                style={[styles.pickerTab, isSelected && styles.selectedPickerTab]}
              >
                <Text style={styles.pickerEmoji}>{pair.leftEmoji} {pair.rightEmoji}</Text>
                <Text style={[styles.pickerTitle, isSelected && styles.selectedPickerTitle]}>
                  {pair.title}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F9F5' },
  scrollContent: { width: '100%', maxWidth: 620, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32 },
  backButton: { minHeight: 38, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backArrow: { color: '#176B67', fontSize: 28, lineHeight: 32, marginRight: 5 },
  backLabel: { color: '#176B67', fontSize: 13, fontWeight: '800' },
  header: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#176B67', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brandMarkText: { color: '#FFFFFF', fontSize: 23, fontWeight: '800' },
  brandName: { color: '#183B38', fontSize: 17, fontWeight: '800' },
  brandCaption: { color: '#71817D', fontSize: 8, fontWeight: '700', marginTop: 2 },
  headerArt: { marginLeft: 'auto', fontSize: 28 },
  titleBlock: { marginTop: 20, marginBottom: 16 },
  eyebrow: { color: '#D46C53', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  title: { color: '#183B38', fontSize: 28, fontWeight: '800', marginTop: 4 },
  interactiveCard: { borderRadius: 22, padding: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5EAE5', marginBottom: 20 },
  pairTitle: { color: '#183B38', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 14 },
  stage: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: 14, backgroundColor: '#F2F7F4', borderRadius: 18 },
  sideWell: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 10 },
  emojiBig: { fontSize: 64 },
  sideLabelBig: { color: '#183B38', fontSize: 15, fontWeight: '800', marginTop: 8 },
  dividerDot: { width: 2, height: 60, backgroundColor: '#D4E2DC' },
  emojiSmall: { fontSize: 44 },
  sideLabelSmall: { color: '#71817D', fontSize: 13, fontWeight: '700', marginTop: 8 },
  cueText: { color: '#35534F', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 16, paddingHorizontal: 10 },
  hearButton: { minHeight: 48, borderRadius: 14, backgroundColor: '#176B67', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  hearIcon: { color: '#FFFFFF', fontSize: 16, marginRight: 8 },
  hearText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
  pickerTab: { width: '48.5%', minHeight: 68, padding: 10, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5EAE5', alignItems: 'center', justifyContent: 'center' },
  selectedPickerTab: { borderColor: '#176B67', backgroundColor: '#EBF4F0', borderWidth: 2 },
  pickerEmoji: { fontSize: 20 },
  pickerTitle: { color: '#71817D', fontSize: 11, fontWeight: '700', marginTop: 4 },
  selectedPickerTitle: { color: '#176B67', fontWeight: '800' },
  pressed: { opacity: 0.78 },
});