import { useNavigate } from "react-router-dom";

import type { MainPageInterviewModeId } from "@/shared/constants/main-page/dash-board";
import { DASHBOARD_INTERVIEW_MODE_CARDS } from "./data";
import InterviewModeCard from "./interview-mode-card";
import * as S from "./style";

const INTERVIEW_MODE_ROUTES: Record<MainPageInterviewModeId, string> = {
  "one-to-one": "/main/setting/interview",
  "n-to-one": "/main/setting/interview/multi",
};

const DashboardMain = () => {
  const navigate = useNavigate();

  return (
    <S.Section>
      {DASHBOARD_INTERVIEW_MODE_CARDS.map(({ id, ...card }) => (
        <InterviewModeCard
          key={id}
          {...card}
          onStart={
            card.isComingSoon
              ? undefined
              : () => navigate(INTERVIEW_MODE_ROUTES[id])
          }
        />
      ))}
    </S.Section>
  );
};

export default DashboardMain;
