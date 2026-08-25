import type {
  CreateInterviewParams,
  CreateInterviewPersonaType,
  InterviewPersonaGender,
  InterviewPersonaMajor,
} from "./create-interview";

export type InterviewPersonaRole = "TECH";

export interface SavePersonaParams extends CreateInterviewParams {
  role: InterviewPersonaRole;
}

export interface SavedPersonaData {
  personaId: number;
  personaName: string;
  major: InterviewPersonaMajor;
  type: CreateInterviewPersonaType;
  career: number;
  gender: InterviewPersonaGender;
}
