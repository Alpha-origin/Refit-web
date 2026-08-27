import {
  API_URL,
  chatInstance,
  ensureAccessToken,
} from "@/shared/api/axiosInstance";

import {
  getCurrentUserId,
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
  isInterviewProgressStatus,
  isPersonaType,
} from "../shared";
import type {
  PrepareInterviewParams,
  PrepareInterviewQuestion,
  PreparedInterviewData,
} from "../type";

const PREPARE_INTERVIEW_URL = "/chat/interviews";
const AI_SUBSCRIBE_URL = "/api/v1/ai/subscribe";
const AI_SUBSCRIBE_TIMEOUT_MS = 120_000;
type PrepareInterviewRequestData = PreparedInterviewData;

const waitForAiSseMessage = async (jobId: string): Promise<void> => {
  const baseUrl =
    import.meta.env.MODE === "development" ? window.location.origin : API_URL;
  const subscribeUrl = new URL(
    `${AI_SUBSCRIBE_URL}/${encodeURIComponent(jobId)}`,
    baseUrl,
  );
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => {
    abortController.abort();
  }, AI_SUBSCRIBE_TIMEOUT_MS);

  try {
    const authorizationHeader = await ensureAccessToken();

    console.log("[AI SSE] GET subscribe request", {
      method: "GET",
      jobId,
      url: subscribeUrl.toString(),
      hasAuthorization: Boolean(authorizationHeader),
    });

    const response = await fetch(subscribeUrl, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: authorizationHeader,
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
      signal: abortController.signal,
    });

    if (!response.ok) {
      throw new Error(`AI SSE request failed: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("AI SSE response stream is unavailable.");
    }

    console.log("[AI SSE] connected", {
      jobId,
      contentType: response.headers.get("content-type"),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        throw new Error("AI SSE stream closed before receiving a message.");
      }

      buffer += decoder.decode(value, { stream: true });
      const eventBlocks = buffer.split(/\r?\n\r?\n/);
      buffer = eventBlocks.pop() ?? "";

      for (const eventBlock of eventBlocks) {
        const data = eventBlock
          .split(/\r?\n/)
          .filter((line) => line.startsWith("data:"))
          .map((line) => line.slice(5).replace(/^ /, ""))
          .join("\n");

        if (!data) {
          continue;
        }

        console.log("[AI SSE] message received", {
          jobId,
          data,
        });
        await reader.cancel();
        return;
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof DOMException && error.name === "AbortError"
        ? "포트폴리오 분석 서버 연결 시간이 초과되었습니다."
        : error instanceof Error
          ? error.message
          : "포트폴리오 분석 상태를 확인하지 못했습니다.";

    console.error("[AI SSE] connection error", {
      error,
      jobId,
      message: errorMessage,
    });
    throw new Error(errorMessage);
  } finally {
    window.clearTimeout(timeoutId);
    abortController.abort();
  }
};

const normalizeQuestion = (
  value: unknown,
  index: number,
): PrepareInterviewQuestion | null => {
  const questionRecord = getRecord(value);
  const content = getTrimmedString(
    questionRecord?.content ?? questionRecord?.question ?? questionRecord?.text,
  );

  if (!content) {
    return null;
  }

  return {
    questionId:
      getNumericValue(questionRecord?.questionId ?? questionRecord?.id) ??
      index + 1,
    intention:
      getTrimmedString(questionRecord?.intention ?? questionRecord?.purpose) ??
      "",
    content,
  };
};

const buildPrepareInterviewRequest = (
  params: PrepareInterviewParams,
  sessionId: string,
): PrepareInterviewRequestData => {
  const normalizedQuestions = params.questions.map((question, index) => ({
    questionId: getNumericValue(question.questionId) ?? index + 1,
    intention: question.intention.trim(),
    content: question.content.trim(),
  }));

  return {
    sessionId,
    interviewId:
      (() => {
        const interviewId = getNumericValue(params.interviewId);
        return interviewId !== null && interviewId > 0 ? interviewId : Date.now();
      })(),
    userId:
      (() => {
        const userId = getNumericValue(params.userId);
        return userId !== null && userId >= 0 ? userId : getCurrentUserId();
      })(),
    personaId: params.personaId,
    personaName: params.personaName,
    role: params.role,
    major: params.major,
    type: params.type,
    personaType: params.personaType,
    level: params.level,
    career: params.career,
    gender: params.gender,
    jobId: params.jobId.trim(),
    status: "IN_PROGRESS",
    currentQuestionIndex: 0,
    questions: normalizedQuestions,
  };
};

const normalizePreparedInterview = (
  payload: unknown,
  fallbackData: PrepareInterviewRequestData,
): PreparedInterviewData => {
  const responseRecord = getRecord(payload);
  const responseDataRecord = getRecord(responseRecord?.data);
  const sourceRecord = responseDataRecord ?? responseRecord;
  const responseQuestions =
    sourceRecord?.questions ?? sourceRecord?.interviewQuestions;
  const normalizedQuestions = Array.isArray(responseQuestions)
    ? responseQuestions.reduce<PrepareInterviewQuestion[]>((accumulator, question, index) => {
        const normalizedQuestion = normalizeQuestion(question, index);

        if (normalizedQuestion) {
          accumulator.push(normalizedQuestion);
        }

        return accumulator;
      }, [])
    : [];
  const totalQuestionCount =
    normalizedQuestions.length > 0
      ? normalizedQuestions.length
      : fallbackData.questions.length;
  const currentQuestionIndexCandidate =
    getNumericValue(sourceRecord?.currentQuestionIndex) ??
    fallbackData.currentQuestionIndex;
  const currentQuestionIndex =
    totalQuestionCount > 0
      ? Math.min(Math.max(currentQuestionIndexCandidate, 0), totalQuestionCount - 1)
      : 0;

  return {
    sessionId: getTrimmedString(sourceRecord?.sessionId) ?? fallbackData.sessionId,
    interviewId:
      getNumericValue(sourceRecord?.interviewId) ?? fallbackData.interviewId,
    userId: getNumericValue(sourceRecord?.userId) ?? fallbackData.userId,
    personaId: getNumericValue(sourceRecord?.personaId) ?? fallbackData.personaId,
    personaName:
      getTrimmedString(sourceRecord?.personaName) ?? fallbackData.personaName,
    role: fallbackData.role,
    major: fallbackData.major,
    type: fallbackData.type,
    personaType: isPersonaType(sourceRecord?.personaType)
      ? sourceRecord.personaType
      : fallbackData.personaType,
    level: fallbackData.level,
    career: fallbackData.career,
    gender: fallbackData.gender,
    jobId: fallbackData.jobId,
    status: isInterviewProgressStatus(sourceRecord?.status)
      ? sourceRecord.status
      : fallbackData.status,
    currentQuestionIndex,
    questions: normalizedQuestions,
  };
};

export const prepareInterview = async (params: PrepareInterviewParams) => {
  const normalizedSessionId = getTrimmedString(params.sessionId);

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "면접 세션 정보가 없어 면접을 시작할 수 없습니다.",
    };
  }

  const requestData = buildPrepareInterviewRequest(params, normalizedSessionId);

  try {
    await waitForAiSseMessage(requestData.jobId);

    console.log("[AI SSE] message received, proceeding to chat/interviews", {
      jobId: requestData.jobId,
    });

    const requestPayload = {
      sessionId: requestData.sessionId,
      interviewId: requestData.interviewId,
      userId: requestData.userId,
      status: "IN_PROGRESS",
      questions: requestData.questions.map((question) => ({
        id: question.questionId,
        category: question.intention,
        question: question.content,
        personaId: requestData.personaId,
      })),
    };

    console.log("[chat/interviews] request payload", requestPayload);
    console.log("[chat/interviews] sending after SSE", { jobId: requestData.jobId });
    const response = await chatInstance.post(PREPARE_INTERVIEW_URL, requestPayload);
    const responseRecord = getRecord(response.data);

    if (responseRecord?.success === false) {
      return {
        data: null,
        errorMessage: "면접 준비에 실패했습니다.",
      };
    }

    const preparedInterview = normalizePreparedInterview(response.data, requestData);

    if (!preparedInterview.sessionId) {
      return {
        data: null,
        errorMessage: "면접 세션 정보를 받지 못했습니다.",
      };
    }

    return {
      data: preparedInterview,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 준비에 실패했습니다."),
    };
  }
};
