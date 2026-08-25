import axios from "axios";

const getRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  return value as Record<string, unknown>;
};

const looksLikeHtmlPayload = (value: string) => {
  const sample = value.slice(0, 1000).toLowerCase();

  return /<!doctype\s+html|<html(?:\s|>)|<head(?:\s|>)|<body(?:\s|>)|<meta(?:\s|>)|<link(?:\s|>)|<script(?:\s|>)/.test(
    sample,
  );
};

const getContentType = (headers: unknown) => {
  const record = getRecord(headers);

  if (!record) {
    return "";
  }

  const contentType = record["content-type"] ?? record["Content-Type"];

  return typeof contentType === "string" ? contentType.toLowerCase() : "";
};

const getTrimmedString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || looksLikeHtmlPayload(trimmedValue)) {
    return null;
  }

  return trimmedValue;
};

const getMessageFromValue = (value: unknown, depth = 0): string | null => {
  if (depth > 4) {
    return null;
  }

  const directMessage = getTrimmedString(value);

  if (directMessage) {
    return directMessage;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const nextMessage = getMessageFromValue(item, depth + 1);

      if (nextMessage) {
        return nextMessage;
      }
    }

    return null;
  }

  const record = getRecord(value);

  if (!record) {
    return null;
  }

  for (const key of [
    "message",
    "error",
    "detail",
    "title",
    "statusText",
    "reason",
  ]) {
    const nextMessage = getMessageFromValue(record[key], depth + 1);

    if (nextMessage) {
      return nextMessage;
    }
  }

  return getTrimmedString(record.code);
};

export const extractErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }

    if (getContentType(error.response.headers).includes("text/html")) {
      return fallback;
    }

    const responseMessage = getMessageFromValue(error.response.data);

    if (responseMessage) {
      return responseMessage;
    }

    return fallback;
  }

  const nestedMessage = getMessageFromValue(error);

  if (nestedMessage) {
    return nestedMessage;
  }

  if (error instanceof Error) {
    const errorMessage = getTrimmedString(error.message);

    if (errorMessage) {
      return errorMessage;
    }
  }

  return fallback;
};
