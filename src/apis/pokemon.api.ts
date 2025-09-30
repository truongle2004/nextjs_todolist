import type { AbilityDetailResponse } from '@/types/AbilityDetailResponse.type';
import type { AbilityListResponse } from '@/types/abilityListResponse.type';
import axiosInstance from '@/utils/axiosInstance';

const getPokemonList = async (url: string): Promise<AbilityDetailResponse> => {
  return await axiosInstance.get(url);
};

const getListPokemonAbility = async (): Promise<AbilityListResponse> => {
  return await axiosInstance.get(
    'https://pokeapi.co/api/v2/ability/?limit=20&offset=20'
  );
};

export { getPokemonList, getListPokemonAbility };
