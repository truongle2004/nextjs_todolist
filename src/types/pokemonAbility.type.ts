import type { Pokemon } from './pokemon.type';

export interface PokemonAbility {
  is_hidden: boolean;
  pokemon: Pokemon;
  slot: number;
}
