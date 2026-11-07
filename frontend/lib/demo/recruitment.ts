import type { RecruitmentCandidate } from './types';

export type StageKey = keyof RecruitmentCandidate['stages_data'];

export const ORDERED_STAGE_KEYS: StageKey[] = [
  'berkas',
  'interview',
  'tpub',
  'praktik',
  'kontrak',
  'bpjs',
  'pkwt',
  'osc',
  'mcu',
  'gip_ebs',
  'badge',
  'sdt_teori',
  'simper',
];

export function getRecruitmentProgress(stages: RecruitmentCandidate['stages_data']): number {
  const completed = ORDERED_STAGE_KEYS.filter((key) => stages[key]?.completed).length;
  return Math.round((completed / ORDERED_STAGE_KEYS.length) * 100);
}

export function getEligibility(progress: number): RecruitmentCandidate['eligibility_status'] {
  return progress >= 100 ? 'Layak Kerja' : 'Belum Layak Kerja';
}

export function applyStageUpdate(
  candidate: RecruitmentCandidate,
  stage: StageKey,
  completed: boolean,
): RecruitmentCandidate {
  const stages = {
    ...candidate.stages_data,
    [stage]: completed
      ? { completed: true, date: candidate.stages_data[stage]?.date ?? new Date().toISOString().split('T')[0] }
      : { completed: false },
  };
  const progress = getRecruitmentProgress(stages);
  return {
    ...candidate,
    stages_data: stages,
    progress_pct: progress,
    eligibility_status: getEligibility(progress),
  };
}
