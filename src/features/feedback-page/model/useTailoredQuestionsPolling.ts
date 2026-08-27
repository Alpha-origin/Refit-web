import { useEffect, useMemo, useState } from "react";

import { getTailoredQuestions } from "@/features/feedback-page/api/tailorQuestions";
import { extractErrorMessage } from "@/shared/api/errorMessage";

const TAILOR_QUESTIONS_POLL_INTERVAL = 10 * 60 * 1000;
type InterviewIdInput = number | readonly number[] | undefined;

const normalizeInterviewIds = (input: InterviewIdInput) => {
  const interviewIds = Array.isArray(input) ? input : [input];

  return [
    ...new Set(
      interviewIds.filter(
        (interviewId): interviewId is number =>
          typeof interviewId === "number" && interviewId > 0,
      ),
    ),
  ];
};

export const useTailoredQuestionsPolling = (input?: InterviewIdInput) => {
  const interviewIds = useMemo(() => normalizeInterviewIds(input), [input]);
  const [tailoredQuestions, setTailoredQuestions] = useState<
    Record<number, unknown>
  >({});
  const [tailorErrorMessage, setTailorErrorMessage] = useState<string | null>(
    null,
  );
  const [lastTailorPolledAt, setLastTailorPolledAt] = useState<Date | null>(
    null,
  );

  useEffect(() => {
    if (interviewIds.length === 0) {
      setTailoredQuestions({});
      setTailorErrorMessage(null);
      setLastTailorPolledAt(null);
      return;
    }

    let isActive = true;
    let isRequestInFlight = false;

    const pollTailoredQuestions = async () => {
      if (!isActive || isRequestInFlight) {
        return;
      }

      isRequestInFlight = true;
      const nextTailoredQuestions: Record<number, unknown> = {};
      let latestErrorMessage: string | null = null;

      try {
        for (const interviewId of interviewIds) {
          if (!isActive) {
            return;
          }

          try {
            const data = await getTailoredQuestions(interviewId);

            nextTailoredQuestions[interviewId] = data;
          } catch (error) {
            latestErrorMessage = extractErrorMessage(
              error,
              "맞춤 질문 데이터를 불러오지 못했습니다.",
            );
            console.error("[questions/tailor] polling error", {
              interviewId,
              message: latestErrorMessage,
            });
          }
        }

        if (!isActive) {
          return;
        }

        setTailoredQuestions(nextTailoredQuestions);
        setTailorErrorMessage(latestErrorMessage);
        setLastTailorPolledAt(new Date());
        console.log("[questions/tailor] response", {
          interviewIds,
          data: nextTailoredQuestions,
        });
      } finally {
        isRequestInFlight = false;
      }
    };

    void pollTailoredQuestions();

    console.log("[questions/tailor] polling started", {
      interviewIds,
      intervalMinutes: 10,
    });

    const intervalId = window.setInterval(() => {
      void pollTailoredQuestions();
    }, TAILOR_QUESTIONS_POLL_INTERVAL);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [interviewIds]);

  return {
    lastTailorPolledAt,
    tailorErrorMessage,
    tailoredQuestions,
  };
};
