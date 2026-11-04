import { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import {
  FlatList,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { findCommonsPhotos, type CommonsPhoto } from './commonsMedia';
import { FOOD_FACTS_SOURCE, FOOD_SAFETY_NOTE, FOODS, type FoodCategory, type FoodItem } from './foodContent';

type FoodGalleryScreenProps = {
  onBack: () => void;
};

const CATEGORIES: { id: FoodCategory; label: string }[] = [
  { id: 'fruit', label: 'Fruits' },
  { id: 'vegetable', label: 'Vegetables' },
];

export default function FoodGalleryScreen({ onBack }: FoodGalleryScreenProps) {
  const [category, setCategory] = useState<FoodCategory>('fruit');
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const foods = FOODS.filter((food) => food.category === category)
    .filter((food) => food.name.toLocaleLowerCase().includes(normalizedQuery))
    .sort((first, second) => first.name.localeCompare(second.name, 'en'));

  const renderHeader = () => (
    <View>
      <View style={styles.brandHeader}>
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
        <Text style={styles.eyebrow}>DUNYA · FOOD</Text>
        <Text style={styles.title}>Fruits & vegetables</Text>
        <Text style={styles.description}>Simple names, pictures and little food facts to share.</Text>
      </View>
      <View style={styles.categoryPicker}>
        {CATEGORIES.map((item) => {
          const isSelected = item.id === category;
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setCategory(item.id)}
              style={({ pressed }) => [styles.categoryTab, isSelected && styles.selectedCategoryTab, pressed && styles.pressed]}
            >
              <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <TextInput
        accessibilityLabel={`Search ${category} by name`}
        placeholder={`Find ${category === 'fruit' ? 'a fruit' : 'a vegetable'}`}
        placeholderTextColor="#71817D"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        returnKeyType="search"
        style={styles.searchInput}
      />
      <Text style={styles.resultCount}>{foods.length} {category === 'fruit' ? 'FRUITS' : 'VEGETABLES'}</Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back to Home"
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backLabel}>Back to Home</Text>
      </Pressable>
      <FlatList
        key={`foods-${category}`}
        data={foods}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        keyExtractor={(food) => food.id}
        renderItem={({ item }) => <FoodCard food={item} />}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={<Text style={styles.emptyState}>No foods match that search.</Text>}
        ListFooterComponent={(
          <View style={styles.footer}>
            <Pressable accessibilityRole="link" onPress={() => Linking.openURL('https://fdc.nal.usda.gov/')}>
              <Text style={styles.factSource}>{FOOD_FACTS_SOURCE} ↗</Text>
            </Pressable>
            <Text style={styles.safetyNote}>{FOOD_SAFETY_NOTE}</Text>
            <Text style={styles.photoNote}>Photos from Wikimedia Commons; each photo links to its creator and license.</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

function FoodCard({ food }: { food: FoodItem }) {
  const [photoState, setPhotoState] = useState<{ searchName: string; photo: CommonsPhoto | null; loaded: boolean }>(
    { searchName: '', photo: null, loaded: false },
  );

  useEffect(() => {
    let mounted = true;
    findCommonsPhotos(food.imageSearch, 1).then((photos) => {
      if (mounted) {
        setPhotoState({ searchName: food.imageSearch, photo: photos[0] ?? null, loaded: true });
      }
    });
    return () => {
      mounted = false;
    };
  }, [food.imageSearch]);

  const hasLoaded = photoState.searchName === food.imageSearch && photoState.loaded;
  const photo = hasLoaded ? photoState.photo : null;

  const speakName = () => {
    Speech.stop();
    Speech.speak(food.name, { language: 'en-US', rate: 0.78, pitch: 1 });
  };

  return (
    <View style={styles.foodCard}>
      {photo ? (
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(photo.sourceUrl)}>
          <Image source={{ uri: photo.thumbnailUrl }} resizeMode="cover" style={styles.foodPhoto} accessibilityLabel={food.name} />
        </Pressable>
      ) : (
        <View style={styles.foodPhotoFallback}>
          <Text style={styles.fallbackEmoji}>{food.category === 'fruit' ? '🍎' : '🥕'}</Text>
          <Text style={styles.fallbackText}>{hasLoaded ? 'Photo unavailable' : 'Finding photo…'}</Text>
        </View>
      )}
      {photo && (
        <Pressable accessibilityRole="link" onPress={() => Linking.openURL(photo.sourceUrl)} style={styles.photoCredit}>
          <Text numberOfLines={1} style={styles.photoCreditText}>{photo.creator} · {photo.license} ↗</Text>
        </Pressable>
      )}
      <Text style={styles.foodName}>{food.name}</Text>
      <Text style={styles.foodFact}>{food.fact}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Hear the name ${food.name}`}
        onPress={speakName}
        style={({ pressed }) => [styles.hearButton, pressed && styles.pressed]}
      >
        <Text style={styles.hearIcon}>♫</Text>
        <Text style={styles.hearText}>Hear name</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9F5',
  },
  backButton: {
    minHeight: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE5',
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
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 32,
  },
  brandHeader: {
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
    marginTop: 24,
    marginBottom: 16,
  },
  eyebrow: {
    color: '#D46C53',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 6,
  },
  title: {
    color: '#183B38',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  description: {
    color: '#71817D',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
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
    paddingHorizontal: 6,
  },
  selectedCategoryTab: {
    backgroundColor: '#176B67',
  },
  categoryText: {
    color: '#35534F',
    fontSize: 13,
    fontWeight: '700',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  searchInput: {
    minHeight: 46,
    paddingHorizontal: 13,
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
    marginTop: 15,
    marginBottom: 8,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  foodCard: {
    width: '48.5%',
    minHeight: 278,
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
  },
  foodPhoto: {
    width: '100%',
    height: 126,
    borderRadius: 11,
    backgroundColor: '#E9EFEB',
  },
  foodPhotoFallback: {
    height: 126,
    borderRadius: 11,
    backgroundColor: '#E9EFEB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackEmoji: {
    fontSize: 34,
  },
  fallbackText: {
    color: '#71817D',
    fontSize: 9,
    marginTop: 4,
  },
  photoCredit: {
    minHeight: 24,
    justifyContent: 'center',
  },
  photoCreditText: {
    color: '#176B67',
    fontSize: 8,
    lineHeight: 12,
    textDecorationLine: 'underline',
  },
  foodName: {
    color: '#183B38',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  foodFact: {
    color: '#5D6256',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
    flexGrow: 1,
  },
  hearButton: {
    minHeight: 38,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    borderRadius: 11,
    backgroundColor: '#E5F1EC',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },
  hearIcon: {
    color: '#176B67',
    fontSize: 14,
    marginRight: 6,
  },
  hearText: {
    color: '#176B67',
    fontSize: 11,
    fontWeight: '800',
  },
  footer: {
    marginTop: 14,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E3EAE5',
  },
  factSource: {
    color: '#176B67',
    fontSize: 10,
    textDecorationLine: 'underline',
  },
  safetyNote: {
    color: '#5D6256',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  photoNote: {
    color: '#71817D',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  emptyState: {
    color: '#71817D',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 28,
  },
  pressed: {
    opacity: 0.78,
  },
});
