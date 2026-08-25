export type PersonaType = "FRIENDLY" | "NEUTRAL" | "STRESS";
export type InterviewLevel = "EASY" | "MEDIUM" | "HARD";
export type InterviewProgressStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "READY"
  | "ABANDONED";

export interface PrepareInterviewQuestion {
  questionId: number;
  intention: string;
  content: string;
}

export interface PrepareInterviewParams {
  sessionId?: string;
  interviewId?: number;
  userId?: number;
  personaId: number;
  personaType: PersonaType;
  level: InterviewLevel;
  jobId: string;
  questions: PrepareInterviewQuestion[];
}

export interface PreparedInterviewData {
  sessionId: string;
  interviewId: number;
  userId: number;
  personaId: number;
  personaType: PersonaType;
  level: InterviewLevel;
  jobId: string;
  status: InterviewProgressStatus;
  currentQuestionIndex: number;
  questions: PrepareInterviewQuestion[];
}
