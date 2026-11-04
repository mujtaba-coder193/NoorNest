import worldCountries, { type Country as SourceCountry } from 'world-countries';

export type CountryProfile = {
  code: string;
  name: string;
  officialName: string;
  flag: string;
  capitals: string[];
  region: string;
  languages: string[];
  currencies: string[];
};

const OBSERVER_STATE_CODES = new Set(['PSE']);

export const COUNTRIES: CountryProfile[] = worldCountries
  .filter((country: SourceCountry) => country.independent || OBSERVER_STATE_CODES.has(country.cca3))
  .map((country: SourceCountry) => ({
    code: country.cca3,
    name: country.name.common,
    officialName: country.name.official,
    flag: country.flag,
    capitals: country.capital,
    region: country.region,
    languages: Object.values(country.languages),
    currencies: Object.entries(country.currencies).map(
      ([code, currency]) => `${currency.name} (${code})`,
    ),
  }))
  .sort((first, second) => first.name.localeCompare(second.name, 'en'));

export const COUNTRY_DATA_ATTRIBUTION = 'world-countries by M. Le Doze, ODbL-1.0';
