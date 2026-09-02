import type {
  CreateInterviewPersonaType,
  InterviewPersonaGender,
  InterviewPersonaMajor,
  InterviewPersonaRole,
  InterviewPersonaTone,
} from "./create-interview";
import type { InterviewLevel } from "./prepare-interview";

export interface SavePersonaParams {
  personaName: string;
  role: InterviewPersonaRole;
  major: InterviewPersonaMajor | null;
  type: CreateInterviewPersonaType;
  tone: InterviewPersonaTone;
  level: InterviewLevel;
  career: number;
  gender: InterviewPersonaGender;
  imageUrl: string;
  description: string;
}

export interface SavedPersonaData {
  personaId: number;
  personaName: string;
  role: InterviewPersonaRole;
  major: InterviewPersonaMajor | null;
  type: CreateInterviewPersonaType;
  tone: InterviewPersonaTone;
  level: InterviewLevel;
  career: number;
  gender: InterviewPersonaGender;
  imageUrl: string;
  description: string;
}
