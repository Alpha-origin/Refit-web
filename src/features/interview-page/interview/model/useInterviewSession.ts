import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearActiveInterviewSessionId,
  disconnectInterviewSocket,
  getActiveInterviewSessionId,
  getCurrentInterviewQuestion,
  getInterviewPreparation,
  quitInterview,
  setActiveInterviewSessionId,
  submitInterviewAnswer,
  type CurrentInterviewQuestion,
  type InterviewProgressStatus,
  type PreparedInterviewData,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_STATUS_MESSAGES,
} from "@/shared/constants/interview-page/interview";

import type { InterviewMode } from "@/widgets/interview-page/interview/type";
import { useSupertoneTts } from "./useSupertoneTts";
import { useInterviewCamera } from "./useInterviewCamera";
import { useInterviewSocket } from "./useInterviewSocket";
import { useVoiceAnswer } from "./useVoiceAnswer";

type InterviewCloseReason = "completed" | "quit";
const INTERVIEW_COMPLETED_PATH = "/main/interview/completed";
const INTERVIEW_PREPARATION_POLL_INTERVAL_MS = 1_000;
const INTERVIEW_PREPARATION_MAX_ATTEMPTS = 120;

const buildQuestionKey = (question: CurrentInterviewQuestion | null) => {
  if (!question) {
    return null;
  }

  return [
    question.questionId,
    question.parentId,
    question.type,
    question.intention,
    question.content,
  ].join("|");
};

const buildInitialQuestion = (
  preparedInterview?: PreparedInterviewData | null,
): CurrentInterviewQuestion | null => {
  if (!preparedInterview || preparedInterview.questions.length === 0) {
    return null;
  }

  const nextQuestion =
    preparedInterview.questions[preparedInterview.currentQuestionIndex] ??
    preparedInterview.questions[0];

  if (!nextQuestion) {
    return null;
  }

  return {
    questionId: nextQuestion.questionId,
    parentId: 0,
    type: "ORIGINAL",
    intention: nextQuestion.intention,
    content: nextQuestion.content,
    personaId: nextQuestion.personaId,
  };
};

interface InterviewSessionState {
  currentQuestion: CurrentInterviewQuestion | null;
  displayQuestionNumber: number;
  interviewStatus: InterviewProgressStatus;
  isChatSessionReady: boolean;
  totalQuestionCount: number;
}

type InterviewSessionAction =
  | { type: "RESET_SESSION"; preparedInterview?: PreparedInterviewData | null }
  | { type: "SYNC_QUESTION"; question: CurrentInterviewQuestion }
  | { type: "ADVANCE_QUESTION"; question: CurrentInterviewQuestion }
  | { type: "SET_QUESTION_COUNT"; count: number }
  | { type: "SET_INTERVIEW_STATUS"; status: InterviewProgressStatus }
  | { type: "SET_CHAT_SESSION_READY" };

const buildInterviewSessionState = (
  preparedInterview?: PreparedInterviewData | null,
): InterviewSessionState => {
  const initialQuestion = buildInitialQuestion(preparedInterview);

  return {
    currentQuestion: initialQuestion,
    displayQuestionNumber: initialQuestion ? 1 : 0,
    interviewStatus: preparedInterview?.status ?? "IN_PROGRESS",
    isChatSessionReady: !preparedInterview,
    totalQuestionCount: preparedInterview?.questions.length ?? 0,
  };
};

const isSameQuestion = (
  left: CurrentInterviewQuestion | null,
  right: CurrentInterviewQuestion | null,
) => buildQuestionKey(left) === buildQuestionKey(right);

const isSameQuestionReference = (
  left: CurrentInterviewQuestion | null,
  right: CurrentInterviewQuestion | null,
) =>
  left !== null &&
  right !== null &&
  left.questionId === right.questionId &&
  left.parentId === right.parentId;

const isSameQuestionPrompt = (
  left: CurrentInterviewQuestion | null,
  right: CurrentInterviewQuestion | null,
) =>
  left !== null &&
  right !== null &&
  left.intention === right.intention &&
  left.content === right.content;

const isFollowUpQuestion = (question: CurrentInterviewQuestion | null) =>
  question !== null && question.questionId < 0;

const getFollowUpQuestionNumber = (
  question: CurrentInterviewQuestion | null,
) => {
  if (!isFollowUpQuestion(question)) {
    return null;
  }

  return Math.abs(question.questionId);
};

const getNextDisplayQuestionNumber = ({
  currentQuestion,
  currentQuestionNumber,
  nextQuestion,
}: {
  currentQuestion: CurrentInterviewQuestion | null;
  currentQuestionNumber: number;
  nextQuestion: CurrentInterviewQuestion;
}) => {
  if (isFollowUpQuestion(nextQuestion)) {
    return currentQuestionNumber > 0 ? currentQuestionNumber : 1;
  }

  if (
    currentQuestion === null ||
    isSameQuestionReference(currentQuestion, nextQuestion)
  ) {
    return currentQuestionNumber > 0 ? currentQuestionNumber : 1;
  }

  return currentQuestionNumber > 0 ? currentQuestionNumber + 1 : 1;
};

const interviewSessionReducer = (
  state: InterviewSessionState,
  action: InterviewSessionAction,
): InterviewSessionState => {
  switch (action.type) {
    case "RESET_SESSION": {
      const nextState = buildInterviewSessionState(action.preparedInterview);

      if (
        nextState.displayQuestionNumber === state.displayQuestionNumber &&
        nextState.interviewStatus === state.interviewStatus &&
        nextState.isChatSessionReady === state.isChatSessionReady &&
        isSameQuestion(nextState.currentQuestion, state.currentQuestion)
      ) {
        return state;
      }

      return nextState;
    }
    case "SYNC_QUESTION": {
      if (isSameQuestion(state.currentQuestion, action.question)) {
        return state;
      }

      return {
        ...state,
        currentQuestion: action.question,
        displayQuestionNumber: getNextDisplayQuestionNumber({
          currentQuestion: state.currentQuestion,
          currentQuestionNumber: state.displayQuestionNumber,
          nextQuestion: action.question,
        }),
      };
    }
    case "ADVANCE_QUESTION": {
      return {
        ...state,
        currentQuestion: action.question,
        displayQuestionNumber: getNextDisplayQuestionNumber({
          currentQuestion: state.currentQuestion,
          currentQuestionNumber: state.displayQuestionNumber,
          nextQuestion: action.question,
        }),
      };
    }
    case "SET_INTERVIEW_STATUS": {
      if (state.interviewStatus === action.status) {
        return state;
      }

      return { ...state, interviewStatus: action.status };
    }
    case "SET_QUESTION_COUNT": {
      const count = Math.max(0, action.count);

      return state.totalQuestionCount === count
        ? state
        : { ...state, totalQuestionCount: count };
    }
    case "SET_CHAT_SESSION_READY": {
      if (state.isChatSessionReady) {
        return state;
      }

      return { ...state, isChatSessionReady: true };
    }
  }
};

export const useInterviewSession = (
  preparedInterview?: PreparedInterviewData | null,
) => {
  const navigate = useNavigate();
  const [session, dispatch] = useReducer(
    interviewSessionReducer,
    preparedInterview,
    buildInterviewSessionState,
  );
  const {
    currentQuestion,
    displayQuestionNumber,
    interviewStatus,
    isChatSessionReady,
    totalQuestionCount,
  } = session;
  const [mode, setMode] = useState<InterviewMode>("voice");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparationError, setPreparationError] = useState<string | null>(null);
  const isVoiceMode = mode === "voice";
  const { cameraState, videoRef } = useInterviewCamera(isVoiceMode);
  const voiceAnswer = useVoiceAnswer();
  const questionTts = useSupertoneTts(currentQuestion?.content ?? "");
  const sessionId = preparedInterview?.sessionId ?? getActiveInterviewSessionId();
  const isSessionClosedRef = useRef(false);
  const hasPreparedChatSessionRef = useRef(false);
  const preparingSessionIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(sessionId);
  const displayQuestionNumberRef = useRef(displayQuestionNumber);
  const autoPlayedQuestionKeyRef = useRef<string | null>(null);
  const questionStartedAtRef = useRef(0);
  const canSubmitAnswer =
    isChatSessionReady &&
    interviewStatus === "IN_PROGRESS" &&
    currentQuestion !== null;
  const getInterviewExitPath = useCallback(
    (reason: InterviewCloseReason) =>
      reason === "completed" ? INTERVIEW_COMPLETED_PATH : "/main",
    [],
  );

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    displayQuestionNumberRef.current = displayQuestionNumber;
  }, [displayQuestionNumber]);

  useEffect(() => {
    dispatch({ type: "RESET_SESSION", preparedInterview });
    isSessionClosedRef.current = false;
    hasPreparedChatSessionRef.current = false;
  }, [preparedInterview]);

  useEffect(() => {
    const nextQuestionKey = buildQuestionKey(currentQuestion);

    if (!currentQuestion || !nextQuestionKey) {
      return;
    }

    if (autoPlayedQuestionKeyRef.current === nextQuestionKey) {
      return;
    }

    autoPlayedQuestionKeyRef.current = nextQuestionKey;
    questionStartedAtRef.current = Date.now();
    void questionTts.onPlay();
  }, [currentQuestion, questionTts]);

  const syncCurrentQuestion = useCallback(
    (nextQuestion: CurrentInterviewQuestion) => {
      dispatch({ type: "SYNC_QUESTION", question: nextQuestion });
    },
    [dispatch],
  );

  const advanceCurrentQuestion = useCallback(
    (nextQuestion: CurrentInterviewQuestion) => {
      dispatch({ type: "ADVANCE_QUESTION", question: nextQuestion });
    },
    [dispatch],
  );

  const endInterviewSession = useCallback(
    async (
      shouldNavigateToMain: boolean,
      reason: InterviewCloseReason = "quit",
    ) => {
      const activeSessionId = sessionIdRef.current ?? getActiveInterviewSessionId();
      const nextPath = getInterviewExitPath(reason);
      const answeredQuestionCount = displayQuestionNumberRef.current;

      if (!activeSessionId || isSessionClosedRef.current) {
        if (shouldNavigateToMain) {
          navigate(nextPath, {
            state:
              reason === "completed"
                ? { answeredQuestionCount }
                : undefined,
          });
        }

        return;
      }

      isSessionClosedRef.current = true;
      clearActiveInterviewSessionId();
      if (reason === "quit") {
        const closeResult = await quitInterview(activeSessionId);

        if (closeResult.errorMessage) {
          console.error("[interview] quit request failed", {
            sessionId: activeSessionId,
            message: closeResult.errorMessage,
          });
        }
      }

      disconnectInterviewSocket(activeSessionId);

      if (shouldNavigateToMain) {
        navigate(nextPath, {
          state:
            reason === "completed"
              ? { answeredQuestionCount }
              : undefined,
        });
      }
    },
    [getInterviewExitPath, navigate],
  );

  const handleSocketStatusChange = useCallback(
    ({
      question,
      status,
    }: {
      message: string | null;
      question: CurrentInterviewQuestion | null;
      status: InterviewProgressStatus | null;
    }) => {
      if (question) {
        syncCurrentQuestion(question);
      }

      if (!status) {
        return;
      }

      dispatch({ type: "SET_INTERVIEW_STATUS", status });

      if (status === "COMPLETED") {
        void endInterviewSession(true, "completed");
      }
    },
    [endInterviewSession, syncCurrentQuestion],
  );

  useInterviewSocket({
    sessionId: isChatSessionReady ? sessionId : null,
    onQuestionReceived: syncCurrentQuestion,
    onStatusChange: handleSocketStatusChange,
  });

  useEffect(() => {
    if (!preparedInterview || !sessionId) {
      return;
    }

    if (preparingSessionIdRef.current === sessionId) {
      return;
    }

    preparingSessionIdRef.current = sessionId;
    let isCancelled = false;
    let attemptCount = 0;
    let timeoutId: number | null = null;
    let lastErrorMessage: string | null = null;

    const waitForChatSession = async () => {
      attemptCount += 1;
      const { data, errorMessage } = await getInterviewPreparation(
        preparedInterview.interviewId,
      );

      if (isCancelled) {
        return;
      }

      if (errorMessage || !data) {
        lastErrorMessage =
          errorMessage ?? "면접 준비 상태를 확인하지 못했습니다.";
      }

      // 질문 생성 실패 뒤에도 SOLO는 원본 질문으로 채팅 전달이 성공할 수 있다.
      // 따라서 생성 상태보다 실제 채팅 전달 여부를 먼저 확인한다.
      if (data?.chatDelivered) {
        preparingSessionIdRef.current = null;
        setActiveInterviewSessionId(sessionId);
        sessionIdRef.current = sessionId;
        hasPreparedChatSessionRef.current = true;

        const firstQuestion = data.questions[0];

        if (firstQuestion) {
          syncCurrentQuestion(firstQuestion);
        }

        dispatch({ type: "SET_QUESTION_COUNT", count: data.questions.length });
        dispatch({ type: "SET_CHAT_SESSION_READY" });
        return;
      }

      // MULTI 질문 생성 실패에는 현재 서버 측 원본 질문 fallback이 없다.
      if (data?.status === "FAILED" && preparedInterview.mode === "MULTI") {
        preparingSessionIdRef.current = null;
        setPreparationError(data.errorMessage ?? "면접 질문 준비에 실패했습니다.");
        return;
      }

      if (attemptCount >= INTERVIEW_PREPARATION_MAX_ATTEMPTS) {
        preparingSessionIdRef.current = null;
        setPreparationError(
          data?.errorMessage ??
            lastErrorMessage ??
            "면접 준비 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      timeoutId = window.setTimeout(() => {
        void waitForChatSession();
      }, INTERVIEW_PREPARATION_POLL_INTERVAL_MS);
    };

    void waitForChatSession();

    return () => {
      isCancelled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (preparingSessionIdRef.current === sessionId) {
        preparingSessionIdRef.current = null;
      }
    };
  }, [preparedInterview, sessionId, syncCurrentQuestion]);

  useEffect(() => {
    return () => {
      const activeSessionId = getActiveInterviewSessionId();
      const latestSessionId = sessionIdRef.current;

      if (
        !latestSessionId ||
        !hasPreparedChatSessionRef.current ||
        isSessionClosedRef.current ||
        activeSessionId !== latestSessionId
      ) {
        return;
      }

      void endInterviewSession(false);
    };
  }, [endInterviewSession]);

  const handleModeChange = (nextMode: InterviewMode) => {
    if (nextMode === mode) {
      return;
    }

    questionTts.onStop();

    if (isVoiceMode) {
      voiceAnswer.onExitVoiceMode();
    }

    setMode(nextMode);
  };

  const handleStartVoice = () => {
    if (!isChatSessionReady) {
      console.info("[interview] start voice blocked until chat delivery completes");
      return;
    }

    if (isSubmitting || !canSubmitAnswer) {
      console.warn("[interview] start voice blocked", {
        canSubmitAnswer,
        currentQuestion,
        interviewStatus,
        isSubmitting,
      });
      return;
    }

    questionTts.onStop();
    void voiceAnswer.onStartVoice();
  };

  const submitAnswer = async (content: string) => {
    if (isSubmitting || !canSubmitAnswer) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    setIsSubmitting(true);

    const activeSessionId = sessionIdRef.current ?? getActiveInterviewSessionId();

    if (!activeSessionId) {
      setIsSubmitting(false);
      console.warn("[interview] missing sessionId when submitting answer");
      return;
    }

    const submittedQuestion = currentQuestion;

    const { data, errorMessage } = await submitInterviewAnswer({
      sessionId: activeSessionId,
      questionId: currentQuestion.questionId,
      responseTime:
        questionStartedAtRef.current > 0
          ? Math.max(
              0,
              Math.round((Date.now() - questionStartedAtRef.current) / 1_000),
            )
          : 0,
      content: trimmedContent,
    });

    setIsSubmitting(false);

    if (errorMessage) {
      return;
    }

    questionTts.onStop();
    voiceAnswer.onClearAnswer();

    if (data?.status) {
      dispatch({ type: "SET_INTERVIEW_STATUS", status: data.status });

      if (data.status === "COMPLETED") {
        await endInterviewSession(true, "completed");
        return;
      }
    }

    const responseQuestion = data?.question ?? null;
    const hasNextResponseQuestion =
      responseQuestion !== null &&
      !isSameQuestionPrompt(responseQuestion, submittedQuestion);

    if (responseQuestion) {
      if (hasNextResponseQuestion) {
        advanceCurrentQuestion(responseQuestion);
      } else {
        syncCurrentQuestion(responseQuestion);
      }
    }

    if (!hasNextResponseQuestion) {
      const { data: nextQuestion } = await getCurrentInterviewQuestion(activeSessionId);

      if (
        nextQuestion &&
        !isSameQuestionPrompt(nextQuestion, submittedQuestion)
      ) {
        advanceCurrentQuestion(nextQuestion);
      }
    }
  };

  const handleCompleteVoice = async () => {
    const voiceContent = await voiceAnswer.onCompleteVoice();
    await submitAnswer(voiceContent || voiceAnswer.answerText);
  };

  const handleSubmitText = async () => {
    await submitAnswer(voiceAnswer.answerText);
  };

  const handleQuitInterview = async () => {
    questionTts.onStop();
    voiceAnswer.onExitVoiceMode();
    await endInterviewSession(true, "quit");
  };

  return {
    answerStatus: isVoiceMode ? voiceAnswer.voiceStatus : INTERVIEW_STATUS_MESSAGES.text,
    answerText: voiceAnswer.answerText,
    cameraState,
    currentQuestion,
    displayQuestionNumber,
    isSubmitting,
    isInterviewReady: isChatSessionReady,
    isPreparingInterview: Boolean(preparedInterview) && !isChatSessionReady,
    isVoiceStarted: voiceAnswer.isVoiceStarted,
    mode,
    preparationError,
    questionAudioStatus: questionTts.status,
    onAnswerTextChange: voiceAnswer.onAnswerTextChange,
    onClearAnswer: voiceAnswer.onClearAnswer,
    onCompleteVoice: handleCompleteVoice,
    onModeChange: handleModeChange,
    onQuitInterview: handleQuitInterview,
    onStartVoice: handleStartVoice,
    onSubmitText: handleSubmitText,
    onToggleQuestionAudio: questionTts.onToggle,
    videoRef,
    voiceLevel: voiceAnswer.voiceLevel,
    totalQuestionCount,
    followUpQuestionNumber: getFollowUpQuestionNumber(currentQuestion),
  };
};
