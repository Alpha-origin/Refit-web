import type {
  InterviewDifficultyOption,
  InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";

export type InterviewerTemplateRole = "TECH" | "HR" | "CEO" | "PM" | "DESIGN";

export type SlotIndex = 0 | 1 | 2;

export interface InterviewerTemplate {
  key: string;
  name: string;
  voiceIndex: 1 | 2 | 3 | 4 | 5;
  role: InterviewerTemplateRole;
  roleLabel: string;
  specialty: string;
  major?: "BACKEND" | "FRONTEND";
  career: number;
  gender: "MALE" | "FEMALE";
  image: string;
  tags: readonly string[];
  description: string;
}

export interface MultiInterviewSelection {
  style: InterviewStyleOption;
  difficulty: InterviewDifficultyOption;
  activeSlot: SlotIndex;
  slots: [
    InterviewerTemplate | null,
    InterviewerTemplate | null,
    InterviewerTemplate | null,
  ];
}

export interface MultiInterviewValidation {
  hasDuplicateInterviewer: boolean;
  hasDuplicateRole: boolean;
}
