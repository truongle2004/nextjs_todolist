import type { Language } from './language.type';
import type { VersionGroup } from './versionGroup.type';

export interface FlavorTextEntry {
  flavor_text: string;
  language: Language;
  version_group: VersionGroup;
}
