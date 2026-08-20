import { API_URL, apiInstance } from "@/shared/api/axiosInstance";

import {
  getErrorMessage,
  getRecord,
  getTrimmedString,
} from "../shared";
import type { GenerateMockResponse } from "../type";

const GENERATE_MOCK_URL = "/api/v1/ai/generate";

const getApiTargetUrl = (path: string) => (API_URL ? `${API_URL}${path}` : path);

const normalizeGenerateMockResponse = (
  payload: unknown,
): GenerateMockResponse => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;

  return {
    jobId: getTrimmedString(sourceRecord?.job_id ?? sourceRecord?.jobId),
    status: getTrimmedString(sourceRecord?.status),
    message: getTrimmedString(sourceRecord?.message),
  };
};

export const generateMockInterview = async () => {
  try {
    console.log("[POST /api/v1/ai/generate] request start", {
      apiTargetUrl: getApiTargetUrl(GENERATE_MOCK_URL),
      browserUrl: GENERATE_MOCK_URL,
      mode: import.meta.env.MODE,
    });
    const response = await apiInstance.post(GENERATE_MOCK_URL);
    const data = normalizeGenerateMockResponse(response.data);

    console.log("[POST /api/v1/ai/generate] response data", {
      data: response.data,
      jobId: data.jobId,
      status: response.status,
    });

    return {
      data,
      errorMessage: null,
    };
  } catch (error) {
    console.error("[POST /api/v1/ai/generate] error", error);

    return {
      data: null,
      errorMessage: getErrorMessage(
        error,
        "모의 면접 생성 요청에 실패했습니다.",
      ),
    };
  }
};
