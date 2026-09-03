import type {
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
} from '@/shared/constants/interview-page/setting-interview';

export interface InterviewerOptionsProps {
  onSelect: Pick<
    InterviewSettingSelectHandlers,
    'major' | 'personality' | 'tone'
  >;
  selection: Pick<
    InterviewSettingSelection,
    'major' | 'personality' | 'tone'
  >;
}

export interface InterviewerSettingGroupProps<Option extends string> {
  label: string;
  onSelect: (value: Option) => void;
  options: readonly Option[];
  selectedValue: Option;
}
