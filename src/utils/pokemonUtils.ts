import type { EffectEntry } from '../types/effectEntry.type';
import type { FlavorTextEntry } from '../types/flavorTextEntry.type';

const getLanguageEffect = (
  effectEntries: EffectEntry[],
  languageCode = 'en'
) => {
  return effectEntries?.find((entry) => entry.language.name === languageCode);
};

const getLatestFlavorText = (
  flavorTexts: FlavorTextEntry[],
  languageCode = 'en'
) => {
  const englishTexts =
    flavorTexts?.filter((entry) => entry.language.name === languageCode) || [];
  return englishTexts[englishTexts.length - 1];
};

const formatName = (name: string) => {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export { getLanguageEffect, getLatestFlavorText, formatName };
