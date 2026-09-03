export type InterviewStyleOption = '편함' | '일반' | '압박';

export type InterviewDifficultyOption = '쉬움' | '보통' | '어려움';

export type InterviewerPersonalityOption = '친근한' | '현실적인' | '꼼꼼한';

export type InterviewerToneOption = '부드러운' | '직설적인' | '압박하는';

export type InterviewMajorOption = '프론트엔드' | '백엔드';

export type InterviewSettingStyleIcon = 'smile' | 'neutral' | 'pressure';

export type InterviewSettingOptionSection =
  | {
      key: 'style';
      title: string;
      options: readonly InterviewStyleOption[];
    }
  | {
      key: 'difficulty';
      title: string;
      options: readonly InterviewDifficultyOption[];
    };

export interface InterviewSettingStyleMeta {
  description: string;
  icon: InterviewSettingStyleIcon;
}

export interface InterviewSettingSelection {
  difficulty: InterviewDifficultyOption;
  major: InterviewMajorOption;
  personality: InterviewerPersonalityOption;
  style: InterviewStyleOption;
  tone: InterviewerToneOption;
}

export interface InterviewSettingSelectHandlers {
  difficulty: (value: InterviewDifficultyOption) => void;
  major: (value: InterviewMajorOption) => void;
  personality: (value: InterviewerPersonalityOption) => void;
  style: (value: InterviewStyleOption) => void;
  tone: (value: InterviewerToneOption) => void;
}
