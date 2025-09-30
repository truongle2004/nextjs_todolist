import type { EffectEntry } from './effectEntry.type';
import type { VersionGroup } from './versionGroup.type';

export interface EffectChange {
  effect_entries: EffectEntry[];
  version_group: VersionGroup;
}
