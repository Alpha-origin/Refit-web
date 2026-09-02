export interface FeedbackOverallBarItem {
  label: string;
  score: number;
  tone: "primary" | "muted";
}

export interface FeedbackOverallComparisonCard {
  title: string;
  highlightText?: string;
  bars: readonly FeedbackOverallBarItem[];
}

export interface FeedbackOverallPersonaFeedback {
  title: string;
  comment: string;
  imageUrl?: string;
}

export interface FeedbackOverallKeywordItem {
  text: string;
  size: "xs" | "sm" | "md" | "xl";
  top: string;
  left: string;
}

export interface FeedbackOverallTopSectionData {
  tabs: {
    overallLabel: string;
    detailLabel: string;
    activeTab: "overall" | "detail";
  };
  summary: {
    title: string;
    score: number;
    description: readonly string[];
  };
  averageComparison: {
    title: string;
    bars: readonly FeedbackOverallBarItem[];
  };
  comparisonCards: readonly FeedbackOverallComparisonCard[];
  intentAlignmentScore: number;
}

export interface FeedbackOverallMiddleSectionData {
  cards: readonly {
    title: string;
    content: string;
  }[];
  personaFeedbacks: readonly FeedbackOverallPersonaFeedback[];
}

export interface FeedbackOverallBottomSectionData {
  reliability: {
    title: string;
    scoreLabel: string;
    levelLabel: string;
  };
  questionFit: {
    title: string;
    content: string;
  };
  keywords: {
    items: readonly FeedbackOverallKeywordItem[];
  };
  pdfActionLabel: string;
}

export interface FeedbackOverallTopSectionProps {
  content: FeedbackOverallTopSectionData;
}

export interface FeedbackOverallMiddleSectionProps {
  content: FeedbackOverallMiddleSectionData;
}

export interface FeedbackOverallBottomSectionProps {
  content: FeedbackOverallBottomSectionData;
  isDownloadingPdf?: boolean;
  onDownloadPdf?: () => void;
}
