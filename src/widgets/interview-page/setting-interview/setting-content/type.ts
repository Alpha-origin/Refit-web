import type {
  InterviewDifficultyOption,
  InterviewerId,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewStyleOption,
} from '@/shared/constants/interview-page/setting-interview';

export interface SettingContentProps {
  onSelect: InterviewSettingSelectHandlers;
  selection: InterviewSettingSelection;
}

export interface StyleOptionsProps {
  onSelect: (value: InterviewStyleOption) => void;
  selectedValue: InterviewStyleOption;
}

export interface DifficultyOptionsProps {
  onSelect: (value: InterviewDifficultyOption) => void;
  selectedValue: InterviewDifficultyOption;
}

export interface InterviewerOptionsProps {
  onSelect: (value: InterviewerId) => void;
  selectedValue: InterviewerId;
}
