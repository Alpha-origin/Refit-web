import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getInterviewQuestion,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type { CurrentInterviewQuestion } from "../type";


const PREPARE_INTERVIEW_RECORD_URL = "/api/interviews";
const PREPARE_INTERVIEW_RECORD_BODY = 0;
const PREPARATION_STATUS_VALUES = [
  "NOT_REQUESTED",
  "PENDING",
  "SUCCEEDED",
  "FAILED",
] as const;

export type InterviewPreparationStatus =
  (typeof PREPARATION_STATUS_VALUES)[number];

export interface InterviewPreparationData {
  chatDelivered: boolean;
  errorMessage: string | null;
  interviewId: number;
  questions: CurrentInterviewQuestion[];
  status: InterviewPreparationStatus;
}

const getInterviewId = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const data = responseRecord?.data;
  const dataRecord = getRecord(data);

  return (
    getNumericValue(dataRecord?.interviewId ?? dataRecord?.id) ??
    getNumericValue(responseRecord?.interviewId ?? responseRecord?.id) ??
    getNumericValue(data) ??
    getNumericValue(payload)
  );
};

const getSessionId = (payload: unknown) => {
  const responseRecord = getRecord(payload);
  const dataRecord = getRecord(responseRecord?.data);

  return (
    getTrimmedString(dataRecord?.sessionId) ??
    getTrimmedString(responseRecord?.sessionId)
  );
};

export const prepareInterviewRecord = async (interviewId: number) => {
  const requestUrl = `${PREPARE_INTERVIEW_RECORD_URL}/${encodeURIComponent(
    interviewId,
  )}`;

  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    return {
      data: null,
      errorMessage: "유효한 인터뷰 ID가 없습니다.",
    };
  }

  try {
    console.log("[interviews/prepare] POST request", {
      method: "POST",
      url: requestUrl,
      interviewId,
      body: PREPARE_INTERVIEW_RECORD_BODY,
    });

    const response = await apiInstance.post(
      requestUrl,
      PREPARE_INTERVIEW_RECORD_BODY,
    );
    const responseInterviewId = getInterviewId(response.data);

    console.log("[interviews/prepare] response", {
      interviewId: responseInterviewId,
      data: response.data,
    });

    if (responseInterviewId === null || responseInterviewId <= 0) {
      return {
        data: null,
        errorMessage: "인터뷰 ID를 받지 못했습니다.",
      };
    }

    return {
      data: {
        interviewId: responseInterviewId,
        sessionId: getSessionId(response.data) ?? undefined,
      },
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(
      error,
      "면접 준비 요청에 실패했습니다.",
    );

    console.error("[interviews/prepare] error", {
      message: errorMessage,
    });

    return {
      data: null,
      errorMessage,
    };
  }
};

const isInterviewPreparationStatus = (
  value: string | null,
): value is InterviewPreparationStatus =>
  value !== null &&
  PREPARATION_STATUS_VALUES.includes(value as InterviewPreparationStatus);

export const getInterviewPreparation = async (interviewId: number) => {
  if (!Number.isInteger(interviewId) || interviewId <= 0) {
    return {
      data: null,
      errorMessage: "유효한 인터뷰 ID가 없습니다.",
    };
  }

  try {
    const response = await apiInstance.get("/api/questions/tailor", {
      params: { interviewId },
    });
    const responseRecord = getRecord(response.data);
    const sourceRecord = getRecord(responseRecord?.data) ?? responseRecord;
    const status = getTrimmedString(sourceRecord?.status)?.toUpperCase() ?? null;

    if (!isInterviewPreparationStatus(status)) {
      return {
        data: null,
        errorMessage: "면접 준비 상태를 확인하지 못했습니다.",
      };
    }

    const questions = Array.isArray(sourceRecord?.questions)
      ? sourceRecord.questions.reduce<CurrentInterviewQuestion[]>(
          (items, question) => {
            const normalizedQuestion = getInterviewQuestion(question);

            if (normalizedQuestion) {
              items.push(normalizedQuestion);
            }

            return items;
          },
          [],
        )
      : [];

    return {
      data: {
        chatDelivered: sourceRecord?.chatDelivered === true,
        errorMessage: getTrimmedString(sourceRecord?.errorMessage),
        interviewId:
          getNumericValue(sourceRecord?.interviewId) ?? interviewId,
        questions,
        status,
      } satisfies InterviewPreparationData,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 준비 상태를 확인하지 못했습니다."),
    };
  }
};
