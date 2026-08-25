export interface AuthSidePanelProps {
  description: string;
  imageAlt: string;
  switchAuthLabel: string;
  onSwitchAuth: () => void;
}

export interface NavButtonStyleProps {
  $active?: boolean;
}
