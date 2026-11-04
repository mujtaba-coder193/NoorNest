import { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { COUNTRY_SYMBOLS_BY_CODE, COUNTRY_SYMBOLS_NOTICE } from './countrySymbols';
import { COUNTRIES, COUNTRY_DATA_ATTRIBUTION, type CountryProfile } from './countries';

type CountriesScreenProps = {
  onBack: () => void;
};

const ALPHABET_FILTERS = ['All', ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index))];

export default function CountriesScreen({ onBack }: CountriesScreenProps) {
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('All');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const isWide = width >= 720;
  const selectedCountry = COUNTRIES.find((country) => country.code === selectedCountryCode);
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleCountries = COUNTRIES.filter((country) => {
    const matchesLetter = activeLetter === 'All' || country.name.toUpperCase().startsWith(activeLetter);
    const searchText = `${country.name} ${country.officialName} ${country.capitals.join(' ')}`.toLocaleLowerCase();
    return matchesLetter && searchText.includes(normalizedQuery);
  });

  const renderHeader = (backLabel: string, onPress: () => void) => (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        onPress={onPress}
        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
      >
        <Text style={styles.backArrow}>‹</Text>
        <Text style={styles.backLabel}>{backLabel}</Text>
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
    </>
  );

  const renderFact = (label: string, value: string) => (
    <View key={label} style={styles.factCard}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value || 'Not listed'}</Text>
    </View>
  );

  if (selectedCountry) {
    const capital = selectedCountry.capitals.join(', ') || 'No capital listed';
    const symbols = COUNTRY_SYMBOLS_BY_CODE[selectedCountry.code];
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.content, isWide && styles.contentWide]}>
          {renderHeader('Back to countries', () => setSelectedCountryCode(null))}

          <View style={styles.detailIntro}>
            <Text style={styles.eyebrow}>COUNTRY EXPLORER</Text>
            <Text style={styles.detailTitle}>{selectedCountry.name}</Text>
            {selectedCountry.officialName !== selectedCountry.name && (
              <Text style={styles.officialName}>{selectedCountry.officialName}</Text>
            )}
          </View>

          <View style={[styles.countryHero, isWide && styles.countryHeroWide]}>
            <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
            <View style={styles.capitalBlock}>
              <Text style={styles.factLabel}>CAPITAL</Text>
              <Text style={styles.capitalValue}>{capital}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Quick country facts</Text>
          <View style={styles.factsGrid}>
            {renderFact('Region', selectedCountry.region)}
            {renderFact('Official languages', selectedCountry.languages.join(', '))}
            {renderFact('Currency', selectedCountry.currencies.join(', '))}
          </View>

          <Text style={[styles.sectionTitle, styles.symbolSectionTitle]}>National symbols & sport</Text>
          <View style={styles.factsGrid}>
            {renderFact('National animal', symbols.animal ?? 'Not listed')}
            {renderFact('National bird', symbols.bird ?? 'Not listed')}
            {renderFact('National flower', symbols.flower ?? 'Not listed')}
            {renderFact('National sport', symbols.sport ?? 'Not listed')}
          </View>

          <View style={styles.symbolsNote}>
            <Text style={styles.symbolsTitle}>About these facts</Text>
            <Text style={styles.symbolsDescription}>
              {COUNTRY_SYMBOLS_NOTICE} Images will be added in a later story.
            </Text>
          </View>
          <Text style={styles.dataAttribution}>{COUNTRY_DATA_ATTRIBUTION}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={[styles.content, isWide && styles.contentWide]}>
        {renderHeader('Back to Home', onBack)}

        <View style={styles.detailIntro}>
          <Text style={styles.eyebrow}>DUNYA · COUNTRIES</Text>
          <Text style={styles.detailTitle}>Explore our world</Text>
          <Text style={styles.introDescription}>Flags, capitals and little country facts.</Text>
        </View>

        <TextInput
          accessibilityLabel="Search countries or capitals"
          placeholder="Find a country or capital"
          placeholderTextColor="#71817D"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
          style={styles.searchInput}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.alphabetFilters}
        >
          {ALPHABET_FILTERS.map((letter) => {
            const isSelected = letter === activeLetter;
            return (
              <Pressable
                key={letter}
                accessibilityRole="button"
                accessibilityLabel={letter === 'All' ? 'Show all countries' : `Countries starting with ${letter}`}
                accessibilityState={{ selected: isSelected }}
                onPress={() => setActiveLetter(letter)}
                style={({ pressed }) => [
                  styles.letterFilter,
                  letter === 'All' && styles.allFilter,
                  isSelected && styles.selectedLetterFilter,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.letterFilterText, isSelected && styles.selectedLetterFilterText]}>
                  {letter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.resultCount}>{visibleCountries.length} COUNTRIES</Text>
        <View style={styles.countryList}>
          {visibleCountries.map((country) => (
            <CountryRow
              key={country.code}
              country={country}
              onPress={() => setSelectedCountryCode(country.code)}
            />
          ))}
        </View>
        {visibleCountries.length === 0 && (
          <Text style={styles.emptyState}>No countries match that search.</Text>
        )}

        <Pressable
          accessibilityRole="link"
          onPress={() => Linking.openURL('https://github.com/mledoze/countries')}
          style={styles.dataSourceLink}
        >
          <Text style={styles.dataAttribution}>{COUNTRY_DATA_ATTRIBUTION} · View source ↗</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function CountryRow({ country, onPress }: { country: CountryProfile; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${country.name}, capital ${country.capitals.join(', ') || 'not listed'}`}
      onPress={onPress}
      style={({ pressed }) => [styles.countryRow, pressed && styles.pressed]}
    >
      <View style={styles.rowFlagWell}>
        <Text style={styles.rowFlag}>{country.flag}</Text>
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowCountryName}>{country.name}</Text>
        <Text style={styles.rowCapital}>Capital · {country.capitals.join(', ') || 'Not listed'}</Text>
      </View>
      <Text style={styles.rowArrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  content: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
  },
  contentWide: {
    maxWidth: 960,
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
  detailIntro: {
    marginTop: 28,
    marginBottom: 18,
  },
  eyebrow: {
    color: '#D46C53',
    fontSize: 11,
    fontWeight: '800',
    marginBottom: 7,
  },
  detailTitle: {
    color: '#183B38',
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
  },
  officialName: {
    color: '#71817D',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  introDescription: {
    color: '#71817D',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
  },
  searchInput: {
    minHeight: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDE5DE',
    borderRadius: 14,
    color: '#183B38',
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  alphabetFilters: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingRight: 20,
  },
  letterFilter: {
    width: 40,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },
  allFilter: {
    width: 54,
  },
  selectedLetterFilter: {
    backgroundColor: '#176B67',
    borderColor: '#176B67',
  },
  letterFilterText: {
    color: '#35534F',
    fontSize: 13,
    fontWeight: '800',
  },
  selectedLetterFilterText: {
    color: '#FFFFFF',
  },
  resultCount: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 8,
  },
  countryList: {
    borderTopWidth: 1,
    borderTopColor: '#E3EAE5',
  },
  countryRow: {
    minHeight: 76,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#E3EAE5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFlagWell: {
    width: 52,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  rowFlag: {
    fontSize: 27,
  },
  rowCopy: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  rowCountryName: {
    color: '#183B38',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
  },
  rowCapital: {
    color: '#71817D',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 2,
  },
  rowArrow: {
    color: '#176B67',
    fontSize: 24,
    marginLeft: 8,
  },
  countryHero: {
    minHeight: 176,
    borderRadius: 22,
    padding: 22,
    backgroundColor: '#DDF0E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  countryHeroWide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 36,
  },
  countryFlag: {
    fontSize: 76,
    lineHeight: 92,
  },
  capitalBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  factLabel: {
    color: '#71817D',
    fontSize: 9,
    fontWeight: '800',
  },
  capitalValue: {
    color: '#183B38',
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#183B38',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    marginBottom: 12,
  },
  symbolSectionTitle: {
    marginTop: 24,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  factCard: {
    width: '48.8%',
    minHeight: 94,
    padding: 13,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8ECE7',
  },
  factValue: {
    color: '#183B38',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  symbolsNote: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#FCECC3',
  },
  symbolsTitle: {
    color: '#183B38',
    fontSize: 14,
    fontWeight: '800',
  },
  symbolsDescription: {
    color: '#5D6256',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  emptyState: {
    color: '#71817D',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 32,
  },
  dataSourceLink: {
    alignSelf: 'flex-start',
    marginTop: 18,
    minHeight: 40,
    justifyContent: 'center',
  },
  dataAttribution: {
    color: '#71817D',
    fontSize: 10,
    lineHeight: 15,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.78,
  },
});
