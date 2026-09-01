import { useLocation } from "react-router-dom";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import {
  InterviewSessionProvider,
} from "@/features/interview-page/interview/model/interviewSessionContext";
import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import Loading from "@/shared/components/loading";
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

const formatElapsedTime = (elapsedSeconds: number) => {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const InterviewPage = () => {
  const location = useLocation();
  const preparedInterview = getPreparedInterviewFromState(location.state);
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
