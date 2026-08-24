import type { MissionInstance } from '../types';
import type { useTranslation } from '../i18n/useTranslation';

type TranslateFn = ReturnType<typeof useTranslation>['t'];

export function getMissionDescriptionParams(
  mission: MissionInstance,
  t: TranslateFn,
): Record<string, string | number> {
  const params: Record<string, string | number> = { count: mission.target };
  if (mission.params?.continent) {
    params.continent = t(`continents.${mission.params.continent}`);
  }
  return params;
}
