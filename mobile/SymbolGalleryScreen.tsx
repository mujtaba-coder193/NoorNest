import { useEffect, useState } from 'react';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import * as Speech from 'expo-speech';
import {
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COUNTRY_SYMBOLS_BY_CODE, COUNTRY_SYMBOLS_NOTICE } from './countrySymbols';
import { findCommonsPhotos, type CommonsPhoto } from './commonsMedia';

type SymbolCategory = 'animal' | 'bird' | 'fish' | 'flower';

type SymbolEntry = {
  key: string;
  category: SymbolCategory;
  symbol: string;
};

type LicensedSound = {
  audioUrl: string;
  creator: string;
  license: string;
  sourceUrl: string;
};

type SelectedSymbol = {
  entry: SymbolEntry;
  photos: CommonsPhoto[];
  photoIndex: number;
};

type SymbolGalleryScreenProps = {
  onBack: () => void;
};

const CATEGORIES: { id: SymbolCategory; label: string }[] = [
  { id: 'animal', label: 'Animals' },
  { id: 'bird', label: 'Birds' },
  { id: 'fish', label: 'Fish' },
  { id: 'flower', label: 'Flowers' },
];

const CATEGORY_EMOJI: Record<SymbolCategory, string> = {
  animal: '🐾',
  bird: '🪶',
  fish: '🐟',
  flower: '🌼',
};

const FISH_SPECIES = new Set(['blue marlin', 'flying fish', 'koi']);

const soundCache = new Map<string, Promise<LicensedSound | null>>();
const ALLOWED_SOUND_LICENSES = new Set(['cc0', 'cc-by', 'cc-by-sa']);
const PLAYABLE_SOUND_MIMES = new Set(['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/x-wav']);

function cleanSearchName(symbol: string): string {
  return symbol
    .replace(/\s*\([^)]*\)/g, '')
    .split('/')[0]
    .replace(/\b(unofficial|proposed|heraldic)\b/gi, '')
    .trim();
}

function findLicensedSound(searchName: string): Promise<LicensedSound | null> {
  const normalizedName = searchName.toLocaleLowerCase();
  const cached = soundCache.get(normalizedName);
  if (cached) return cached;

  const parameters = new URLSearchParams({
    taxon_name: searchName,
    sounds: 'true',
    quality_grade: 'research',
    per_page: '50',
    order_by: 'votes',
  });
  const request = fetch(`https://api.inaturalist.org/v1/observations?${parameters.toString()}`)
    .then((response) => response.ok ? response.json() : null)
    .then((data) => {
      const normalizedTaxonSearch = normalizedName.replace(/[^a-z0-9]+/g, ' ').trim();
      const observations = (data?.results ?? []) as {
        uri?: string;
        user?: { login?: string };
        taxon?: { name?: string; preferred_common_name?: string };
        sounds?: { file_url?: string; file_content_type?: string; license_code?: string | null }[];
      }[];

      for (const observation of observations) {
        const taxonName = observation.taxon?.preferred_common_name ?? observation.taxon?.name ?? '';
        const normalizedTaxonName = taxonName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        if (normalizedTaxonName !== normalizedTaxonSearch) continue;

        const sound = observation.sounds?.find((recording) =>
          !!recording.file_url
          && !!recording.license_code
          && ALLOWED_SOUND_LICENSES.has(recording.license_code)
          && !!recording.file_content_type
          && PLAYABLE_SOUND_MIMES.has(recording.file_content_type),
        );
        if (!sound?.file_url || !sound.license_code || !observation.uri) continue;
        return {
          audioUrl: sound.file_url,
          creator: observation.user?.login ?? 'iNaturalist contributor',
          license: sound.license_code.toUpperCase().replaceAll('-', ' '),
          sourceUrl: observation.uri,
        };
      }

      return null;
    })
    .catch(() => null);
  soundCache.set(normalizedName, request);
  return request;
}

function getUniqueEntries(): SymbolEntry[] {
  const seen = new Set<string>();
  const entries: SymbolEntry[] = [];
  const categoryOrder: SymbolCategory[] = ['bird', 'fish', 'animal', 'flower'];

  for (const category of categoryOrder) {
    for (const symbols of Object.values(COUNTRY_SYMBOLS_BY_CODE)) {
      const sourceCategory = category === 'fish' ? 'animal' : category;
      const symbol = symbols[sourceCategory];
      if (!symbol || symbol.trim().startsWith('—')) continue;
      const normalizedName = cleanSearchName(symbol).toLocaleLowerCase();
      if (category === 'fish' && !FISH_SPECIES.has(normalizedName)) continue;
      if (category === 'animal' && FISH_SPECIES.has(normalizedName)) continue;
      if (!normalizedName || seen.has(normalizedName)) continue;
      seen.add(normalizedName);
      entries.push({ key: `${category}-${normalizedName}`, category, symbol });
    }
  }

  return entries.sort((first, second) =>
    cleanSearchName(first.symbol).localeCompare(cleanSearchName(second.symbol), 'en'),
  );
}

export default function SymbolGalleryScreen({ onBack }: SymbolGalleryScreenProps) {
  const [category, setCategory] = useState<SymbolCategory>('animal');
  const [query, setQuery] = useState('');
  const [selectedSymbol, setSelectedSymbol] = useState<SelectedSymbol | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const entries = getUniqueEntries()
    .filter((entry) => entry.category === category)
    .filter((entry) => entry.symbol.toLocaleLowerCase().includes(normalizedQuery));

  const renderHeader = () => (
    <View>
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
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>DUNYA · NATURE</Text>
        <Text style={styles.title}>Animals, birds, fish & flowers</Text>
        <Text style={styles.description}>Browse distinct species and flowers, with three pictures to explore.</Text>
      </View>
      <View style={styles.categoryPicker}>
        {CATEGORIES.map((item) => {
          const isSelected = item.id === category;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  setSelectedSymbol(null);
                  setCategory(item.id);
                }}
              style={({ pressed }) => [styles.categoryTab, isSelected && styles.selectedCategoryTab, pressed && styles.pressed]}
            >
              <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <TextInput
        accessibilityLabel={`Search ${category} and countries`}
        placeholder={`Find a ${category === 'fish' ? 'fish' : category.slice(0, -1)}`}
        placeholderTextColor="#71817D"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
        style={styles.searchInput}
      />
      <Text style={styles.resultCount}>{entries.length} SYMBOLS</Text>
    </View>
  );

  return (
    <View style={styles.galleryScreen}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Home"
        onPress={onBack}
        style={({ pressed }) => [styles.galleryBackButton, pressed && styles.pressed]}
      >
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backLabel}>Back to Home</Text>
      </Pressable>
      <FlatList
        key={`gallery-${category}`}
        data={entries}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        keyExtractor={(entry) => entry.key}
        renderItem={({ item }) => (
          <SymbolCard
            entry={item}
            onOpen={(photos, photoIndex) => setSelectedSymbol({ entry: item, photos, photoIndex })}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.emptyState}>No symbols match that search.</Text>}
        ListFooterComponent={(
          <View style={styles.footer}>
            <Text style={styles.notice}>{COUNTRY_SYMBOLS_NOTICE}</Text>
            <Text style={styles.imageNotice}>Photos come from Wikimedia Commons. Tap a photo to view it and its attribution.</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />
      {selectedSymbol && (
        <SymbolDetailModal
          key={selectedSymbol.entry.key}
          entry={selectedSymbol.entry}
          photos={selectedSymbol.photos}
          initialPhotoIndex={selectedSymbol.photoIndex}
          onClose={() => setSelectedSymbol(null)}
        />
      )}
    </View>
  );
}

function SymbolCard({ entry, onOpen }: { entry: SymbolEntry; onOpen: (photos: CommonsPhoto[], index: number) => void }) {
  const searchName = cleanSearchName(entry.symbol);
  const [photoState, setPhotoState] = useState<{
    searchName: string;
    photos: CommonsPhoto[];
    loaded: boolean;
  }>({ searchName: '', photos: [], loaded: false });

  useEffect(() => {
    let mounted = true;
    findCommonsPhotos(searchName).then((result) => {
      if (!mounted) return;
      setPhotoState({ searchName, photos: result, loaded: true });
    });
    return () => {
      mounted = false;
    };
  }, [searchName]);

  const hasLoadedPhotos = photoState.searchName === searchName && photoState.loaded;
  const photos = hasLoadedPhotos ? photoState.photos : [];
  const selectedPhoto = photos[0];

  return (
    <View style={styles.symbolCard}>
      <View style={styles.symbolCopy}>
        <Text style={styles.symbolCategory}>{entry.category.toUpperCase()}</Text>
        <Text style={styles.symbolName}>{entry.symbol}</Text>
        {selectedPhoto ? (
          <View style={styles.photoGallery}>
            <Pressable accessibilityRole="button" accessibilityLabel={`View ${entry.symbol} photo`} onPress={() => onOpen(photos, 0)}>
              <Image
                accessibilityLabel={`${entry.symbol} photo: ${selectedPhoto.fileName}`}
                source={{ uri: selectedPhoto.thumbnailUrl }}
                resizeMode="cover"
                style={styles.featuredPhoto}
              />
            </Pressable>
            <View style={styles.photoChoices}>
              {photos.map((photo, index) => (
                <Pressable
                  key={photo.sourceUrl}
                  accessibilityRole="button"
                  accessibilityLabel={`Open photo ${index + 1} of ${photos.length} for ${entry.symbol}`}
                  onPress={() => onOpen(photos, index)}
                  style={({ pressed }) => [
                    styles.photoChoice,
                    pressed && styles.pressed,
                  ]}
                >
                  <Image source={{ uri: photo.thumbnailUrl }} resizeMode="cover" style={styles.choiceImage} />
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(selectedPhoto.sourceUrl)}
              style={({ pressed }) => [styles.creditLink, pressed && styles.pressed]}
            >
              <Text numberOfLines={2} style={styles.creditText}>
                {selectedPhoto.creator} · {selectedPhoto.license} ↗
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.photoFallback}>
            <Text style={styles.fallbackIcon}>{CATEGORY_EMOJI[entry.category]}</Text>
            <Text style={styles.fallbackText}>{hasLoadedPhotos ? 'No licensed Commons photos found' : 'Finding photos…'}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function SymbolDetailModal({
  entry,
  photos,
  initialPhotoIndex,
  onClose,
}: {
  entry: SymbolEntry;
  photos: CommonsPhoto[];
  initialPhotoIndex: number;
  onClose: () => void;
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(initialPhotoIndex);
  const [soundState, setSoundState] = useState<{ loading: boolean; sound: LicensedSound | null }>(
    { loading: entry.category !== 'flower', sound: null },
  );
  const player = useAudioPlayer();
  const playerStatus = useAudioPlayerStatus(player);
  const soundSearchName = cleanSearchName(entry.symbol);
  const selectedPhoto = photos[selectedPhotoIndex] ?? photos[0];

  useEffect(() => {
    if (entry.category === 'flower') return undefined;
    let mounted = true;
    findLicensedSound(soundSearchName).then((sound) => {
      if (mounted) setSoundState({ loading: false, sound });
    });
    return () => {
      mounted = false;
    };
  }, [entry.category, soundSearchName]);

  useEffect(() => {
    if (soundState.sound) player.replace(soundState.sound.audioUrl);
    return () => player.pause();
  }, [player, soundState.sound]);

  const closeModal = () => {
    player.pause();
    onClose();
  };

  const toggleSound = () => {
    if (playerStatus.playing) {
      player.pause();
      return;
    }
    if (playerStatus.didJustFinish) player.seekTo(0);
    player.play();
  };

  return (
    <Modal
      visible
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.modalSafeArea}>
        <View style={styles.modalHeader}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back to gallery"
            onPress={closeModal}
            style={({ pressed }) => [styles.modalBackButton, pressed && styles.pressed]}
          >
            <Text style={styles.modalBackArrow}>‹</Text>
            <Text style={styles.modalBackLabel}>Back to gallery</Text>
          </Pressable>
          <Text style={styles.modalEyebrow}>{entry.category.toUpperCase()}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.modalTitle}>{entry.symbol}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Hear pronunciation of ${cleanSearchName(entry.symbol)}`}
            onPress={() => {
              player.pause();
              Speech.stop();
              Speech.speak(cleanSearchName(entry.symbol), { language: 'en-US', rate: 0.78, pitch: 1 });
            }}
            style={({ pressed }) => [styles.pronounceButton, pressed && styles.pressed]}
          >
            <Text style={styles.pronounceIcon}>♫</Text>
            <Text style={styles.pronounceText}>Hear name</Text>
          </Pressable>
          {selectedPhoto && (
            <Image
              accessibilityLabel={`${entry.symbol} photo: ${selectedPhoto.fileName}`}
              source={{ uri: selectedPhoto.thumbnailUrl }}
              resizeMode="cover"
              style={styles.modalPhoto}
            />
          )}
          <View style={styles.modalPhotoChoices}>
            {photos.map((photo, index) => (
              <Pressable
                key={photo.sourceUrl}
                accessibilityRole="button"
                accessibilityLabel={`View photo ${index + 1} of ${photos.length}`}
                accessibilityState={{ selected: index === selectedPhotoIndex }}
                onPress={() => setSelectedPhotoIndex(index)}
                style={({ pressed }) => [
                  styles.modalPhotoChoice,
                  index === selectedPhotoIndex && styles.selectedModalPhotoChoice,
                  pressed && styles.pressed,
                ]}
              >
                <Image source={{ uri: photo.thumbnailUrl }} resizeMode="cover" style={styles.modalChoiceImage} />
              </Pressable>
            ))}
          </View>
          {selectedPhoto && (
            <Pressable
              accessibilityRole="link"
              onPress={() => Linking.openURL(selectedPhoto.sourceUrl)}
              style={({ pressed }) => [styles.modalSourceLink, pressed && styles.pressed]}
            >
              <Text style={styles.modalSourceText}>
                Photo: {selectedPhoto.creator} · {selectedPhoto.license} · Wikimedia Commons ↗
              </Text>
            </Pressable>
          )}

          {entry.category === 'flower' ? (
            <Text style={styles.soundUnavailable}>Flowers do not have animal sound recordings.</Text>
          ) : (
            <View style={styles.soundPanel}>
              <Text style={styles.soundPanelTitle}>Animal sound</Text>
              {soundState.loading ? (
                <Text style={styles.soundMessage}>Finding an openly licensed recording…</Text>
              ) : soundState.sound ? (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={playerStatus.playing ? 'Pause animal sound' : 'Play animal sound'}
                    onPress={toggleSound}
                    style={({ pressed }) => [styles.soundButton, pressed && styles.pressed]}
                  >
                    <Text style={styles.soundButtonIcon}>{playerStatus.playing ? 'Ⅱ' : '▶'}</Text>
                    <Text style={styles.soundButtonText}>
                      {playerStatus.playing ? 'Pause sound' : 'Play sound'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="link"
                    onPress={() => Linking.openURL(soundState.sound!.sourceUrl)}
                    style={({ pressed }) => [styles.modalSourceLink, pressed && styles.pressed]}
                  >
                    <Text style={styles.modalSourceText}>
                      Recording: {soundState.sound.creator} · {soundState.sound.license} · iNaturalist ↗
                    </Text>
                  </Pressable>
                </>
              ) : (
                <Text style={styles.soundMessage}>No matching openly licensed recording was found.</Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  galleryScreen: {
    flex: 1,
    backgroundColor: '#F7F9F5',
  },
  galleryBackButton: {
    minHeight: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE5',
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: '#F7F9F5',
  },
  modalHeader: {
    minHeight: 58,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE5',
  },
  modalBackButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  modalBackArrow: {
    color: '#176B67',
    fontSize: 28,
    lineHeight: 32,
    marginRight: 5,
    marginTop: -3,
  },
  modalBackLabel: {
    color: '#176B67',
    fontSize: 13,
    fontWeight: '800',
  },
  modalEyebrow: {
    color: '#D46C53',
    fontSize: 11,
    fontWeight: '800',
  },
  modalCloseButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  modalCloseText: {
    color: '#183B38',
    fontSize: 26,
    lineHeight: 30,
    marginTop: -2,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 36,
  },
  modalTitle: {
    color: '#183B38',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    marginBottom: 16,
  },
  pronounceButton: {
    minHeight: 44,
    alignSelf: 'flex-start',
    paddingHorizontal: 13,
    borderRadius: 12,
    backgroundColor: '#E5F1EC',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pronounceIcon: {
    color: '#176B67',
    fontSize: 16,
    marginRight: 8,
  },
  pronounceText: {
    color: '#176B67',
    fontSize: 13,
    fontWeight: '800',
  },
  modalPhoto: {
    width: '100%',
    aspectRatio: 1.15,
    borderRadius: 20,
    backgroundColor: '#E9EFEB',
  },
  modalPhotoChoices: {
    flexDirection: 'row',
    marginTop: 12,
  },
  modalPhotoChoice: {
    width: 58,
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  selectedModalPhotoChoice: {
    borderColor: '#176B67',
  },
  modalChoiceImage: {
    width: '100%',
    height: '100%',
  },
  modalSourceLink: {
    minHeight: 40,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  modalSourceText: {
    color: '#176B67',
    fontSize: 11,
    lineHeight: 16,
    textDecorationLine: 'underline',
  },
  soundPanel: {
    marginTop: 22,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  soundPanelTitle: {
    color: '#183B38',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  soundButton: {
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#176B67',
    flexDirection: 'row',
    alignItems: 'center',
  },
  soundButtonIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginRight: 12,
  },
  soundButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  soundMessage: {
    color: '#71817D',
    fontSize: 12,
    lineHeight: 18,
  },
  soundUnavailable: {
    color: '#71817D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 22,
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
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
  intro: {
    marginTop: 28,
    marginBottom: 16,
  },
  eyebrow: {
    color: '#D46C53',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 7,
  },
  title: {
    color: '#183B38',
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  description: {
    color: '#71817D',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  categoryPicker: {
    flexDirection: 'row',
    borderRadius: 14,
    backgroundColor: '#E9EFEB',
    padding: 4,
    marginBottom: 12,
  },
  categoryTab: {
    flex: 1,
    minHeight: 42,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  selectedCategoryTab: {
    backgroundColor: '#176B67',
  },
  categoryText: {
    color: '#35534F',
    fontSize: 12,
    fontWeight: '700',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  searchInput: {
    minHeight: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    borderRadius: 13,
    color: '#183B38',
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  resultCount: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
  },
  symbolCard: {
    width: '48.5%',
    minHeight: 276,
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  symbolCategory: {
    color: '#D46C53',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 4,
  },
  photoGallery: {
    marginTop: 10,
  },
  featuredPhoto: {
    width: '100%',
    height: 126,
    borderRadius: 11,
    backgroundColor: '#E9EFEB',
  },
  photoChoices: {
    flexDirection: 'row',
    marginTop: 7,
  },
  photoChoice: {
    width: 38,
    height: 34,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 7,
  },
  selectedPhotoChoice: {
    borderColor: '#176B67',
  },
  choiceImage: {
    width: '100%',
    height: '100%',
  },
  photoFallback: {
    height: 166,
    borderRadius: 11,
    backgroundColor: '#E9EFEB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  fallbackIcon: {
    fontSize: 28,
  },
  fallbackText: {
    color: '#71817D',
    fontSize: 9,
    textAlign: 'center',
    marginTop: 4,
  },
  symbolCopy: {
    minWidth: 0,
    flex: 1,
  },
  symbolName: {
    color: '#183B38',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  creditLink: {
    alignSelf: 'flex-start',
    minHeight: 32,
    justifyContent: 'center',
    marginTop: 5,
  },
  creditText: {
    color: '#176B67',
    fontSize: 9,
    lineHeight: 13,
    textDecorationLine: 'underline',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E3EAE5',
    paddingTop: 16,
    marginTop: 12,
  },
  notice: {
    color: '#5D6256',
    fontSize: 10,
    lineHeight: 15,
  },
  imageNotice: {
    color: '#71817D',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  emptyState: {
    color: '#71817D',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  pressed: {
    opacity: 0.78,
  },
});
