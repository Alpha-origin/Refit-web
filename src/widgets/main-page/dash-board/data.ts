import {
  MAIN_PAGE_INTERVIEW_MODE_CARDS,
  type MainPageInterviewModeId,
} from "@/shared/constants/main-page/dash-board";
import DashboardBottomImage from "@/shared/img/main-page/Main-DashBoard-Bottom-New.svg?url";
import DashboardTopImage from "@/shared/img/main-page/Main-DashBoard-Top.svg?url";
import type { InterviewModeCardVariant } from "./interview-mode-card/type";

interface InterviewModePresentation {
  image: string;
  isReversed: boolean;
  variant: InterviewModeCardVariant;
}

const INTERVIEW_MODE_PRESENTATIONS: Record<
  MainPageInterviewModeId,
  InterviewModePresentation
> = {
  "one-to-one": {
    image: DashboardTopImage,
    isReversed: false,
    variant: "light",
  },
  "n-to-one": {
    image: DashboardBottomImage,
    isReversed: true,
    variant: "dark",
  },
};

export const DASHBOARD_INTERVIEW_MODE_CARDS =
  MAIN_PAGE_INTERVIEW_MODE_CARDS.map((card) => ({
    ...card,
    ...INTERVIEW_MODE_PRESENTATIONS[card.id],
  }));
