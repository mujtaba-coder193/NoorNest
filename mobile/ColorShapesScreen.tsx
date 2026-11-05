import { useState } from 'react';
import * as Speech from 'expo-speech';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type LessonMode = 'colors' | 'shapes';
type ShapeKind = 'circle' | 'square' | 'triangle' | 'rectangle' | 'oval' | 'star' | 'heart' | 'diamond';

type Lesson = {
  id: string;
  name: string;
  phrase: string;
  example: string;
  color: string;
  shape?: ShapeKind;
};

type ColorShapesScreenProps = {
  onBack: () => void;
};

const COLORS: Lesson[] = [
  { id: 'red', name: 'Red', phrase: 'An apple is red.', example: '🍎', color: '#E8534F' },
  { id: 'blue', name: 'Blue', phrase: 'The sky can be blue.', example: '💧', color: '#3488D5' },
  { id: 'yellow', name: 'Yellow', phrase: 'The sun is yellow.', example: '☀️', color: '#EABF27' },
  { id: 'green', name: 'Green', phrase: 'A leaf is green.', example: '🍃', color: '#3E9B62' },
  { id: 'orange', name: 'Orange', phrase: 'An orange is orange.', example: '🍊', color: '#EC8535' },
  { id: 'purple', name: 'Purple', phrase: 'A grape can be purple.', example: '🍇', color: '#9167B6' },
  { id: 'pink', name: 'Pink', phrase: 'A flower can be pink.', example: '🌸', color: '#E276A0' },
  { id: 'brown', name: 'Brown', phrase: 'A bear can be brown.', example: '🐻', color: '#996849' },
  { id: 'black', name: 'Black', phrase: 'The night can look black.', example: '🌙', color: '#37434A' },
  { id: 'white', name: 'White', phrase: 'A cloud can be white.', example: '☁️', color: '#FFFFFF' },
  { id: 'gray', name: 'Gray', phrase: 'An elephant can be gray.', example: '🐘', color: '#87949A' },
];

const SHAPES: Lesson[] = [
  { id: 'circle', name: 'Circle', phrase: 'A ball is a circle.', example: '⚽', color: '#E8534F', shape: 'circle' },
  { id: 'square', name: 'Square', phrase: 'A square has four sides.', example: '🧊', color: '#3488D5', shape: 'square' },
  { id: 'triangle', name: 'Triangle', phrase: 'A triangle has three sides.', example: '🍕', color: '#EABF27', shape: 'triangle' },
  { id: 'rectangle', name: 'Rectangle', phrase: 'A book can be a rectangle.', example: '📕', color: '#3E9B62', shape: 'rectangle' },
  { id: 'oval', name: 'Oval', phrase: 'An egg is an oval.', example: '🥚', color: '#EC8535', shape: 'oval' },
  { id: 'star', name: 'Star', phrase: 'A star has points.', example: '⭐', color: '#9167B6', shape: 'star' },
  { id: 'heart', name: 'Heart', phrase: 'A heart is a lovely shape.', example: '💛', color: '#E276A0', shape: 'heart' },
  { id: 'diamond', name: 'Diamond', phrase: 'A diamond has four sides.', example: '🔷', color: '#37434A', shape: 'diamond' },
];

const SHAPE_GLYPHS: Record<ShapeKind, string> = {
  circle: '',
  square: '',
  triangle: '',
  rectangle: '',
  oval: '',
  star: '★',
  heart: '♥',
  diamond: '◆',
};

export default function ColorShapesScreen({ onBack }: ColorShapesScreenProps) {
  const [mode, setMode] = useState<LessonMode>('colors');
  const [selectedId, setSelectedId] = useState('red');
  const lessons = mode === 'colors' ? COLORS : SHAPES;

  const selectLesson = (lesson: Lesson) => {
    setSelectedId(lesson.id);
    Speech.stop();
    Speech.speak(`${lesson.name}. ${lesson.phrase}`, {
      language: 'en-US',
      rate: 0.76,
      pitch: 1.08,
    });
  };

  const changeMode = (nextMode: LessonMode) => {
    setMode(nextMode);
    setSelectedId(nextMode === 'colors' ? 'red' : 'circle');
    Speech.stop();
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={() => {
            Speech.stop();
            onBack();
          }}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backLabel}>Home</Text>
        </Pressable>

        <View style={styles.header}>
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>N</Text></View>
          <View>
            <Text style={styles.brandName}>NoorNest</Text>
            <Text style={styles.brandCaption}>GROWING IN FAITH & WONDER</Text>
          </View>
          <Text style={styles.headerArt} accessibilityElementsHidden>🌈</Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>LITTLE DISCOVERIES</Text>
          <Text style={styles.title}>Colors & shapes</Text>
          <Text style={styles.description}>Bright colors. Big shapes. Little words to share.</Text>
        </View>

        <View style={styles.modePicker} accessibilityRole="tablist">
          {(['colors', 'shapes'] as const).map((item) => {
            const isSelected = mode === item;
            return (
              <Pressable
                key={item}
                accessibilityRole="tab"
                accessibilityState={{ selected: isSelected }}
                onPress={() => changeMode(item)}
                style={({ pressed }) => [styles.modeTab, isSelected && styles.selectedModeTab, pressed && styles.pressed]}
              >
                <Text style={styles.modeIcon}>{item === 'colors' ? '🎨' : '🔷'}</Text>
                <Text style={[styles.modeText, isSelected && styles.selectedModeText]}>
                  {item === 'colors' ? 'Colors' : 'Shapes'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.sectionLine}>
          <Text style={styles.sectionTitle}>{mode === 'colors' ? 'Color friends' : 'Shape friends'}</Text>
          <Text style={styles.count}>{lessons.length} TO EXPLORE</Text>
        </View>

        <View style={styles.lessonGrid}>
          {lessons.map((lesson) => {
            const isSelected = selectedId === lesson.id;
            return (
              <Pressable
                key={lesson.id}
                accessibilityRole="button"
                accessibilityLabel={`${lesson.name}. ${lesson.phrase} Hear it.`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => selectLesson(lesson)}
                style={({ pressed }) => [
                  styles.lessonCard,
                  isSelected && { borderColor: lesson.color === '#FFFFFF' ? '#EABF27' : lesson.color },
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.visualStage}>
                  {mode === 'colors' ? (
                    <View style={[
                      styles.colorSwatch,
                      { backgroundColor: lesson.color },
                      lesson.id === 'white' && styles.whiteSwatch,
                    ]} />
                  ) : (
                    <ShapeVisual lesson={lesson} />
                  )}
                </View>
                <Text style={styles.lessonName}>{lesson.name}</Text>
                <View style={styles.lessonFooter}>
                  <Text style={styles.example}>{lesson.example}</Text>
                  <Text style={styles.hearHint}>♫ Hear</Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.footer}>Little voices grow one word at a time.</Text>
      </ScrollView>
    </View>
  );
}

function ShapeVisual({ lesson }: { lesson: Lesson }) {
  const shape = lesson.shape;
  if (!shape) return null;
  if (shape === 'star' || shape === 'heart' || shape === 'diamond') {
    return <Text style={[styles.glyphShape, { color: lesson.color }]}>{SHAPE_GLYPHS[shape]}</Text>;
  }
  if (shape === 'triangle') {
    return <View style={[styles.triangle, { borderBottomColor: lesson.color }]} />;
  }
  return <View style={[styles.basicShape, styles[shape], { backgroundColor: lesson.color }]} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF9EF',
  },
  scrollContent: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
  },
  backButton: {
    minHeight: 42,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#176B67',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandMarkText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: '800',
  },
  brandName: {
    color: '#183B38',
    fontSize: 17,
    fontWeight: '800',
  },
  brandCaption: {
    color: '#71817D',
    fontSize: 8,
    fontWeight: '700',
    marginTop: 2,
  },
  headerArt: {
    marginLeft: 'auto',
    fontSize: 34,
  },
  intro: {
    marginTop: 22,
    marginBottom: 18,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFE7C2',
  },
  eyebrow: {
    color: '#C45A47',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#183B38',
    fontSize: 27,
    lineHeight: 33,
    fontWeight: '800',
  },
  description: {
    color: '#586B65',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  modePicker: {
    flexDirection: 'row',
    borderRadius: 17,
    backgroundColor: '#E8EFEB',
    padding: 5,
    marginBottom: 20,
  },
  modeTab: {
    flex: 1,
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
  },
  selectedModeTab: {
    backgroundColor: '#176B67',
  },
  modeIcon: {
    fontSize: 18,
    marginRight: 7,
  },
  modeText: {
    color: '#35534F',
    fontSize: 15,
    fontWeight: '800',
  },
  selectedModeText: {
    color: '#FFFFFF',
  },
  sectionLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 11,
  },
  sectionTitle: {
    color: '#183B38',
    fontSize: 17,
    fontWeight: '800',
  },
  count: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
  },
  lessonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 11,
  },
  lessonCard: {
    width: '48.5%',
    minHeight: 177,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 9,
    borderWidth: 2,
    borderColor: '#F0E9DF',
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  visualStage: {
    width: '100%',
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#FFF8F0',
  },
  colorSwatch: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 3,
    borderColor: 'rgba(24, 59, 56, 0.08)',
  },
  whiteSwatch: {
    borderColor: '#CBD5D0',
  },
  basicShape: {
    width: 60,
    height: 60,
  },
  circle: {
    borderRadius: 30,
  },
  square: {
    borderRadius: 9,
  },
  rectangle: {
    width: 78,
    height: 52,
    borderRadius: 8,
  },
  oval: {
    width: 76,
    height: 53,
    borderRadius: 30,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 37,
    borderRightWidth: 37,
    borderBottomWidth: 64,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  glyphShape: {
    fontSize: 72,
    lineHeight: 84,
    fontWeight: '800',
  },
  lessonName: {
    color: '#183B38',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 7,
  },
  lessonFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 3,
  },
  example: {
    fontSize: 19,
  },
  hearHint: {
    color: '#176B67',
    fontSize: 11,
    fontWeight: '800',
  },
  footer: {
    color: '#71817D',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 22,
  },
  pressed: {
    opacity: 0.78,
  },
});