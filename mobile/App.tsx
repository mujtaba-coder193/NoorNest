import { StatusBar } from 'expo-status-bar';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import { type ComponentRef, useEffect, useRef, useState } from 'react';
import { DAILY_DUAS, QURAN_SURAHS, QURAN_TRANSLATION_SOURCE } from './deenContent';
import CountriesScreen from './CountriesScreen';
import {
  Pressable,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const LETTERS = [
  { letter: 'A', word: 'Apple', picture: '🍎' },
  { letter: 'B', word: 'Bear', picture: '🐻' },
  { letter: 'C', word: 'Cat', picture: '🐱' },
  { letter: 'D', word: 'Dog', picture: '🐶' },
  { letter: 'E', word: 'Elephant', picture: '🐘' },
  { letter: 'F', word: 'Fish', picture: '🐠' },
  { letter: 'G', word: 'Giraffe', picture: '🦒' },
  { letter: 'H', word: 'House', picture: '🏠' },
  { letter: 'I', word: 'Ice cream', picture: '🍦' },
  { letter: 'J', word: 'Juice', picture: '🧃' },
  { letter: 'K', word: 'Kite', picture: '🪁' },
  { letter: 'L', word: 'Lion', picture: '🦁' },
  { letter: 'M', word: 'Moon', picture: '🌙' },
  { letter: 'N', word: 'Nest', picture: '🪺' },
  { letter: 'O', word: 'Octopus', picture: '🐙' },
  { letter: 'P', word: 'Penguin', picture: '🐧' },
  { letter: 'Q', word: 'Queen', picture: '👑' },
  { letter: 'R', word: 'Rainbow', picture: '🌈' },
  { letter: 'S', word: 'Sun', picture: '☀️' },
  { letter: 'T', word: 'Turtle', picture: '🐢' },
  { letter: 'U', word: 'Umbrella', picture: '☂️' },
  { letter: 'V', word: 'Violin', picture: '🎻' },
  { letter: 'W', word: 'Whale', picture: '🐳' },
  { letter: 'X', word: 'Xylophone', picture: '🎶' },
  { letter: 'Y', word: 'Yo-yo', picture: '🪀' },
  { letter: 'Z', word: 'Zebra', picture: '🦓' },
] as const;

const LETTER_NAMES: Record<string, string> = {
  A: 'ay',
  B: 'bee',
  C: 'see',
  D: 'dee',
  E: 'ee',
  F: 'eff',
  G: 'jee',
  H: 'aitch',
  I: 'eye',
  J: 'jay',
  K: 'kay',
  L: 'ell',
  M: 'em',
  N: 'en',
  O: 'oh',
  P: 'pee',
  Q: 'cue',
  R: 'ar',
  S: 'ess',
  T: 'tee',
  U: 'you',
  V: 'vee',
  W: 'double you',
  X: 'ex',
  Y: 'why',
  Z: 'zee',
};

type LearningModule = {
  title: string;
  description: string;
  icon: string;
  tint: string;
  route?: 'alphabet' | 'countries' | 'daily-duas' | 'quran';
};

const DUNYA_MODULES: LearningModule[] = [
  { title: 'Letters', description: 'English A to Z', icon: 'Aa', tint: '#FCE1D8', route: 'alphabet' },
  { title: 'Countries', description: 'Flags, capitals and quick facts', icon: '🌍', tint: '#DCEAF3', route: 'countries' },
  { title: 'Numbers', description: 'Count and discover', icon: '123', tint: '#FCECC3' },
  { title: 'Animals & fruits', description: 'Meet the living world', icon: '🐘', tint: '#DCEFE5' },
  { title: 'Vegetables', description: 'Explore plants and colors', icon: '🥕', tint: '#FCE1D8' },
];

const DEEN_MODULES: LearningModule[] = [
  { title: 'Daily duas', description: 'Small words for everyday moments', icon: '🤲', tint: '#FCECC3', route: 'daily-duas' },
  { title: 'Qur’an', description: 'Al-Fatihah and the three Quls', icon: '📖', tint: '#DCEFE5', route: 'quran' },
];

export default function App() {
  const [screen, setScreen] = useState<'home' | 'alphabet' | 'countries' | 'daily-duas' | 'quran'>('home');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedDuaIndex, setSelectedDuaIndex] = useState(0);
  const [selectedSurahIndex, setSelectedSurahIndex] = useState(0);
  const [loadedSurahNumber, setLoadedSurahNumber] = useState<number | null>(null);
  const [sourceError, setSourceError] = useState(false);
  const quranScrollRef = useRef<ComponentRef<typeof ScrollView> | null>(null);
  const verseOffsetsRef = useRef<number[]>([]);
  const { width } = useWindowDimensions();
  const audioPlayer = useAudioPlayer();
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const isWide = width >= 720;
  const current = LETTERS[selectedIndex];
  const currentDua = DAILY_DUAS[selectedDuaIndex];
  const currentSurah = QURAN_SURAHS[selectedSurahIndex];
  const playbackTimeMs = audioStatus.currentTime * 1000;
  const activeVerseIndex = loadedSurahNumber === currentSurah.number && audioStatus.isLoaded
    ? audioStatus.didJustFinish
      ? currentSurah.verses.length - 1
      : currentSurah.verses.findIndex(
        (verse) => playbackTimeMs >= verse.startMs && playbackTimeMs < verse.endMs,
      )
    : -1;

  useEffect(() => {
    void setAudioModeAsync({ playsInSilentMode: true });
  }, []);

  useEffect(() => {
    if (screen !== 'quran' || activeVerseIndex < 0) {
      return;
    }

    const verseOffset = verseOffsetsRef.current[activeVerseIndex];
    if (verseOffset !== undefined) {
      quranScrollRef.current?.scrollTo({ y: Math.max(verseOffset - 150, 0), animated: true });
    }
  }, [activeVerseIndex, screen, selectedSurahIndex]);

  const speak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', rate: 0.82, pitch: 1.05 });
  };

  const moveLetter = (direction: -1 | 1) => {
    setSelectedIndex((index) => (index + direction + LETTERS.length) % LETTERS.length);
  };

  const toggleRecitation = () => {
    if (audioStatus.playing) {
      audioPlayer.pause();
      return;
    }

    if (loadedSurahNumber === currentSurah.number) {
      if (audioStatus.didJustFinish) {
        audioPlayer.seekTo(0);
      }
    } else {
      audioPlayer.replace(currentSurah.audioUrl);
      setLoadedSurahNumber(currentSurah.number);
    }

    audioPlayer.play();
  };

  const selectSurah = (index: number) => {
    audioPlayer.pause();
    setLoadedSurahNumber(null);
    verseOffsetsRef.current = [];
    setSelectedSurahIndex(index);
  };

  const openReference = async (url: string) => {
    try {
      await Linking.openURL(url);
      setSourceError(false);
    } catch {
      setSourceError(true);
    }
  };

  const renderModuleCards = (modules: LearningModule[]) => modules.map((module) => {
    const route = module.route;
    const contents = (
      <>
        <View style={[styles.moduleIconWell, { backgroundColor: module.tint }]}>
          <Text style={[styles.moduleIcon, module.icon.length > 2 && styles.moduleIconText]}>
            {module.icon}
          </Text>
        </View>
        <View style={styles.moduleCopy}>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.moduleDescription}>{module.description}</Text>
          <Text style={[styles.moduleStatus, route && styles.availableStatus]}>
            {route ? 'OPEN TOGETHER' : 'COMING NEXT'}
          </Text>
        </View>
        {route && <Text style={styles.moduleArrow}>›</Text>}
      </>
    );

    if (route) {
      return (
        <Pressable
          key={module.title}
          accessibilityRole="button"
          accessibilityLabel={`Open ${module.title}`}
          onPress={() => setScreen(route)}
          style={({ pressed }) => [styles.moduleCard, styles.availableModuleCard, pressed && styles.pressed]}
        >
          {contents}
        </Pressable>
      );
    }

    return (
      <View key={module.title} accessibilityState={{ disabled: true }} style={styles.moduleCard}>
        {contents}
      </View>
    );
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        {screen === 'home' ? (
          <ScrollView contentContainerStyle={styles.homeScrollContent}>
            <View style={[styles.homeContent, isWide && styles.homeContentWide]}>
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

          <View style={styles.homeIntro}>
            <Text style={styles.homeEyebrow}>MADE FOR LITTLE MOMENTS</Text>
            <Text style={styles.homeTitle}>A little moment{ '\n' }to share</Text>
          </View>

          <View style={[styles.homeHero, isWide && styles.homeHeroWide]}>
            <View style={styles.heroCopy}>
              <Text style={styles.heroEyebrow}>GROWING TOGETHER</Text>
              <Text style={styles.heroTitle}>One little sound,{ '\n' }a lovely moment.</Text>
              <Text style={styles.heroDescription}>A gentle, grown-up-guided moment for letters, words and faith.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => setScreen('alphabet')}
                style={({ pressed }) => [styles.heroButton, pressed && styles.pressed]}
              >
                <Text style={styles.heroButtonText}>Begin together</Text>
                <Text style={styles.heroButtonArrow}>›</Text>
              </Pressable>
            </View>
            <View style={styles.heroArt} accessibilityElementsHidden>
              <Text style={styles.heroLetters}>Aa</Text>
              <Text style={styles.heroApple}>🍎</Text>
            </View>
          </View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Dunya</Text>
              <Text style={styles.sectionDescription}>Things to name together</Text>
            </View>
            <Text style={styles.sectionCount}>5 PATHS</Text>
          </View>
          <View style={styles.moduleGrid}>{renderModuleCards(DUNYA_MODULES)}</View>

          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Deen</Text>
              <Text style={styles.sectionDescription}>Gentle moments of faith</Text>
            </View>
            <Text style={styles.sectionCount}>2 PATHS</Text>
          </View>
          <View style={styles.moduleGrid}>{renderModuleCards(DEEN_MODULES)}</View>

          <View style={styles.languageNote}>
            <Text style={styles.languageNoteText}>English first</Text>
            <Text style={styles.languageNoteSubtext}>Arabic, Urdu and Norwegian will follow.</Text>
          </View>
          </View>
            </ScrollView>
          ) : screen === 'alphabet' ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              onPress={() => setScreen('home')}
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
              <Text style={styles.eyebrow}>A SHARED ENGLISH MOMENT</Text>
              <Text style={styles.title}>Let’s explore{ '\n' }letters together</Text>
            </View>

            <View style={styles.lessonCard}>
              <View style={styles.lessonCopy}>
                <Text style={styles.lessonEyebrow}>{current.letter} IS FOR</Text>
                <Text style={styles.bigLetter}>{current.letter}</Text>
                <Text style={styles.word}>{current.word}</Text>
              </View>
              <View style={styles.pictureWell}>
                <Text style={styles.picture}>{current.picture}</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Hear the letter ${current.letter}`}
                onPress={() => speak(LETTER_NAMES[current.letter])}
                style={({ pressed }) => [styles.hearButton, pressed && styles.pressed]}
              >
                <Text style={styles.hearIcon}>♫</Text>
                <Text style={styles.hearLabel}>Hear letter</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Hear the word ${current.word}`}
                onPress={() => speak(current.word)}
                style={({ pressed }) => [styles.wordButton, pressed && styles.pressed]}
              >
                <Text style={styles.wordIcon}>◖</Text>
                <Text style={styles.wordButtonLabel}>Hear word</Text>
              </Pressable>
            </View>

            <View style={styles.navigation}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous letter"
                onPress={() => moveLetter(-1)}
                style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
              >
                <Text style={styles.navArrow}>‹</Text>
              </Pressable>
              <Text style={styles.navHint}>A QUIET MOMENT TOGETHER</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next letter"
                onPress={() => moveLetter(1)}
                style={({ pressed }) => [styles.navButton, styles.nextButton, pressed && styles.pressed]}
              >
                <Text style={[styles.navArrow, styles.nextArrow]}>›</Text>
              </Pressable>
            </View>

            </View>
          </ScrollView>
        ) : screen === 'daily-duas' ? (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to home"
                onPress={() => {
                  audioPlayer.pause();
                  setScreen('home');
                }}
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
                <Text style={styles.eyebrow}>DAILY DUAS · GROWN-UP LED</Text>
                <Text style={styles.title}>Small duas for{ '\n' }everyday moments</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.routinePicker}
              >
                {DAILY_DUAS.map((dua, index) => {
                  const isSelected = index === selectedDuaIndex;
                  return (
                    <Pressable
                      key={dua.id}
                      accessibilityRole="button"
                      accessibilityLabel={dua.title}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => setSelectedDuaIndex(index)}
                      style={({ pressed }) => [
                        styles.routineTab,
                        isSelected && styles.selectedRoutineTab,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.routineTabText, isSelected && styles.selectedRoutineTabText]}>
                        {dua.cue}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.duaCard}>
                <Text style={styles.duaArabic} accessibilityLabel="Arabic supplication">
                  {currentDua.arabic}
                </Text>
                <View style={styles.duaDivider} />
                <Text style={styles.duaTransliteration}>{currentDua.transliteration}</Text>
              </View>

              <Text style={styles.duaSectionLabel}>MEANING</Text>
              <Text style={styles.duaMeaning}>{currentDua.meaning}</Text>

              <View style={styles.duaReference}>
                <Text style={styles.duaReferenceLabel}>HADITH SOURCE</Text>
                <View style={styles.duaSources}>
                  {currentDua.sources.map((source) => (
                    <Pressable
                      key={source.url}
                      accessibilityRole="link"
                      onPress={() => openReference(source.url)}
                      style={({ pressed }) => [styles.duaSourceLink, pressed && styles.pressed]}
                    >
                      <Text style={styles.duaReferenceText}>{source.label} ↗</Text>
                    </Pressable>
                  ))}
                </View>
                {sourceError && <Text style={styles.sourceError}>Could not open the source. Please try again.</Text>}
              </View>
            </View>
          </ScrollView>
        ) : screen === 'quran' ? (
          <ScrollView ref={quranScrollRef} contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back to home"
                onPress={() => {
                  audioPlayer.pause();
                  setScreen('home');
                }}
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
                <Text style={styles.eyebrow}>QUR’AN · ARABIC & ENGLISH</Text>
                <Text style={styles.title}>A little surah{ '\n' }to share</Text>
              </View>

              <View style={styles.surahPicker}>
                {QURAN_SURAHS.map((surah, index) => {
                  const isSelected = index === selectedSurahIndex;
                  return (
                    <Pressable
                      key={surah.number}
                      accessibilityRole="button"
                      accessibilityLabel={`Read ${surah.name}`}
                      accessibilityState={{ selected: isSelected }}
                      onPress={() => selectSurah(index)}
                      style={({ pressed }) => [
                        styles.surahTab,
                        isSelected && styles.selectedSurahTab,
                        pressed && styles.pressed,
                      ]}
                    >
                      <Text style={[styles.surahTabTitle, isSelected && styles.selectedSurahTabTitle]}>
                        {surah.name}
                      </Text>
                      <Text style={[styles.surahTabArabic, isSelected && styles.selectedSurahTabTitle]}>
                        {surah.arabicName}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.surahHeading}>
                <Text style={styles.surahHeadingTitle}>{currentSurah.name}</Text>
                <Text style={styles.surahHeadingArabic}>{currentSurah.arabicName}</Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={audioStatus.playing ? 'Pause recitation' : `Play ${currentSurah.name} recitation`}
                accessibilityState={{ busy: audioStatus.isBuffering }}
                onPress={toggleRecitation}
                style={({ pressed }) => [styles.recitationButton, pressed && styles.pressed]}
              >
                <Text style={styles.recitationIcon}>
                  {audioStatus.isBuffering ? '…' : audioStatus.playing ? 'Ⅱ' : '▶'}
                </Text>
                <View style={styles.recitationCopy}>
                  <Text style={styles.recitationTitle}>
                    {audioStatus.isBuffering ? 'Loading tilawah…' : audioStatus.playing ? 'Pause recitation' : 'Play recitation'}
                  </Text>
                  <Text style={styles.recitationByline}>Sheikh Abdur-Rahman as-Sudais · QuranicAudio stream</Text>
                </View>
              </Pressable>
              {audioStatus.error && (
                <Text style={styles.audioError}>Audio could not be loaded. Check your internet connection and try again.</Text>
              )}

              {currentSurah.verses.map((verse, index) => {
                const isActiveVerse = index === activeVerseIndex;
                return (
                <View
                  key={`${currentSurah.number}:${index + 1}`}
                  onLayout={(event) => {
                    verseOffsetsRef.current[index] = event.nativeEvent.layout.y;
                  }}
                  style={[styles.quranVerse, isActiveVerse && styles.activeQuranVerse]}
                >
                  <View style={[styles.verseNumber, isActiveVerse && styles.activeVerseNumber]}>
                    <Text style={styles.verseNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.quranArabic, isActiveVerse && styles.activeQuranArabic]}>{verse.arabic}</Text>
                  <Text style={styles.quranTranslation}>{verse.translation}</Text>
                </View>
                );
              })}

              <Text style={styles.translationAttribution}>
                English translation: {QURAN_TRANSLATION_SOURCE}
              </Text>
            </View>
          </ScrollView>
        ) : (
          <CountriesScreen onBack={() => setScreen('home')} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F9F5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 32,
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  homeScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  homeContent: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  homeContentWide: {
    maxWidth: 960,
  },
  homeIntro: {
    marginTop: 28,
    marginBottom: 18,
  },
  homeEyebrow: {
    color: '#D46C53',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  homeTitle: {
    color: '#183B38',
    fontSize: 29,
    lineHeight: 34,
    fontWeight: '800',
  },
  homeHero: {
    minHeight: 190,
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#176B67',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  homeHeroWide: {
    minHeight: 218,
    paddingHorizontal: 30,
    paddingVertical: 24,
  },
  heroCopy: {
    flex: 1,
    paddingRight: 8,
  },
  heroEyebrow: {
    color: '#BFE9E2',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 23,
    lineHeight: 28,
    fontWeight: '800',
  },
  heroDescription: {
    color: '#D9EFEB',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  heroButton: {
    minHeight: 42,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    marginTop: 14,
    borderRadius: 12,
    backgroundColor: '#FFC857',
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroButtonText: {
    color: '#243D39',
    fontSize: 13,
    fontWeight: '800',
  },
  heroButtonArrow: {
    color: '#243D39',
    fontSize: 24,
    lineHeight: 26,
    marginLeft: 10,
    marginTop: -2,
  },
  heroArt: {
    width: 108,
    height: 138,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27847D',
    borderRadius: 18,
    transform: [{ rotate: '4deg' }],
  },
  heroLetters: {
    color: '#FFFFFF',
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '800',
  },
  heroApple: {
    fontSize: 38,
    marginTop: 6,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#183B38',
    fontSize: 21,
    lineHeight: 26,
    fontWeight: '800',
  },
  sectionDescription: {
    color: '#71817D',
    fontSize: 12,
    marginTop: 2,
  },
  sectionCount: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  moduleCard: {
    width: '48.8%',
    minHeight: 118,
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  availableModuleCard: {
    borderColor: '#176B67',
  },
  moduleIconWell: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  moduleIcon: {
    fontSize: 23,
    fontWeight: '800',
    color: '#183B38',
  },
  moduleIconText: {
    fontSize: 15,
  },
  moduleCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  moduleTitle: {
    color: '#183B38',
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '800',
  },
  moduleDescription: {
    color: '#71817D',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
  },
  moduleStatus: {
    color: '#A7ADA8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 8,
  },
  availableStatus: {
    color: '#176B67',
  },
  moduleArrow: {
    color: '#176B67',
    fontSize: 21,
    lineHeight: 24,
    marginLeft: 3,
  },
  languageNote: {
    borderTopWidth: 1,
    borderTopColor: '#E3EAE5',
    marginTop: 26,
    paddingTop: 14,
  },
  languageNoteText: {
    color: '#183B38',
    fontSize: 12,
    fontWeight: '800',
  },
  languageNoteSubtext: {
    color: '#71817D',
    fontSize: 11,
    marginTop: 3,
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
  routinePicker: {
    flexDirection: 'row',
    paddingRight: 20,
    marginBottom: 14,
  },
  routineTab: {
    minHeight: 44,
    paddingHorizontal: 14,
    marginRight: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRoutineTab: {
    backgroundColor: '#176B67',
    borderColor: '#176B67',
  },
  routineTabText: {
    color: '#35534F',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedRoutineTabText: {
    color: '#FFFFFF',
  },
  surahPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
    marginBottom: 18,
  },
  surahTab: {
    width: '48.8%',
    minHeight: 64,
    padding: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  selectedSurahTab: {
    backgroundColor: '#176B67',
    borderColor: '#176B67',
  },
  surahTabTitle: {
    color: '#183B38',
    fontSize: 13,
    fontWeight: '800',
  },
  surahTabArabic: {
    color: '#71817D',
    fontSize: 16,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: 3,
  },
  selectedSurahTabTitle: {
    color: '#FFFFFF',
  },
  surahHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: 8,
  },
  surahHeadingTitle: {
    color: '#183B38',
    fontSize: 18,
    fontWeight: '800',
  },
  surahHeadingArabic: {
    color: '#176B67',
    fontSize: 20,
    writingDirection: 'rtl',
  },
  recitationButton: {
    minHeight: 72,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#176B67',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recitationIcon: {
    width: 30,
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
    marginRight: 12,
  },
  recitationCopy: {
    flex: 1,
  },
  recitationTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  recitationByline: {
    color: '#D9EFEB',
    fontSize: 10,
    lineHeight: 14,
    marginTop: 4,
  },
  audioError: {
    color: '#A64D3D',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 12,
  },
  quranVerse: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE5',
    paddingVertical: 14,
  },
  activeQuranVerse: {
    backgroundColor: '#FFF2D6',
    borderBottomColor: '#F3C969',
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  verseNumber: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#E5F1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  verseNumberText: {
    color: '#176B67',
    fontSize: 10,
    fontWeight: '800',
  },
  activeVerseNumber: {
    backgroundColor: '#F3C969',
  },
  quranArabic: {
    color: '#183B38',
    fontSize: 24,
    lineHeight: 44,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  activeQuranArabic: {
    fontWeight: '700',
  },
  quranTranslation: {
    color: '#35534F',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
  translationAttribution: {
    color: '#71817D',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 16,
  },
  duaCard: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#DDF0E9',
  },
  duaArabic: {
    color: '#183B38',
    fontSize: 26,
    lineHeight: 48,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontWeight: '600',
  },
  duaDivider: {
    height: 1,
    backgroundColor: '#B9D8CF',
    marginVertical: 18,
  },
  duaTransliteration: {
    color: '#35534F',
    fontSize: 15,
    lineHeight: 23,
    fontWeight: '600',
  },
  duaSectionLabel: {
    color: '#D46C53',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: 24,
    marginBottom: 8,
  },
  duaMeaning: {
    color: '#183B38',
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '600',
  },
  duaReference: {
    borderTopWidth: 1,
    borderTopColor: '#E3EAE5',
    marginTop: 24,
    paddingTop: 14,
  },
  duaReferenceLabel: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  duaSources: {
    alignItems: 'flex-start',
  },
  duaSourceLink: {
    minHeight: 40,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingRight: 12,
  },
  duaReferenceText: {
    color: '#176B67',
    fontSize: 13,
    fontWeight: '700',
  },
  sourceError: {
    color: '#A64D3D',
    fontSize: 11,
    marginTop: 6,
  },
  lessonCard: {
    minHeight: 224,
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#DDF0E9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  lessonCopy: {
    flex: 1,
  },
  lessonEyebrow: {
    color: '#176B67',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bigLetter: {
    color: '#183B38',
    fontSize: 92,
    lineHeight: 100,
    fontWeight: '800',
    marginLeft: -4,
  },
  word: {
    color: '#183B38',
    fontSize: 22,
    fontWeight: '700',
  },
  pictureWell: {
    width: 122,
    height: 122,
    borderRadius: 38,
    backgroundColor: '#FFF8E8',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '4deg' }],
  },
  picture: {
    fontSize: 70,
    transform: [{ rotate: '-4deg' }],
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
    marginRight: 7,
  },
  wordButton: {
    flex: 1,
    minHeight: 62,
    borderRadius: 14,
    backgroundColor: '#FBE2D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 7,
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
  wordIcon: {
    color: '#A64D3D',
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },
  wordButtonLabel: {
    color: '#8E463A',
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
  nextArrow: {
    color: '#183B38',
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
