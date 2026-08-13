import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import { useInterviewSession } from "@/features/interview-page/interview/model/useInterviewSession";
import CameraIcon from "@/shared/img/interview-page/camara.svg?url";
import MicIcon from "@/shared/img/interview-page/mike.svg?url";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
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

const FALLBACK_TOTAL_QUESTION_COUNT = 10;

const formatElapsedTime = (elapsedSeconds: number) => {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const formatQuestionLabel = ({
  currentQuestionNumber,
  isLoading,
  totalQuestionCount,
}: {
  currentQuestionNumber: number;
  isLoading: boolean;
  totalQuestionCount: number;
}) => {
  if (isLoading) {
    return "Question -- / --";
  }

  return `Question ${String(currentQuestionNumber).padStart(2, "0")} / ${String(
    totalQuestionCount,
  ).padStart(2, "0")}`;
};

const InterviewPage = () => {
  const location = useLocation();
  const preparedInterview = getPreparedInterviewFromState(location.state);
  const interviewSession = useInterviewSession(preparedInterview);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const isVoiceMode = interviewSession.mode === "voice";
  const isTextMode = interviewSession.mode === "text";
  const isQuestionLoading = interviewSession.currentQuestion === null;
  const totalQuestionCount =
    preparedInterview?.questions.length || FALLBACK_TOTAL_QUESTION_COUNT;
  const currentQuestionNumber = Math.max(interviewSession.displayQuestionNumber, 1);
  const currentQuestion = {
    id: formatQuestionLabel({
      currentQuestionNumber,
      isLoading: isQuestionLoading,
      totalQuestionCount,
    }),
    text:
      interviewSession.currentQuestion?.content ??
      "질문을 불러오는 중입니다. 잠시만 기다려주세요.",
  };

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((previousSeconds) => previousSeconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerRunning]);

  const handleStartVoice = () => {
    setIsTimerRunning(true);
    interviewSession.onStartVoice();
  };

  return (
    <S.Container $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.Content $textMode={isTextMode} $voiceMode={isVoiceMode}>
        {isVoiceMode ? (
          <S.TopControlBar>
            <S.TopControls>
              <S.TimerPill aria-label={`경과 시간 ${formatElapsedTime(elapsedSeconds)}`}>
                <S.TimerDot aria-hidden="true" />
                {formatElapsedTime(elapsedSeconds)}
              </S.TimerPill>

              <S.ModeControl>
                <S.ModeButton
                  type="button"
                  $active={interviewSession.mode === "text"}
                  aria-pressed={interviewSession.mode === "text"}
                  onClick={() => interviewSession.onModeChange("text")}
                >
                  텍스트
                </S.ModeButton>
                <S.ModeButton
                  type="button"
                  $active={interviewSession.mode === "voice"}
                  aria-pressed={interviewSession.mode === "voice"}
                  onClick={() => interviewSession.onModeChange("voice")}
                >
                  음성
                </S.ModeButton>
              </S.ModeControl>
            </S.TopControls>
          </S.TopControlBar>
        ) : null}

        <S.InterviewStage $textMode={isTextMode} $voiceMode={isVoiceMode}>
          <InterviewContentView
            answerText={interviewSession.answerText}
            isVoiceStarted={interviewSession.isVoiceStarted}
            mode={interviewSession.mode}
            onAnswerTextChange={interviewSession.onAnswerTextChange}
            onModeChange={interviewSession.onModeChange}
            onSubmitText={interviewSession.onSubmitText}
            question={currentQuestion}
            voiceLevel={interviewSession.voiceLevel}
          />

          {isVoiceMode && (
            <InterviewCameraView
              cameraState={interviewSession.cameraState}
              videoRef={interviewSession.videoRef}
            />
          )}
        </S.InterviewStage>

        {isVoiceMode ? (
          <S.ActionRow>
            <S.IconActionButton type="button" aria-label="카메라 상태">
              <S.ActionIconImage
                src={CameraIcon}
                alt=""
                aria-hidden="true"
                $iconType="camera"
              />
            </S.IconActionButton>
            <S.IconActionButton type="button" aria-label="마이크 상태">
              <S.ActionIconImage
                src={MicIcon}
                alt=""
                aria-hidden="true"
                $iconType="mic"
              />
            </S.IconActionButton>
            {interviewSession.isVoiceStarted ? (
              <S.PrimaryAction type="button" onClick={interviewSession.onCompleteVoice}>
                완료하기
              </S.PrimaryAction>
            ) : (
              <S.PrimaryAction type="button" onClick={handleStartVoice}>
                시작하기
              </S.PrimaryAction>
            )}
          </S.ActionRow>
        ) : null}
      </S.Content>
    </S.Container>
  );
};

export default InterviewPage;
