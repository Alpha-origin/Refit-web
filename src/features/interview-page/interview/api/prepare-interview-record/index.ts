import { apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getNumericValue,
  getRecord,
} from "../shared";

const PREPARE_INTERVIEW_RECORD_URL = "/api/interviews";
const PREPARE_INTERVIEW_RECORD_BODY = 0;

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

export const prepareInterviewRecord = async () => {
  try {
    console.log("[interviews/prepare] POST request", {
      method: "POST",
      url: PREPARE_INTERVIEW_RECORD_URL,
      body: PREPARE_INTERVIEW_RECORD_BODY,
    });

    const response = await apiInstance.post(
      PREPARE_INTERVIEW_RECORD_URL,
      PREPARE_INTERVIEW_RECORD_BODY,
    );
    const interviewId = getInterviewId(response.data);

    console.log("[interviews/prepare] response", {
      interviewId,
      data: response.data,
    });

    if (interviewId === null || interviewId <= 0) {
      return {
        data: null,
        errorMessage: "인터뷰 ID를 받지 못했습니다.",
      };
    }

    return {
      data: { interviewId },
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
