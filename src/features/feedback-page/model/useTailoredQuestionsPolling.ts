import { useEffect, useState } from "react";

import { getTailoredQuestions } from "@/features/feedback-page/api/tailorQuestions";
import { extractErrorMessage } from "@/shared/api/errorMessage";

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
      return;
    }

    let isActive = true;
    const loadTailoredQuestions = async () => {
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
        console.error("[questions/tailor] request error", {
          interviewId,
          message,
        });
      }
    };

    void loadTailoredQuestions();

    return () => {
      isActive = false;
    };
  }, [interviewId]);

  return {
    lastTailorPolledAt,
    tailorErrorMessage,
    tailoredQuestions,
  };
};
