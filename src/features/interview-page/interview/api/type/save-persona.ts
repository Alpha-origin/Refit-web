import type {
  CreateInterviewParams,
  CreateInterviewPersonaType,
  InterviewPersonaGender,
  InterviewPersonaMajor,
  InterviewPersonaRole,
} from "./create-interview";
import type { InterviewLevel } from "./prepare-interview";

export interface SavePersonaParams extends CreateInterviewParams {
  role: InterviewPersonaRole;
  level: InterviewLevel;
}

export interface SavedPersonaData {
  personaId: number;
  personaName: string;
  role: InterviewPersonaRole;
  major: InterviewPersonaMajor;
  type: CreateInterviewPersonaType;
  level: InterviewLevel;
  career: number;
  gender: InterviewPersonaGender;
}
