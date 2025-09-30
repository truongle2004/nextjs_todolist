import type { Language } from './language.type';

export interface EffectEntry {
  effect: string;
  language: Language;
  short_effect?: string;
}
