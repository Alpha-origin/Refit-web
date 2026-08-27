import { apiInstance } from "@/shared/api/axiosInstance";

const TAILOR_QUESTIONS_URL = "/api/questions/tailor";

export const getTailoredQuestions = async (interviewId: number) => {
  console.log("[questions/tailor] GET request", {
    method: "GET",
    url: TAILOR_QUESTIONS_URL,
    interviewId,
  });

  const response = await apiInstance.get(TAILOR_QUESTIONS_URL, {
    params: { interviewId },
  });

  return response.data as unknown;
};
