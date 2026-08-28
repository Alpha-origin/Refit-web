import { apiInstance } from "@/shared/api/axiosInstance";

const TAILOR_QUESTIONS_URL = "/api/questions/tailor";

export interface TailoredQuestion {
  questionId: number;
  intention: string;
  content: string;
  expectedAnswer: string;
  basedOn: string[];
  personaId: number;
}

const getRecord = (value: unknown) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const getNumber = (value: unknown, fallback: number) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }

  if (typeof value === "string" && value.trim()) {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return Math.trunc(parsedValue);
    }
  }

  return fallback;
};

const getStringArray = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean);
};

const getQuestionList = (payload: unknown) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  const responseRecord = getRecord(payload);
  const data = responseRecord?.data;
  const dataRecord = getRecord(data);

  if (Array.isArray(responseRecord?.questions)) {
    return responseRecord.questions;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(dataRecord?.questions)) {
    return dataRecord.questions;
  }

  return [];
};

export const normalizeTailoredQuestions = (
  payload: unknown,
  fallbackPersonaId: number,
): TailoredQuestion[] =>
  getQuestionList(payload).reduce<TailoredQuestion[]>((questions, value, index) => {
    const record = getRecord(value);
    const content = getString(record?.question ?? record?.content ?? record?.text);

    if (!content) {
      return questions;
    }

    questions.push({
      questionId: getNumber(record?.id ?? record?.questionId, index + 1),
      intention: getString(record?.category ?? record?.intention ?? record?.purpose),
      content,
      expectedAnswer: getString(record?.expectedAnswer ?? record?.answer),
      basedOn: getStringArray(record?.basedOn),
      personaId: getNumber(record?.personaId, fallbackPersonaId),
    });

    return questions;
  }, []);

export const getTailoredQuestions = async (interviewId: number) => {
  const requestUrl = `${TAILOR_QUESTIONS_URL}?interviewId=${encodeURIComponent(
    interviewId,
  )}`;

  console.log("[questions/tailor] GET request", {
    method: "GET",
    url: requestUrl,
    interviewId,
  });

  const response = await apiInstance.get(TAILOR_QUESTIONS_URL, {
    params: { interviewId },
  });

  return response.data as unknown;
};
