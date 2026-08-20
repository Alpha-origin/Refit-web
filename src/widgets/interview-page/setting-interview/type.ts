import type { InterviewSettingStyleIcon } from '@/shared/constants/interview-page/setting-interview';

export interface SelectedProps {
  $selected: boolean;
}

export interface ActionButtonProps {
  $disabled?: boolean;
}

export interface StyleIconProps {
  $variant: InterviewSettingStyleIcon;
}
