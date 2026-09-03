import type { InterviewSettingStyleIcon } from '@/shared/constants/interview-page/setting-interview';

export interface SelectedProps {
  $selected: boolean;
}

export interface ActionButtonProps {
  $analyzing?: boolean;
  $disabled?: boolean;
}

export interface InterviewerOptionGridProps {
  $columns: 2 | 3;
}

export interface StyleIconProps {
  $variant: InterviewSettingStyleIcon;
}
