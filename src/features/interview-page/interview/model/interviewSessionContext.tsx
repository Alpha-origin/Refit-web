import { type ReactNode } from "react";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import { InterviewSessionContext } from "./interviewSessionContextValue";
import {
  useInterviewSession,
  type InterviewTtsProvider,
} from "./useInterviewSession";

interface InterviewSessionProviderProps {
  children: ReactNode;
  preparedInterview?: PreparedInterviewData | null;
  ttsProvider?: InterviewTtsProvider;
}

export const InterviewSessionProvider = ({
  children,
  preparedInterview,
  ttsProvider = "elevenlabs",
}: InterviewSessionProviderProps) => {
  const session = useInterviewSession(preparedInterview, ttsProvider);

  return (
    <InterviewSessionContext.Provider value={{ ...session, preparedInterview }}>
      {children}
    </InterviewSessionContext.Provider>
  );
};
