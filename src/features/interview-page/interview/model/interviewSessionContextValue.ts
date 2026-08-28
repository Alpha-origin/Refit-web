import { createContext } from "react";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import type { useInterviewSession } from "./useInterviewSession";

export type InterviewSession = ReturnType<typeof useInterviewSession>;

export interface InterviewSessionContextValue extends InterviewSession {
  preparedInterview?: PreparedInterviewData | null;
}

export const InterviewSessionContext =
  createContext<InterviewSessionContextValue | null>(null);
