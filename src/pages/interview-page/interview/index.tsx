import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import {
  InterviewSessionProvider,
} from "@/features/interview-page/interview/model/interviewSessionContext";
import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import Loading from "@/shared/components/loading";
import { SETTING_INTERVIEWER_CARDS } from "@/widgets/interview-page/setting-interview/data";
import InterviewDashboard from "@/widgets/interview-page/interview/interview-dashboard";
import * as S from "@/widgets/interview-page/interview/style";

const getPreparedInterviewFromState = (state: unknown) => {
  if (!state || typeof state !== "object" || !("preparedInterview" in state)) {
    return null;
  }

  const preparedInterview = (state as { preparedInterview?: unknown }).preparedInterview;

  if (!preparedInterview || typeof preparedInterview !== "object") {
    return null;
  }

  return preparedInterview as PreparedInterviewData;
};

const isMultiInterviewState = (state: unknown) =>
  Boolean(state && typeof state === "object" && "multiInterview" in state);

const getSelectedInterviewerId = (state: unknown) => {
  if (!state || typeof state !== "object" || !("interviewSetting" in state)) {
    return null;
  }

  const interviewSetting = (state as { interviewSetting?: unknown }).interviewSetting;

  if (
    !interviewSetting ||
    typeof interviewSetting !== "object" ||
    !("interviewerId" in interviewSetting)
  ) {
    return null;
  }

  const interviewerId = (interviewSetting as { interviewerId?: unknown }).interviewerId;

  return typeof interviewerId === "number" ? interviewerId : null;
};

const getPreparedInterviewForDisplay = (state: unknown) => {
  const preparedInterview = getPreparedInterviewFromState(state);

  if (!preparedInterview || preparedInterview.mode !== "SOLO") {
    return preparedInterview;
  }

  const selectedInterviewerId = getSelectedInterviewerId(state);
  const selectedInterviewer = SETTING_INTERVIEWER_CARDS.find(
    (interviewer) => interviewer.id === selectedInterviewerId,
  );

  if (!selectedInterviewer) {
    return preparedInterview;
  }

  const existingInterviewer = preparedInterview.interviewers?.[0];

  return {
    ...preparedInterview,
    interviewers: [
      {
        personaId: existingInterviewer?.personaId ?? preparedInterview.personaId,
        name: selectedInterviewer.name,
        roleLabel: "기술 면접관",
        image: selectedInterviewer.image,
      },
    ],
  } satisfies PreparedInterviewData;
};

const InterviewPage = () => {
  const location = useLocation();
  const preparedInterview = useMemo(
    () => getPreparedInterviewForDisplay(location.state),
    [location.state],
  );
  const ttsProvider = isMultiInterviewState(location.state)
    ? "supertone"
    : "elevenlabs";

  return (
    <InterviewSessionProvider
      preparedInterview={preparedInterview}
      ttsProvider={ttsProvider}
    >
      <InterviewPageContent />
    </InterviewSessionProvider>
  );
};

const InterviewPageContent = () => {
  const interviewSession = useInterviewSessionContext();

  if (interviewSession.preparationError) {
    return (
      <S.PreparationErrorScreen role="alert">
        <S.PreparationErrorMessage>
          {interviewSession.preparationError}
        </S.PreparationErrorMessage>
        <S.PreparationErrorAction
          type="button"
          onClick={() => void interviewSession.onQuitInterview()}
        >
          메인으로 돌아가기
        </S.PreparationErrorAction>
      </S.PreparationErrorScreen>
    );
  }

  if (interviewSession.isPreparingInterview) {
    return <Loading message="포트폴리오 분석 및 면접 준비 중입니다..." />;
  }

  return <InterviewDashboard />;
};

export default InterviewPage;
