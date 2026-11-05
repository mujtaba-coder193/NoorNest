import { useState } from 'react';
import * as Speech from 'expo-speech';
import { Animated, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AnimatedAdabVisual from './AnimatedAdabVisual';
import { DeenPersonOrAngel } from './deenContent';

type DeenCollectionGroup =
  | 'ten-companions'
  | 'prophet-wives'
  | 'angels'
  | 'everyday-phrases'
  | 'starter-prophets'
  | 'everyday-manners';

type DeenCollectionScreenProps = {
  readonly group: DeenCollectionGroup;
  readonly items: readonly DeenPersonOrAngel[];
  readonly onBack: () => void;
};

export default function DeenCollectionScreen({ group, items, onBack }: DeenCollectionScreenProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const [sourceError, setSourceError] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0];

  const animateCard = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, tension: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleSelectItem = (id: string) => {
    setSelectedId(id);
    animateCard();
  };

  const speak = (text: string, language: string) => {
    void Speech.stop();
    Speech.speak(text, { language, rate: 0.78, pitch: 1 });
  };

  const openReference = async (url: string) => {
    try {
      await Linking.openURL(url);
      setSourceError(false);
    } catch {
      setSourceError(true);
    }
  };

  const goBack = () => {
    void Speech.stop();
    onBack();
  };

  const titleMap: Record<DeenCollectionGroup, string> = {
    'ten-companions': 'Ten Companions Promised Jannah',
    'prophet-wives': 'Mothers of the Believers',
    angels: 'Angels Named in Sources',
    'everyday-phrases': 'Everyday Islamic Phrases',
    'starter-prophets': '25 Prophets Named in Qur’an',
    'everyday-manners': 'Everyday Sunnah Manners',
  };

  const eyebrowMap: Record<DeenCollectionGroup, string> = {
    'ten-companions': 'TEN COMPANIONS · PROMISED JANNAH',
    'prophet-wives': 'MOTHERS OF THE BELIEVERS · QUR’AN 33:6',
    angels: 'ANGELS · AUTHENTIC SOURCES',
    'everyday-phrases': 'EVERYDAY ADAB · PHRASES FOR TODDLERS',
    'starter-prophets': 'PROPHET LINEAGE & NATIONS · QUR’AN',
    'everyday-manners': 'GENTLE ADAB · SUNNAH FOR LITTLE ONES',
  };

  const introDescMap: Record<DeenCollectionGroup, string> = {
    'ten-companions': 'Explore the ten companions individually named in an authentic hadith report.',
    'prophet-wives': 'Learn the names and quiet moments of the Prophet’s wives, honorific Mothers of the Believers.',
    angels: 'A gentle introduction to named angels from the Qur’an and authentic reports.',
    'everyday-phrases': 'Simple, beautiful words to say together throughout the day with your child.',
    'starter-prophets': 'All 25 Prophets explicitly named in the Qur’an in order from Adam to Muhammad ﷺ.',
    'everyday-manners': 'Gentle daily habits grounded in the Sunnah for eating, cleanliness, and kindness.',
  };

  const iconMap: Record<DeenCollectionGroup, string> = {
    'ten-companions': '⭐',
    'prophet-wives': '🌸',
    angels: '✨',
    'everyday-phrases': '💬',
    'starter-prophets': '🌿',
    'everyday-manners': '☀️',
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to home"
          onPress={goBack}
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
          <Text style={styles.headerArt} accessibilityElementsHidden>
            {iconMap[group]}
          </Text>
        </View>

        <View style={styles.intro}>
          <Text style={styles.eyebrow}>{eyebrowMap[group]}</Text>
          <Text style={styles.title}>{titleMap[group]}</Text>
          <Text style={styles.description}>{introDescMap[group]}</Text>
        </View>

        {group === 'starter-prophets' && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowDiagram((prev) => !prev)}
            style={({ pressed }) => [styles.toggleDiagramButton, pressed && styles.pressed]}
          >
            <Text style={styles.toggleDiagramText}>
              {showDiagram ? '📋 Switch to Grid View' : '🌳 View Lineage Diagram'}
            </Text>
          </Pressable>
        )}

        {group === 'starter-prophets' && showDiagram ? (
          <View style={styles.diagramCard}>
            <Text style={styles.diagramTitle}>PROPHET LINEAGE & SEQUENCE</Text>
            <Text style={styles.diagramSubtitle}>
              Connecting the 25 Prophets named in the Qur’an leading to Prophet Muhammad ﷺ.
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View style={styles.treeContainer}>
                <View style={styles.treeNode}>
                  <Text style={styles.treeBadge}>1. ADAM</Text>
                  <Text style={styles.treeSub}>First Human</Text>
                </View>

                <Text style={styles.treeLine}>│</Text>

                <View style={styles.treeNode}>
                  <Text style={styles.treeBadge}>2. IDRIS</Text>
                </View>

                <Text style={styles.treeLine}>│</Text>

                <View style={styles.treeNode}>
                  <Text style={styles.treeBadge}>3. NUH</Text>
                  <Text style={styles.treeSub}>Mesopotamia</Text>
                </View>

                <Text style={styles.treeLine}>├── [4. Hud] (&apos;Ad Tribe) &amp; [5. Saleh] (Thamud)</Text>
                <Text style={styles.treeLine}>│</Text>

                <View style={styles.treeNodeGold}>
                  <Text style={styles.treeBadgeGold}>6. IBRAHIM (Father of Prophets)</Text>
                  <Text style={styles.treeSub}>Sent to Canaan &amp; Sham</Text>
                </View>

                <Text style={styles.treeLine}>┌──────────────────────┴──────────────────────┐</Text>
                <View style={styles.branchRow}>
                  <View style={styles.branchCol}>
                    <View style={styles.treeNode}>
                      <Text style={styles.treeBadge}>8. ISMA&apos;IL</Text>
                      <Text style={styles.treeSub}>Mecca / Arabia</Text>
                    </View>
                    <Text style={styles.treeLine}>│</Text>
                    <Text style={styles.treeLine}>┆ (Lineage of Arabs)</Text>
                    <Text style={styles.treeLine}>│</Text>
                    <View style={styles.treeNodeGreen}>
                      <Text style={styles.treeBadgeGreen}>25. MUHAMMAD ﷺ</Text>
                      <Text style={styles.treeSub}>Final Seal to All Creation</Text>
                    </View>
                  </View>

                  <View style={styles.branchCol}>
                    <View style={styles.treeNode}>
                      <Text style={styles.treeBadge}>9. ISHAQ</Text>
                      <Text style={styles.treeSub}>Canaan</Text>
                    </View>
                    <Text style={styles.treeLine}>│</Text>
                    <View style={styles.treeNode}>
                      <Text style={styles.treeBadge}>10. YA&apos;QUB (Israel)</Text>
                      <Text style={styles.treeSub}>Father of 12 Tribes</Text>
                    </View>
                    <Text style={styles.treeLine}>│</Text>
                    <Text style={styles.treeLine}>
                      Yusuf • Shu&apos;ayb • Ayyub • Musa • Harun • Dawud • Sulaiman • Ilyas • Yunus • Zakariyya • Yahya
                    </Text>
                    <Text style={styles.treeLine}>│</Text>
                    <View style={styles.treeNode}>
                      <Text style={styles.treeBadge}>24. ISA (Jesus)</Text>
                      <Text style={styles.treeSub}>Last Prophet of Bani Isra&apos;il</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
          <>
            {selectedItem && (
              <Animated.View style={[styles.detailCard, { transform: [{ scale: scaleAnim }] }]}>
                {group === 'everyday-manners' && (
                  <AnimatedAdabVisual id={selectedItem.id} />
                )}

                <Text style={styles.detailArabic} accessibilityLabel={`Arabic: ${selectedItem.name}`}>
                  {selectedItem.arabic}
                </Text>
                <Text style={styles.detailName}>{selectedItem.transliteration || selectedItem.name}</Text>
                <Text style={styles.meaningLabel}>FACT / LESSON</Text>
                <Text style={styles.meaning}>{selectedItem.meaningOrFact}</Text>

                <View style={styles.audioActions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hear ${selectedItem.name} in Arabic`}
                    onPress={() => speak(selectedItem.arabic, 'ar-SA')}
                    style={({ pressed }) => [styles.audioButton, styles.arabicButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.audioIcon}>♫</Text>
                    <Text style={styles.arabicButtonText}>Hear name</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Hear description: ${selectedItem.meaningOrFact}`}
                    onPress={() => speak(selectedItem.meaningOrFact, 'en-US')}
                    style={({ pressed }) => [styles.audioButton, styles.meaningButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.audioIcon}>♫</Text>
                    <Text style={styles.meaningButtonText}>Hear meaning</Text>
                  </Pressable>
                </View>

                <Text style={styles.referenceLabel}>SOURCE REFERENCES</Text>
                {selectedItem.references.map((ref) => (
                  <Pressable
                    key={ref.url}
                    accessibilityRole="link"
                    onPress={() => openReference(ref.url)}
                    style={({ pressed }) => [styles.referenceLink, pressed && styles.pressed]}
                  >
                    <Text style={styles.referenceText}>{ref.label} ↗</Text>
                  </Pressable>
                ))}
                {sourceError && <Text style={styles.sourceError}>Could not open source link. Try again.</Text>}
              </Animated.View>
            )}

            <View style={styles.itemGrid}>
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="button"
                    accessibilityLabel={`${item.name}, ${item.meaningOrFact}`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => handleSelectItem(item.id)}
                    style={({ pressed }) => [styles.itemCard, isSelected && styles.selectedItemCard, pressed && styles.pressed]}
                  >
                    <Text style={styles.itemCardArabic}>{item.arabic}</Text>
                    <Text style={[styles.itemCardTitle, isSelected && styles.selectedItemCardTitle]}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F9F5' },
  scrollContent: { width: '100%', maxWidth: 700, alignSelf: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 },
  backButton: { minHeight: 42, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingRight: 12 },
  backArrow: { color: '#176B67', fontSize: 28, lineHeight: 32, marginRight: 5, marginTop: -3 },
  backLabel: { color: '#176B67', fontSize: 13, fontWeight: '800' },
  header: { flexDirection: 'row', alignItems: 'center' },
  brandMark: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#176B67', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  brandMarkText: { color: '#FFFFFF', fontSize: 23, fontWeight: '800' },
  brandName: { color: '#183B38', fontSize: 17, fontWeight: '800' },
  brandCaption: { color: '#71817D', fontSize: 8, fontWeight: '700', marginTop: 2 },
  headerArt: { marginLeft: 'auto', fontSize: 30 },
  intro: { marginTop: 22, marginBottom: 15, padding: 18, borderRadius: 20, backgroundColor: '#E8F1EB' },
  eyebrow: { color: '#D46C53', fontSize: 10, fontWeight: '800', marginBottom: 6 },
  title: { color: '#183B38', fontSize: 24, lineHeight: 30, fontWeight: '800' },
  description: { color: '#71817D', fontSize: 12, lineHeight: 18, marginTop: 6 },
  toggleDiagramButton: { minHeight: 44, borderRadius: 13, backgroundColor: '#176B67', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  toggleDiagramText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  diagramCard: { padding: 16, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5EAE5', marginBottom: 16 },
  diagramTitle: { color: '#D46C53', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  diagramSubtitle: { color: '#71817D', fontSize: 11, lineHeight: 16, marginTop: 4, marginBottom: 16 },
  treeContainer: { alignItems: 'center', minWidth: 520, paddingVertical: 10 },
  treeNode: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F0F5F2', borderWidth: 1, borderColor: '#D3E0D7', alignItems: 'center' },
  treeNodeGold: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#FFF7E6', borderWidth: 2, borderColor: '#FFC857', alignItems: 'center' },
  treeNodeGreen: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#E5F3EE', borderWidth: 2, borderColor: '#176B67', alignItems: 'center' },
  treeBadge: { color: '#183B38', fontSize: 12, fontWeight: '800' },
  treeBadgeGold: { color: '#9E6B00', fontSize: 13, fontWeight: '800' },
  treeBadgeGreen: { color: '#176B67', fontSize: 13, fontWeight: '800' },
  treeSub: { color: '#71817D', fontSize: 9, fontWeight: '700', marginTop: 2 },
  treeLine: { color: '#176B67', fontSize: 11, lineHeight: 18, fontWeight: '700', marginVertical: 3, textAlign: 'center' },
  branchRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginTop: 10 },
  branchCol: { width: '46%', alignItems: 'center' },
  detailCard: { padding: 18, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5EAE5', marginBottom: 16 },
  detailArabic: { color: '#183B38', fontSize: 36, lineHeight: 50, textAlign: 'center' },
  detailName: { color: '#176B67', fontSize: 18, fontWeight: '800', textAlign: 'center', marginTop: 4, marginBottom: 16 },
  meaningLabel: { color: '#D46C53', fontSize: 9, fontWeight: '800', marginBottom: 5 },
  meaning: { color: '#183B38', fontSize: 15, lineHeight: 22, fontWeight: '600' },
  audioActions: { flexDirection: 'row', marginTop: 17, columnGap: 8 },
  audioButton: { flex: 1, minHeight: 48, paddingHorizontal: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  arabicButton: { backgroundColor: '#176B67' },
  meaningButton: { backgroundColor: '#FCECC3' },
  audioIcon: { color: '#FFFFFF', fontSize: 15, marginRight: 6 },
  arabicButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  meaningButtonText: { color: '#183B38', fontSize: 11, fontWeight: '800' },
  referenceLabel: { color: '#71817D', fontSize: 9, fontWeight: '800', marginTop: 17, marginBottom: 4 },
  referenceLink: { minHeight: 32, alignSelf: 'flex-start', justifyContent: 'center', paddingRight: 8 },
  referenceText: { color: '#176B67', fontSize: 12, lineHeight: 18, textDecorationLine: 'underline' },
  sourceError: { color: '#B9443C', fontSize: 11, marginTop: 5 },
  itemGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 9, marginBottom: 17 },
  itemCard: { width: '48.5%', minHeight: 79, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: '#E5EAE5', backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' },
  selectedItemCard: { borderWidth: 2, borderColor: '#176B67', backgroundColor: '#F1F7F3' },
  itemCardArabic: { color: '#183B38', fontSize: 18, lineHeight: 25, textAlign: 'center' },
  itemCardTitle: { color: '#71817D', fontSize: 11, lineHeight: 15, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  selectedItemCardTitle: { color: '#176B67' },
  pressed: { opacity: 0.78 },
});