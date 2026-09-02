import { useCallback, useEffect, useRef, useState } from "react";

import { waitForInterviewReady } from "@/features/interview-page/interview/api";
import {
  getInterviewJobReadyId,
  markInterviewJobReady,
} from "@/shared/storage/interviewJobId";

export const usePortfolioAnalysisStatus = () => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [readySessionId, setReadySessionId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const waitForPortfolioAnalysis = useCallback(async (jobId: string) => {
    const normalizedJobId = jobId.trim();

    if (!normalizedJobId) {
      throw new Error("마이페이지에서 포트폴리오를 먼저 등록해주세요.");
    }

    if (getInterviewJobReadyId() === normalizedJobId) {
      return null;
    }

    abortControllerRef.current?.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    setIsWaiting(true);

    try {
      const readyData = await waitForInterviewReady(
        normalizedJobId,
        abortController.signal,
      );
      markInterviewJobReady(normalizedJobId);

      if (readyData.sessionId) {
        setReadySessionId(readyData.sessionId);
      }

      return readyData;
    } finally {
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
        setIsWaiting(false);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    isWaiting,
    readySessionId,
    waitForPortfolioAnalysis,
  };
};
