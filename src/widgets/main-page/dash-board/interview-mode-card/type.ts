export type InterviewModeCardVariant = "light" | "dark";

export interface InterviewModeFeature {
  description: string;
  title: string;
}

export interface InterviewModeCardProps {
  aiBadge: string;
  badge: string;
  description: string;
  features: readonly InterviewModeFeature[];
  image: string;
  isComingSoon?: boolean;
  isReversed?: boolean;
  onStart?: () => void;
  startButton: string;
  title: string;
  variant: InterviewModeCardVariant;
}
