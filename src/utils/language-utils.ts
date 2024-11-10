import { SUPPORTED_LANGUAGES } from "./constants";

interface LanguageCountryMap {
  [key: string]: string;
}

type Language = {
  value: string;
  label: string;
};

type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const COUNTRY_LANGUAGE_MAP: LanguageCountryMap = {
  'ZA': 'Afrikaans',  // South Africa
  'CN': 'Chinese',    // China
  'DK': 'Danish',     // Denmark
  'NL': 'Dutch',      // Netherlands
  'FR': 'French',     // France
  'DE': 'German',     // Germany
  'IN': 'Hindi',      // India
  'ID': 'Indonesian', // Indonesia
  'IT': 'Italian',    // Italy
  'JP': 'Japanese',   // Japan
  'MY': 'Malay',      // Malaysia
  'NO': 'Norwegian',  // Norway
  'PL': 'Polish',     // Poland
  'PT': 'Portuguese', // Portugal
  'RO': 'Romanian',   // Romania
  'RU': 'Russian',    // Russia
  'ES': 'Spanish',    // Spain
  'SE': 'Swedish',    // Sweden
  'PH': 'Tagalog',    // Philippines
  'TR': 'Turkish',    // Turkey
  'UA': 'Ukrainian',  // Ukraine
  'VN': 'Vietnamese', // Vietnam
};

export function getOrderedLanguages(countryCode: string): SupportedLanguage[] {
  // Find the auto-detect option and English
  const autoDetect = SUPPORTED_LANGUAGES.find(lang => lang.value === 'auto')!;
  const english = SUPPORTED_LANGUAGES.find(lang => lang.value === 'English')!;
  
  // Get the preferred language based on country code
  const preferredLanguage = COUNTRY_LANGUAGE_MAP[countryCode];
  
  // Filter out auto-detect, English, and preferred language
  const otherLanguages = SUPPORTED_LANGUAGES.filter(lang => 
    lang.value !== 'auto' && 
    lang.value !== preferredLanguage &&
    lang.value !== 'English'
  );

  let orderedLanguages: SupportedLanguage[] = [];

  if (preferredLanguage) {
    const preferredLang = SUPPORTED_LANGUAGES.find(
      lang => lang.value === preferredLanguage
    );
    
    if (preferredLang) {
      orderedLanguages = [
        autoDetect,
        preferredLang,
        english,
        ...otherLanguages
      ];
    }
  } else {
    orderedLanguages = [
      autoDetect,
      english,
      ...otherLanguages
    ];
  }

  // Reorder for vertical columns
  const columnLength = Math.ceil(orderedLanguages.length / 3);
  const verticalOrdered: SupportedLanguage[] = [];
  
  for (let i = 0; i < columnLength; i++) {
    // First column
    if (i < orderedLanguages.length) {
      verticalOrdered.push(orderedLanguages[i]);
    }
    // Second column
    if (i + columnLength < orderedLanguages.length) {
      verticalOrdered.push(orderedLanguages[i + columnLength]);
    }
    // Third column
    if (i + 2 * columnLength < orderedLanguages.length) {
      verticalOrdered.push(orderedLanguages[i + 2 * columnLength]);
    }
  }

  return verticalOrdered;
} 