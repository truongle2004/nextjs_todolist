import type { AbilityListItem } from './abilityListIItem.type';

export interface AbilityListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AbilityListItem[];
}
