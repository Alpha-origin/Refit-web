import type {
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
} from '@/shared/constants/interview-page/setting-interview';

export interface InterviewerOptionsProps {
  onSelect: Pick<
    InterviewSettingSelectHandlers,
    'personality' | 'specialty' | 'tone'
  >;
  selection: Pick<
    InterviewSettingSelection,
    'personality' | 'specialty' | 'tone'
  >;
}
