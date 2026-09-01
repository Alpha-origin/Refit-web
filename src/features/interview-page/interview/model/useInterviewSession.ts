import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearActiveInterviewSessionId,
  disconnectInterviewSocket,
  getActiveInterviewSessionId,
  getCurrentInterviewQuestion,
  prepareInterview,
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
const AWAITING_RESPONSE_TIMEOUT_MS = 30_000;

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
  };
};

export const useInterviewSession = (
  preparedInterview?: PreparedInterviewData | null,
) => {
  const navigate = useNavigate();
  const initialQuestion = buildInitialQuestion(preparedInterview);
  const [mode, setMode] = useState<InterviewMode>("voice");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwaitingNextQuestion, setIsAwaitingNextQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentInterviewQuestion | null>(
    () => initialQuestion,
  );
  const [displayQuestionNumber, setDisplayQuestionNumber] = useState(
    () => (initialQuestion ? 1 : 0),
  );
  const [interviewStatus, setInterviewStatus] = useState<InterviewProgressStatus>(
    preparedInterview?.status ?? "IN_PROGRESS",
  );
  const [isChatSessionReady, setIsChatSessionReady] = useState(
    () => !preparedInterview,
  );
  const isVoiceMode = mode === "voice";
  const { cameraState, videoRef } = useInterviewCamera(isVoiceMode);
  const voiceAnswer = useVoiceAnswer();
  const questionTts = useSupertoneTts(currentQuestion?.content ?? "");
  const sessionId = preparedInterview?.sessionId ?? getActiveInterviewSessionId();
  const isSessionClosedRef = useRef(false);
  const hasPreparedChatSessionRef = useRef(false);
  const preparedChatSessionIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(sessionId);
  const displayQuestionNumberRef = useRef(displayQuestionNumber);
  const autoPlayedQuestionKeyRef = useRef<string | null>(null);
  const awaitingResponseTimeoutRef = useRef<number | null>(null);
  const isCompletingVoiceRef = useRef(false);
  const currentQuestionKeyRef = useRef<string | null>(
    buildQuestionKey(initialQuestion),
  );
  const canSubmitAnswer =
    isChatSessionReady &&
    interviewStatus === "IN_PROGRESS" &&
    currentQuestion !== null;
  const getInterviewExitPath = useCallback(
    (reason: InterviewCloseReason) =>
      reason === "completed" ? INTERVIEW_COMPLETED_PATH : "/main",
    [],
  );
  const clearAwaitingResponseTimeout = useCallback(() => {
    if (awaitingResponseTimeoutRef.current !== null) {
      window.clearTimeout(awaitingResponseTimeoutRef.current);
      awaitingResponseTimeoutRef.current = null;
    }
  }, []);
  const scheduleAwaitingResponseTimeout = useCallback(() => {
    clearAwaitingResponseTimeout();
    awaitingResponseTimeoutRef.current = window.setTimeout(() => {
      awaitingResponseTimeoutRef.current = null;
      setIsAwaitingNextQuestion(false);
      console.warn("[interview] timed out waiting for the next question");
    }, AWAITING_RESPONSE_TIMEOUT_MS);
  }, [clearAwaitingResponseTimeout]);

  useEffect(() => {
    return () => {
      clearAwaitingResponseTimeout();
    };
  }, [clearAwaitingResponseTimeout]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    displayQuestionNumberRef.current = displayQuestionNumber;
  }, [displayQuestionNumber]);

  useEffect(() => {
    const nextInitialQuestion = buildInitialQuestion(preparedInterview);

    currentQuestionKeyRef.current = buildQuestionKey(nextInitialQuestion);
    setCurrentQuestion(nextInitialQuestion);
    setDisplayQuestionNumber(nextInitialQuestion ? 1 : 0);
    setInterviewStatus(preparedInterview?.status ?? "IN_PROGRESS");
    setIsChatSessionReady(!preparedInterview);
    isSessionClosedRef.current = false;
    hasPreparedChatSessionRef.current = !preparedInterview;
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
    void questionTts.onPlay();
  }, [currentQuestion, questionTts]);

  const applyCurrentQuestion = useCallback((nextQuestion: CurrentInterviewQuestion) => {
    clearAwaitingResponseTimeout();
    setIsAwaitingNextQuestion(false);

    const nextQuestionKey = buildQuestionKey(nextQuestion);

    if (currentQuestionKeyRef.current === nextQuestionKey) {
      return;
    }

    currentQuestionKeyRef.current = nextQuestionKey;
    setCurrentQuestion(nextQuestion);
    setDisplayQuestionNumber((previousNumber) =>
      previousNumber > 0 ? previousNumber + 1 : 1,
    );
  }, [clearAwaitingResponseTimeout]);

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
        applyCurrentQuestion(question);
      }

      if (!status) {
        return;
      }

      setInterviewStatus(status);

      if (status === "COMPLETED") {
        void endInterviewSession(true, "completed");
      }
    },
    [applyCurrentQuestion, endInterviewSession],
  );

  useInterviewSocket({
    sessionId: isChatSessionReady ? sessionId : null,
    onQuestionReceived: applyCurrentQuestion,
    onStatusChange: handleSocketStatusChange,
  });

  useEffect(() => {
    if (!preparedInterview || !sessionId) {
      return;
    }

    if (preparedChatSessionIdRef.current === sessionId) {
      return;
    }

    preparedChatSessionIdRef.current = sessionId;
    let isCancelled = false;

    const startInterviewSession = async () => {
      const { data, errorMessage } = await prepareInterview({
        sessionId,
        interviewId: preparedInterview.interviewId,
        userId: preparedInterview.userId,
        personaId: preparedInterview.personaId,
        personaName: preparedInterview.personaName,
        role: preparedInterview.role,
        major: preparedInterview.major,
        type: preparedInterview.type,
        personaType: preparedInterview.personaType,
        level: preparedInterview.level,
        career: preparedInterview.career,
        gender: preparedInterview.gender,
        jobId: preparedInterview.jobId,
        questions: preparedInterview.questions,
      });

      if (isCancelled) {
        return;
      }

      if (errorMessage || !data) {
        preparedChatSessionIdRef.current = null;
        return;
      }

      setActiveInterviewSessionId(data.sessionId);
      sessionIdRef.current = data.sessionId;
      hasPreparedChatSessionRef.current = true;

      if (data.status) {
        setInterviewStatus(data.status);
      }

      const firstQuestion = buildInitialQuestion(data);

      if (firstQuestion) {
        applyCurrentQuestion(firstQuestion);
      }

      if (!firstQuestion) {
        const { data: nextQuestion } = await getCurrentInterviewQuestion(data.sessionId);

        if (isCancelled) {
          return;
        }

        if (nextQuestion) {
          applyCurrentQuestion(nextQuestion);
        }
      }

      setIsChatSessionReady(true);
    };

    void startInterviewSession();

    return () => {
      isCancelled = true;

      if (preparedChatSessionIdRef.current === sessionId) {
        preparedChatSessionIdRef.current = null;
      }
    };
  }, [applyCurrentQuestion, preparedInterview, sessionId]);

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
      console.info("[interview] start voice blocked until SSE preparation completes");
      return;
    }

    if (isSubmitting || isAwaitingNextQuestion || !canSubmitAnswer) {
      console.warn("[interview] start voice blocked", {
        canSubmitAnswer,
        currentQuestion,
        interviewStatus,
        isAwaitingNextQuestion,
        isSubmitting,
      });
      return;
    }

    questionTts.onStop();
    void voiceAnswer.onStartVoice();
  };

  const submitAnswer = async (content: string) => {
    if (isSubmitting || isAwaitingNextQuestion || !canSubmitAnswer) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    setIsSubmitting(true);
    setIsAwaitingNextQuestion(true);
    scheduleAwaitingResponseTimeout();

    const activeSessionId = sessionIdRef.current ?? getActiveInterviewSessionId();

    if (!activeSessionId) {
      setIsSubmitting(false);
      clearAwaitingResponseTimeout();
      setIsAwaitingNextQuestion(false);
      console.warn("[interview] missing sessionId when submitting answer");
      return;
    }

    const { data, errorMessage } = await submitInterviewAnswer({
      sessionId: activeSessionId,
      questionId: currentQuestion.questionId,
      responseTime: 0,
      content: trimmedContent,
    });

    setIsSubmitting(false);

    if (errorMessage) {
      clearAwaitingResponseTimeout();
      setIsAwaitingNextQuestion(false);
      return;
    }

    questionTts.onStop();
    voiceAnswer.onClearAnswer();

    if (data?.question) {
      applyCurrentQuestion(data.question);
    }

    if (data?.status) {
      setInterviewStatus(data.status);

      if (data.status === "COMPLETED") {
        clearAwaitingResponseTimeout();
        setIsAwaitingNextQuestion(false);
        await endInterviewSession(true, "completed");
        return;
      }
    }

    if (!data?.question) {
      const { data: nextQuestion } = await getCurrentInterviewQuestion(activeSessionId);

      if (nextQuestion) {
        applyCurrentQuestion(nextQuestion);
      }
    }
  };

  const handleCompleteVoice = async () => {
    if (isCompletingVoiceRef.current || isSubmitting || isAwaitingNextQuestion) {
      return;
    }

    isCompletingVoiceRef.current = true;

    try {
      const voiceContent = await voiceAnswer.onCompleteVoice();
      await submitAnswer(voiceContent || voiceAnswer.answerText);
    } finally {
      isCompletingVoiceRef.current = false;
    }
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
    isAwaitingNextQuestion,
    isAwaitingResponse: isSubmitting || isAwaitingNextQuestion,
    isInterviewReady: isChatSessionReady,
    isPreparingInterview: Boolean(preparedInterview) && !isChatSessionReady,
    isSubmitting,
    isVoiceStarted: voiceAnswer.isVoiceStarted,
    mode,
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
  };
};
