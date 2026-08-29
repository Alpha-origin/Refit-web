import { useNavigate } from "react-router-dom";

import { DASHBOARD_INTERVIEW_MODE_CARDS } from "./data";
import InterviewModeCard from "./interview-mode-card";
import * as S from "./style";

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
              : () => navigate("/main/setting/interview")
          }
        />
      ))}
    </S.Section>
  );
};

export default DashboardMain;
