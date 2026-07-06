import {
  API_URL,
  ensureAccessToken,
} from "@/shared/api/axiosInstance";

import {
  getTrimmedString,
} from "../shared";

const SUBSCRIBE_GENERATED_INTERVIEW_URL = "/api/v1/ai/subscribe";
const QUESTION_GENERATED_EVENT = "question-generated";
const QUESTION_GENERATION_FAILED_EVENT = "question-generation-failed";
const SUBSCRIBE_ERROR_MESSAGE =
  "질문 생성 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";

interface ServerSentEvent {
  event: string;
  dataLines: string[];
}

const getApiTargetUrl = (path: string) => (API_URL ? `${API_URL}${path}` : path);

const getSubscribeUrl = (jobId: string) => {
  const path = `${SUBSCRIBE_GENERATED_INTERVIEW_URL}/${encodeURIComponent(jobId)}`;

  if (!API_URL) {
    return path;
  }

  return `${API_URL}${path}`;
};

const parseEventData = (data: string) => {
  const trimmedData = data.trim();

  if (!trimmedData) {
    return null;
  }

  try {
    return JSON.parse(trimmedData) as unknown;
  } catch {
    return trimmedData;
  }
};

const stringifyValue = (value: unknown) => {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const applyEventLine = (event: ServerSentEvent, line: string) => {
  if (!line || line.startsWith(":")) {
    return;
  }

  const separatorIndex = line.indexOf(":");
  const field = separatorIndex >= 0 ? line.slice(0, separatorIndex) : line;
  const rawValue = separatorIndex >= 0 ? line.slice(separatorIndex + 1) : "";
  const value = rawValue.startsWith(" ") ? rawValue.slice(1) : rawValue;

  if (field === "event") {
    event.event = value;
  }

  if (field === "data") {
    event.dataLines.push(value);
  }
};

export const waitForGeneratedInterview = async (
  jobId: string,
  signal?: AbortSignal,
) => {
  const normalizedJobId = getTrimmedString(jobId);

  if (!normalizedJobId) {
    return {
      errorMessage: "jobId가 없어 면접 질문 생성 상태를 확인할 수 없습니다.",
    };
  }

  try {
    const subscribeUrl = getSubscribeUrl(normalizedJobId);
    const subscribePath =
      `${SUBSCRIBE_GENERATED_INTERVIEW_URL}/${encodeURIComponent(normalizedJobId)}`;
    const apiTargetUrl = getApiTargetUrl(subscribePath);

    console.log("[GET /api/v1/ai/subscribe/{jobId}] request ready", {
      apiTargetUrl,
      browserUrl: subscribeUrl,
      jobId: normalizedJobId,
      mode: import.meta.env.MODE,
      apiUrl: API_URL || null,
    });

    let authorizationHeader = "";

    try {
      authorizationHeader = await ensureAccessToken();
    } catch (error) {
      console.error(
        "[GET /api/v1/ai/subscribe/{jobId}] blocked before request",
        {
          apiTargetUrl,
          browserUrl: subscribeUrl,
          error,
          jobId: normalizedJobId,
          reason: "access token not ready",
        },
      );

      return {
        errorMessage: SUBSCRIBE_ERROR_MESSAGE,
      };
    }

    console.log("[GET /api/v1/ai/subscribe/{jobId}] fetch start", {
      apiTargetUrl,
      browserUrl: subscribeUrl,
      jobId: normalizedJobId,
    });

    const response = await fetch(subscribeUrl, {
      credentials: "include",
      headers: {
        Accept: "text/event-stream",
        Authorization: authorizationHeader,
        "ngrok-skip-browser-warning": "true",
      },
      signal,
    });

    console.log("[GET /api/v1/ai/subscribe/{jobId}] response received", {
      contentType: response.headers.get("content-type"),
      jobId: normalizedJobId,
      redirected: response.redirected,
      status: response.status,
      statusText: response.statusText,
      subscribeUrl,
      url: response.url,
    });

    if (!response.ok) {
      console.error("[GET /api/v1/ai/subscribe/{jobId}] request failed", {
        jobId: normalizedJobId,
        status: response.status,
        statusText: response.statusText,
        apiTargetUrl,
        url: subscribeUrl,
      });

      return {
        errorMessage: SUBSCRIBE_ERROR_MESSAGE,
      };
    }

    if (!response.body) {
      console.error("[GET /api/v1/ai/subscribe/{jobId}] missing response body", {
        jobId: normalizedJobId,
        status: response.status,
        apiTargetUrl,
        url: subscribeUrl,
      });

      return {
        errorMessage: SUBSCRIBE_ERROR_MESSAGE,
      };
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let event: ServerSentEvent = {
      event: "message",
      dataLines: [],
    };

    const resetEvent = () => {
      event = {
        event: "message",
        dataLines: [],
      };
    };

    const handleEvent = () => {
      if (
        event.event !== QUESTION_GENERATED_EVENT &&
        event.event !== QUESTION_GENERATION_FAILED_EVENT
      ) {
        resetEvent();
        return null;
      }

      const payload = parseEventData(event.dataLines.join("\n"));
      console.log("[GET /api/v1/ai/subscribe/{jobId}] event received", {
        event: event.event,
        jobId: normalizedJobId,
        payload,
      });

      if (event.event === QUESTION_GENERATION_FAILED_EVENT) {
        console.error(
          "[GET /api/v1/ai/subscribe/{jobId}] question-generation-failed",
          {
            event: event.event,
            jobId: normalizedJobId,
            payload,
            payloadJson: stringifyValue(payload),
            responseStatus: response.status,
            responseUrl: response.url,
            subscribeUrl,
            apiTargetUrl,
          },
        );
        resetEvent();

        return "failure";
      }

      console.log(
        "[GET /api/v1/ai/subscribe/{jobId}] 원질문이 완성되었습니다.",
      );
      resetEvent();

      return "success";
    };

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line === "") {
          const result = handleEvent();

          if (result === "success") {
            return { errorMessage: null };
          }

          if (result === "failure") {
            return {
              errorMessage: SUBSCRIBE_ERROR_MESSAGE,
            };
          }

          continue;
        }

        applyEventLine(event, line);
      }
    }

    buffer += decoder.decode();

    if (buffer) {
      applyEventLine(event, buffer);
    }

    if (event.dataLines.length > 0 || event.event !== "message") {
      const result = handleEvent();

      if (result === "success") {
        return { errorMessage: null };
      }

      if (result === "failure") {
        return {
          errorMessage: SUBSCRIBE_ERROR_MESSAGE,
        };
      }
    }

    console.error(
      "[GET /api/v1/ai/subscribe/{jobId}] question-generated event not received",
      {
        jobId: normalizedJobId,
      },
    );

    return {
      errorMessage: SUBSCRIBE_ERROR_MESSAGE,
    };
  } catch (error) {
    console.error("[GET /api/v1/ai/subscribe/{jobId}] error", {
      error,
      jobId: normalizedJobId,
    });

    return {
      errorMessage: SUBSCRIBE_ERROR_MESSAGE,
    };
  }
};
