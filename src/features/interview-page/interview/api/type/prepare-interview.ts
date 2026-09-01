import type {
  CreateInterviewPersonaType,
  InterviewPersonaGender,
  InterviewPersonaMajor,
  InterviewPersonaRole,
} from "./create-interview";

export type PersonaType = "FRIENDLY" | "NEUTRAL" | "STRESS";
export type InterviewLevel = "EASY" | "MEDIUM" | "NORMAL" | "HARD";
export type InterviewProgressStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "READY"
  | "ABANDONED";

export type PreparedInterviewMode = "SOLO" | "MULTI";

export interface PreparedInterviewer {
  personaId: number;
  name: string;
  roleLabel: string;
  image?: string;
}

export interface PrepareInterviewQuestion {
  questionId: number;
  intention: string;
  content: string;
  expectedAnswer?: string;
  basedOn?: string[];
  personaId?: number;
}

export interface PrepareInterviewParams {
  sessionId?: string;
  interviewId?: number;
  userId?: number;
  personaId: number;
  personaName: string;
  role: InterviewPersonaRole;
  major: InterviewPersonaMajor | null;
  type: CreateInterviewPersonaType;
  personaType: PersonaType;
  level: InterviewLevel;
  career: number;
  gender: InterviewPersonaGender;
  jobId: string;
  questions: PrepareInterviewQuestion[];
}

export interface PreparedInterviewData {
  sessionId: string;
  interviewId: number;
  userId: number;
  personaId: number;
  personaName: string;
  role: InterviewPersonaRole;
  major: InterviewPersonaMajor | null;
  type: CreateInterviewPersonaType;
  personaType: PersonaType;
  level: InterviewLevel;
  career: number;
  gender: InterviewPersonaGender;
  jobId: string;
  status: InterviewProgressStatus;
  currentQuestionIndex: number;
  questions: PrepareInterviewQuestion[];
  mode: PreparedInterviewMode;
  interviewers?: PreparedInterviewer[];
}
