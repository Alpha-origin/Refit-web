import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";

import type {
  InterviewerTemplate,
  InterviewerTemplateRole,
  SlotIndex,
} from "./type";

export const TYPE_BY_STYLE = {
  편함: "FRIENDLY",
  일반: "NEUTRAL",
  압박: "STRESS",
} as const;

export const LEVEL_BY_DIFFICULTY = {
  쉬움: "EASY",
  보통: "NORMAL",
  어려움: "HARD",
} as const;

export const MULTI_INTERVIEWER_TEMPLATES = [
  {
    key: "interviewer-kim",
    name: "김도윤",
    voiceIndex: 1,
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "백엔드 아키텍처",
    major: "BACKEND",
    career: 9,
    gender: "FEMALE",
    image: InterviewerImage1,
    tags: ["논리적 사고", "문제 해결"],
    description: "핵심 내용을 구조적으로 정리하고 깊이 있게 확인합니다.",
  },
  {
    key: "interviewer-lee",
    name: "이서준",
    voiceIndex: 2,
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "프론트엔드 리드",
    major: "FRONTEND",
    career: 8,
    gender: "FEMALE",
    image: InterviewerImage2,
    tags: ["협업", "실행력"],
    description: "경험을 바탕으로 구체적인 판단과 실행 과정을 확인합니다.",
  },
  {
    key: "interviewer-park",
    name: "박지민",
    voiceIndex: 3,
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "플랫폼 엔지니어링",
    major: "BACKEND",
    career: 6,
    gender: "MALE",
    image: InterviewerImage3,
    tags: ["분석력", "성장"],
    description: "현실적인 상황에서의 문제 해결 방식과 성장 가능성을 살펴봅니다.",
  },
  {
    key: "interviewer-choi",
    name: "최유진",
    voiceIndex: 4,
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "프론트엔드 개발",
    major: "FRONTEND",
    career: 8,
    gender: "MALE",
    image: InterviewerImage4,
    tags: ["소통", "조직 적합성"],
    description: "지원자의 강점과 협업 방식을 다양한 관점에서 확인합니다.",
  },
  {
    key: "interviewer-han",
    name: "한민석",
    voiceIndex: 5,
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "데이터 엔지니어링",
    major: "BACKEND",
    career: 5,
    gender: "MALE",
    image: InterviewerImage2,
    tags: ["동기", "적응력"],
    description: "지원자의 동기와 문제를 끝까지 해결하는 태도를 확인합니다.",
  },
] as const satisfies readonly InterviewerTemplate[];

export const getInterviewerGender = (
  voiceIndex: InterviewerTemplate["voiceIndex"],
) => (voiceIndex <= 2 ? "FEMALE" : "MALE");

interface InterviewerRoleConfig {
  role: InterviewerTemplateRole;
  roleLabel: string;
  specialty: string;
  major?: "BACKEND" | "FRONTEND";
}

const MULTI_INTERVIEW_ROLE_CONFIGS: readonly (readonly InterviewerRoleConfig[])[] = [
  [
    { role: "TECH", roleLabel: "기술 면접관", specialty: "백엔드 아키텍처", major: "BACKEND" },
    { role: "TECH", roleLabel: "기술 면접관", specialty: "프론트엔드 리드", major: "FRONTEND" },
    { role: "TECH", roleLabel: "기술 면접관", specialty: "플랫폼 엔지니어링", major: "BACKEND" },
    { role: "TECH", roleLabel: "기술 면접관", specialty: "프론트엔드 개발", major: "FRONTEND" },
    { role: "TECH", roleLabel: "기술 면접관", specialty: "데이터 엔지니어링", major: "BACKEND" },
  ],
  [
    { role: "HR", roleLabel: "인사 면접관", specialty: "조직 문화와 협업" },
    { role: "PM", roleLabel: "PM 면접관", specialty: "프로덕트 전략" },
    { role: "DESIGN", roleLabel: "디자인 면접관", specialty: "프로덕트 경험" },
    { role: "HR", roleLabel: "인사 면접관", specialty: "인재 성장" },
    { role: "PM", roleLabel: "PM 면접관", specialty: "그로스와 실험" },
  ],
  [
    { role: "CEO", roleLabel: "대표 면접관", specialty: "사업 전략" },
    { role: "CEO", roleLabel: "대표 면접관", specialty: "비즈니스 리더십" },
    { role: "HR", roleLabel: "인사 면접관", specialty: "조직 적합성" },
    { role: "DESIGN", roleLabel: "디자인 면접관", specialty: "브랜드 경험" },
    { role: "PM", roleLabel: "PM 면접관", specialty: "제품 의사결정" },
  ],
];

export const getInterviewerRoleConfigForSlot = (
  slot: SlotIndex,
  interviewerIndex: number,
) => MULTI_INTERVIEW_ROLE_CONFIGS[slot][interviewerIndex];

export const MULTI_INTERVIEW_SLOT_LABELS = [
  "기술",
  "직무·조직 적합성",
  "리더십·비즈니스",
] as const;

export const getInterviewerCandidatesForSlot = (slot: SlotIndex) =>
  MULTI_INTERVIEWER_TEMPLATES.map((interviewer, index) => ({
    ...interviewer,
    ...getInterviewerRoleConfigForSlot(slot, index),
  }));

const ROLE_LABELS: Record<InterviewerTemplateRole, string> = {
  TECH: "기술 면접관",
  HR: "인사 면접관",
  CEO: "대표 면접관",
  PM: "PM 면접관",
  DESIGN: "디자인 면접관",
};

export const getRoleLabel = (role: InterviewerTemplateRole) => ROLE_LABELS[role];

export type {
  InterviewerTemplate,
  InterviewerTemplateRole,
  MultiInterviewSelection,
  MultiInterviewValidation,
  SlotIndex,
} from "./type";
