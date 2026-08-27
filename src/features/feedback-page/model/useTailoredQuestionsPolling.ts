import { useEffect, useState } from "react";

import { getTailoredQuestions } from "@/features/feedback-page/api/tailorQuestions";
import { extractErrorMessage } from "@/shared/api/errorMessage";

const TAILOR_QUESTIONS_POLL_INTERVAL = 10 * 60 * 1000;

export const useTailoredQuestionsPolling = (interviewId?: number) => {
  const [tailoredQuestions, setTailoredQuestions] = useState<unknown>(null);
  const [tailorErrorMessage, setTailorErrorMessage] = useState<string | null>(
    null,
  );
  const [lastTailorPolledAt, setLastTailorPolledAt] = useState<Date | null>(
    null,
  );

  useEffect(() => {
    if (!interviewId) {
      setTailoredQuestions(null);
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

      try {
        const data = await getTailoredQuestions(interviewId);

        if (!isActive) {
          return;
        }

        setTailoredQuestions(data);
        setTailorErrorMessage(null);
        setLastTailorPolledAt(new Date());
        console.log("[questions/tailor] response", {
          interviewId,
          data,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        const message = extractErrorMessage(
          error,
          "맞춤 질문 데이터를 불러오지 못했습니다.",
        );
        setTailorErrorMessage(message);
        console.error("[questions/tailor] polling error", {
          interviewId,
          message,
        });
      } finally {
        isRequestInFlight = false;
      }
    };

    void pollTailoredQuestions();

    console.log("[questions/tailor] polling started", {
      interviewId,
      intervalMinutes: 10,
    });

    const intervalId = window.setInterval(() => {
      void pollTailoredQuestions();
    }, TAILOR_QUESTIONS_POLL_INTERVAL);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [interviewId]);

  return {
    lastTailorPolledAt,
    tailorErrorMessage,
    tailoredQuestions,
  };
};
