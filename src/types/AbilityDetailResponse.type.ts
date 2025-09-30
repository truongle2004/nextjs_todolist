import type { AbilityName } from './abilityName.type';
import type { EffectChange } from './effectChange.type';
import type { EffectEntry } from './effectEntry.type';
import type { FlavorTextEntry } from './flavorTextEntry.type';
import type { Generation } from './generation.type';
import type { PokemonAbility } from './pokemonAbility.type';

export interface AbilityDetailResponse {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: Generation;
  effect_entries: EffectEntry[];
  effect_changes: EffectChange[];
  flavor_text_entries: FlavorTextEntry[];
  names: AbilityName[];
  pokemon: PokemonAbility[];
}
