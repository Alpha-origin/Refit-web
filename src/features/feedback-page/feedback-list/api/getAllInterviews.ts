import { apiInstance } from "@/shared/api/axiosInstance";

export interface InterviewPersona {
  id?: number;
  personaName?: string;
  major?: string;
  type?: string;
  career?: number;
  gender?: string;
}

export interface InterviewSummary {
  id: number;
  userId?: number;
  persona?: InterviewPersona | null;
  sessionId?: string;
  status?: string;
  createdAt?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
}

const GET_ALL_INTERVIEWS_URL = "/api/interviews/getAll";
const GET_FEEDBACK_URL = "/api/answer";

export interface FrequentWord {
  word: string;
  count: number;
}

export interface QuestionFeedback {
  questionId?: string;
  questionContent?: string;
  intention?: string;
  userAnswer?: string;
  modelAnswer?: string;
  strengths?: string[];
  improvements?: string[];
  comment?: string;
}

export interface FeedbackData {
  feedbackId?: number;
  interviewId?: number;
  sessionId?: string;
  status?: string;
  totalScore?: number;
  intentAlignmentScore?: number;
  reliabilityScore?: number;
  summary?: string;
  strengths?: string[];
  improvements?: string[];
  frequentWords?: FrequentWord[];
  answeredCount?: number;
  questionCount?: number;
  errorMessage?: string;
  feedbacks?: QuestionFeedback[];
  createdAt?: string;
}

interface FeedbackApiResponse {
  success: boolean;
  data?: FeedbackData;
}

const normalizeInterviews = (
  payload: InterviewSummary[] | ApiResponse<InterviewSummary[]>,
) => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

export const getAllInterviews = async () => {
  const response = await apiInstance.get<
    InterviewSummary[] | ApiResponse<InterviewSummary[]>
  >(GET_ALL_INTERVIEWS_URL);

  return normalizeInterviews(response.data);
};

export const getFeedback = async (sessionId: string) => {
  const response = await apiInstance.get<FeedbackApiResponse>(GET_FEEDBACK_URL, {
    params: { sessionId },
  });

  return response.data?.data ?? null;
};
