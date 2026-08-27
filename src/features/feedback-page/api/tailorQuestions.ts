import { apiInstance } from "@/shared/api/axiosInstance";

const TAILOR_QUESTIONS_URL = "/api/questions/tailor";

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
