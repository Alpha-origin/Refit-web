import type {
  CreateInterviewPersonaType,
  InterviewPersonaGender,
  InterviewPersonaMajor,
  InterviewPersonaRole,
} from "./create-interview";
import type { InterviewLevel } from "./prepare-interview";

export interface SavePersonaParams {
  personaName: string;
  role: InterviewPersonaRole;
  level: InterviewLevel;
  major: InterviewPersonaMajor | null;
  type: CreateInterviewPersonaType;
  career: number;
  gender: InterviewPersonaGender;
}

export interface SavedPersonaData {
  personaId: number;
  personaName: string;
  role: InterviewPersonaRole;
  major: InterviewPersonaMajor | null;
  type: CreateInterviewPersonaType;
  level: InterviewLevel;
  career: number;
  gender: InterviewPersonaGender;
}
