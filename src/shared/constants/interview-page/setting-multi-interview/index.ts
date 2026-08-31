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
    key: "tech-backend-architect",
    name: "김도윤",
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "백엔드 아키텍처",
    major: "BACKEND",
    career: 9,
    gender: "MALE",
    image: InterviewerImage1,
    tags: ["시스템 설계", "확장성", "문제 해결"],
    description: "서비스 구조와 기술적 의사결정 과정을 깊이 있게 확인합니다.",
  },
  {
    key: "tech-frontend-lead",
    name: "이서준",
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "프론트엔드 리드",
    major: "FRONTEND",
    career: 8,
    gender: "MALE",
    image: InterviewerImage2,
    tags: ["웹 성능", "UI 구조", "협업"],
    description: "사용자 경험을 고려한 구현력과 협업 방식을 평가합니다.",
  },
  {
    key: "tech-platform-engineer",
    name: "박지민",
    role: "TECH",
    roleLabel: "기술 면접관",
    specialty: "플랫폼 엔지니어링",
    major: "BACKEND",
    career: 6,
    gender: "FEMALE",
    image: InterviewerImage3,
    tags: ["데이터", "장애 대응", "자동화"],
    description: "현실적인 문제 해결력과 운영 관점의 사고를 살펴봅니다.",
  },
  {
    key: "hr-people-partner",
    name: "최유진",
    role: "HR",
    roleLabel: "인사 면접관",
    specialty: "조직 문화와 협업",
    career: 8,
    gender: "FEMALE",
    image: InterviewerImage4,
    tags: ["조직 적합성", "소통", "성장"],
    description: "지원자의 가치관과 팀 안에서의 협업 방식을 확인합니다.",
  },
  {
    key: "hr-talent-manager",
    name: "한민석",
    role: "HR",
    roleLabel: "인사 면접관",
    specialty: "인재 성장",
    career: 5,
    gender: "MALE",
    image: InterviewerImage2,
    tags: ["동기", "피드백", "적응력"],
    description: "직무 동기와 장기적인 성장 가능성을 중심으로 질문합니다.",
  },
  {
    key: "ceo-founder",
    name: "윤하늘",
    role: "CEO",
    roleLabel: "대표 면접관",
    specialty: "사업 전략",
    career: 12,
    gender: "FEMALE",
    image: InterviewerImage3,
    tags: ["비전", "주도성", "임팩트"],
    description: "회사의 방향성과 문제 해결에 기여할 수 있는지를 봅니다.",
  },
  {
    key: "ceo-business-leader",
    name: "정현우",
    role: "CEO",
    roleLabel: "대표 면접관",
    specialty: "비즈니스 리더십",
    career: 14,
    gender: "MALE",
    image: InterviewerImage1,
    tags: ["의사결정", "책임감", "실행력"],
    description: "우선순위 판단과 주도적으로 끝까지 실행하는 힘을 평가합니다.",
  },
  {
    key: "pm-product-strategist",
    name: "서지훈",
    role: "PM",
    roleLabel: "PM 면접관",
    specialty: "프로덕트 전략",
    career: 7,
    gender: "MALE",
    image: InterviewerImage2,
    tags: ["문제 정의", "지표", "우선순위"],
    description: "사용자 문제를 정의하고 제품으로 풀어내는 방식을 질문합니다.",
  },
  {
    key: "pm-growth-lead",
    name: "문가은",
    role: "PM",
    roleLabel: "PM 면접관",
    specialty: "그로스와 실험",
    career: 6,
    gender: "FEMALE",
    image: InterviewerImage4,
    tags: ["가설", "실험", "데이터"],
    description: "데이터를 바탕으로 학습하고 개선한 경험을 살펴봅니다.",
  },
  {
    key: "design-product-designer",
    name: "배수아",
    role: "DESIGN",
    roleLabel: "디자인 면접관",
    specialty: "프로덕트 디자인",
    career: 7,
    gender: "FEMALE",
    image: InterviewerImage3,
    tags: ["UX", "사용성", "시각화"],
    description: "사용자 맥락을 이해하고 설득력 있게 설계하는지를 확인합니다.",
  },
  {
    key: "design-brand-designer",
    name: "오지후",
    role: "DESIGN",
    roleLabel: "디자인 면접관",
    specialty: "브랜드 경험",
    career: 5,
    gender: "MALE",
    image: InterviewerImage1,
    tags: ["브랜드", "일관성", "협업"],
    description: "제품 경험 안에서 브랜드를 해석하고 협업한 경험을 묻습니다.",
  },
] as const satisfies readonly InterviewerTemplate[];

export const MULTI_INTERVIEW_SLOT_LABELS = [
  "기술",
  "직무·조직 적합성",
  "리더십·비즈니스",
] as const;

const MULTI_INTERVIEW_CANDIDATE_KEYS_BY_SLOT: readonly (readonly string[])[] = [
  [
    "tech-backend-architect",
    "tech-frontend-lead",
    "tech-platform-engineer",
  ],
  [
    "hr-people-partner",
    "pm-product-strategist",
    "design-product-designer",
  ],
  [
    "hr-talent-manager",
    "ceo-founder",
    "ceo-business-leader",
  ],
];

export const getInterviewerCandidatesForSlot = (slot: SlotIndex) =>
  MULTI_INTERVIEWER_TEMPLATES.filter((interviewer) =>
    MULTI_INTERVIEW_CANDIDATE_KEYS_BY_SLOT[slot].includes(interviewer.key),
  );

export const getRoleLabel = (role: InterviewerTemplateRole) =>
  MULTI_INTERVIEWER_TEMPLATES.find((interviewer) => interviewer.role === role)
    ?.roleLabel ?? role;

export type {
  InterviewerTemplate,
  InterviewerTemplateRole,
  MultiInterviewSelection,
  MultiInterviewValidation,
  SlotIndex,
} from "./type";
