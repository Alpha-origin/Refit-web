export type InterviewStyleOption = '편함' | '일반' | '압박';

export type InterviewDifficultyOption = '쉬움' | '보통' | '어려움';

export type InterviewerPersonalityOption = '친근한' | '현실적인' | '꼼꼼함';

export type InterviewerToneOption = '부드러운' | '직설적인' | '압박하는';

export type InterviewerSpecialtyOption = '프론트엔드' | '백엔드';

export type InterviewerId = 1 | 2 | 3 | 4;

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

export interface InterviewSettingInterviewer {
  description: string;
  id: InterviewerId;
  name: string;
  personaName: string;
  tags: readonly string[];
}

export interface InterviewSettingSelection {
  difficulty: InterviewDifficultyOption;
  interviewerId: InterviewerId;
  personality: InterviewerPersonalityOption;
  specialty: InterviewerSpecialtyOption;
  style: InterviewStyleOption;
  tone: InterviewerToneOption;
}

export interface InterviewSettingSelectHandlers {
  difficulty: (value: InterviewDifficultyOption) => void;
  interviewer: (value: InterviewerId) => void;
  personality: (value: InterviewerPersonalityOption) => void;
  specialty: (value: InterviewerSpecialtyOption) => void;
  style: (value: InterviewStyleOption) => void;
  tone: (value: InterviewerToneOption) => void;
}
