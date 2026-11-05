import { useState } from 'react';
import * as Speech from 'expo-speech';
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ALLAH_NAMES, PROPHET_NAMES } from './deenContent';

type NameGroup = 'allah' | 'prophet';
type NameEntry = (typeof ALLAH_NAMES)[number] | (typeof PROPHET_NAMES)[number];

type BeautifulNamesScreenProps = {
  readonly group: NameGroup;
  readonly onBack: () => void;
};

export default function BeautifulNamesScreen({ group, onBack }: BeautifulNamesScreenProps) {
  const names: readonly NameEntry[] = group === 'allah' ? ALLAH_NAMES : PROPHET_NAMES;
  const [selectedId, setSelectedId] = useState(names[0].id);
  const [sourceError, setSourceError] = useState(false);
  const [query, setQuery] = useState('');
  const selectedName = names.find((name) => name.id === selectedId) ?? names[0];
  const isAllahName = group === 'allah';
  const filteredNames = names.filter((name) =>
    `${name.name} ${name.arabic} ${name.meaning}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );

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
          <View style={styles.brandMark}><Text style={styles.brandMarkText}>N</Text></View>
          <View>
            <Text style={styles.brandName}>NoorNest</Text>
            <Text style={styles.brandCaption}>GROWING IN FAITH & WONDER</Text>
          </View>
          <Text style={styles.headerArt} accessibilityElementsHidden>{isAllahName ? '✨' : '🌙'}</Text>
        </View>

        <View style={[styles.intro, !isAllahName && styles.prophetIntro]}>
          <Text style={styles.eyebrow}>LITTLE MOMENTS OF DEEN</Text>
          <Text style={styles.title}>{isAllahName ? 'Beautiful names of Allah' : 'Names of Prophet Muhammad ﷺ'}</Text>
          <Text style={styles.description}>
            {isAllahName ? 'Explore a commonly taught collection of 99 names.' : 'Learn the names mentioned by the Prophet ﷺ.'}
          </Text>
        </View>

        {isAllahName && (
          <View style={styles.listNote}>
            <Text style={styles.listNoteText}>
              Allah’s names are not limited to 99, and scholars differ on the exact list counted. This is one commonly taught compilation.
            </Text>
            <View style={styles.sourceRow}>
              <Pressable onPress={() => openReference('https://quran.com/7/180')} style={({ pressed }) => pressed && styles.pressed}>
                <Text style={styles.sourceLink}>Qur’an 7:180 ↗</Text>
              </Pressable>
              <Pressable onPress={() => openReference('https://sunnah.com/bukhari:2736')} style={({ pressed }) => pressed && styles.pressed}>
                <Text style={styles.sourceLink}>Sahih al-Bukhari 2736 ↗</Text>
              </Pressable>
              <Pressable onPress={() => openReference('https://islamqa.info/en/answers/41003')} style={({ pressed }) => pressed && styles.pressed}>
                <Text style={styles.sourceLink}>About the list ↗</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.detailCard}>
          <Text style={styles.detailArabic} accessibilityLabel={`Arabic: ${selectedName.name}`}>
            {selectedName.arabic}
          </Text>
          <Text style={styles.detailName}>{selectedName.name}{!isAllahName && selectedName.id === 'muhammad' ? ' ﷺ' : ''}</Text>
          <Text style={styles.meaningLabel}>MEANING</Text>
          <Text style={styles.meaning}>{selectedName.meaning}</Text>

          <View style={styles.audioActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Hear ${selectedName.name} in Arabic`}
              onPress={() => speak(selectedName.arabic, 'ar-SA')}
              style={({ pressed }) => [styles.audioButton, styles.arabicButton, pressed && styles.pressed]}
            >
              <Text style={styles.audioIcon}>♫</Text>
              <Text style={styles.arabicButtonText}>Hear name</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Hear the meaning: ${selectedName.meaning}`}
              onPress={() => speak(selectedName.meaning, 'en-US')}
              style={({ pressed }) => [styles.audioButton, styles.meaningButton, pressed && styles.pressed]}
            >
              <Text style={styles.audioIcon}>♫</Text>
              <Text style={styles.meaningButtonText}>Hear meaning</Text>
            </Pressable>
          </View>

          <Text style={styles.referenceLabel}>{isAllahName ? 'LIST SOURCE' : 'REFERENCE'}</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => openReference(selectedName.url)}
            style={({ pressed }) => [styles.referenceLink, pressed && styles.pressed]}
          >
            <Text style={styles.referenceText}>{selectedName.reference} ↗</Text>
          </Pressable>
          {!isAllahName && 'additionalUrl' in selectedName && (
            <Pressable
              accessibilityRole="link"
              onPress={() => openReference(selectedName.additionalUrl)}
              style={({ pressed }) => [styles.referenceLink, pressed && styles.pressed]}
            >
              <Text style={styles.referenceText}>{selectedName.additionalReference} ↗</Text>
            </Pressable>
          )}
          {sourceError && <Text style={styles.sourceError}>Could not open the source. Please try again.</Text>}
        </View>

        {isAllahName && (
          <TextInput
            accessibilityLabel="Search Allah’s names"
            placeholder="Find a name or meaning"
            placeholderTextColor="#71817D"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            returnKeyType="search"
            style={styles.searchInput}
          />
        )}

        <View style={styles.nameGrid}>
          {filteredNames.map((name) => {
            const isSelected = selectedName.id === name.id;
            return (
              <Pressable
                key={name.id}
                accessibilityRole="button"
                accessibilityLabel={`${name.name}, ${name.meaning}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => setSelectedId(name.id)}
                style={({ pressed }) => [styles.nameCard, isSelected && styles.selectedNameCard, pressed && styles.pressed]}
              >
                {'number' in name && <Text style={styles.nameNumber}>{name.number}</Text>}
                <Text style={styles.nameCardArabic}>{name.arabic}</Text>
                <Text style={[styles.nameCardTitle, isSelected && styles.selectedNameCardTitle]}>{name.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {!isAllahName && (
          <Text style={styles.note}>The Prophet’s names and descriptions here are from the cited hadith.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9F5',
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
    fontSize: 30,
  },
  intro: {
    marginTop: 22,
    marginBottom: 17,
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#E8F1EB',
  },
  prophetIntro: {
    backgroundColor: '#E7EDF5',
  },
  listNote: {
    padding: 13,
    borderRadius: 13,
    backgroundColor: '#FCECC3',
    marginBottom: 15,
  },
  listNoteText: {
    color: '#5D6256',
    fontSize: 11,
    lineHeight: 16,
  },
  sourceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 13,
    rowGap: 5,
    marginTop: 7,
  },
  sourceLink: {
    color: '#176B67',
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  eyebrow: {
    color: '#D46C53',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#183B38',
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
  },
  description: {
    color: '#71817D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  nameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 9,
    marginBottom: 17,
  },
  nameNumber: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '700',
    position: 'absolute',
    top: 6,
    left: 8,
  },
  nameCard: {
    width: '48.5%',
    minHeight: 79,
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5EAE5',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedNameCard: {
    borderWidth: 2,
    borderColor: '#176B67',
    backgroundColor: '#F1F7F3',
  },
  nameCardArabic: {
    color: '#183B38',
    fontSize: 19,
    lineHeight: 27,
    textAlign: 'center',
  },
  nameCardTitle: {
    color: '#71817D',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  searchInput: {
    minHeight: 46,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    borderRadius: 12,
    color: '#183B38',
    backgroundColor: '#FFFFFF',
    fontSize: 13,
    marginBottom: 12,
  },
  selectedNameCardTitle: {
    color: '#176B67',
  },
  detailCard: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  detailArabic: {
    color: '#183B38',
    fontSize: 40,
    lineHeight: 56,
    textAlign: 'center',
  },
  detailName: {
    color: '#176B67',
    fontSize: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 3,
    marginBottom: 17,
  },
  meaningLabel: {
    color: '#D46C53',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 5,
  },
  meaning: {
    color: '#183B38',
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
  },
  audioActions: {
    flexDirection: 'row',
    marginTop: 17,
    columnGap: 8,
  },
  audioButton: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicButton: {
    backgroundColor: '#176B67',
  },
  meaningButton: {
    backgroundColor: '#FCECC3',
  },
  audioIcon: {
    color: '#FFFFFF',
    fontSize: 15,
    marginRight: 6,
  },
  arabicButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  meaningButtonText: {
    color: '#183B38',
    fontSize: 11,
    fontWeight: '800',
  },
  referenceLabel: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 17,
    marginBottom: 4,
  },
  referenceLink: {
    minHeight: 32,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingRight: 8,
  },
  referenceText: {
    color: '#176B67',
    fontSize: 12,
    lineHeight: 18,
    textDecorationLine: 'underline',
  },
  sourceError: {
    color: '#B9443C',
    fontSize: 11,
    marginTop: 5,
  },
  note: {
    color: '#71817D',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 12,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});