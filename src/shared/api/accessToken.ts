const TOKEN_RECORD_KEYS = new Set([
  "accesstoken",
  "access_token",
  "token",
  "authorization",
]);
let accessToken: string | null = null;

const normalizeTokenKey = (key: string) => key.toLowerCase().replace(/-/g, "_");

export const normalizeAccessToken = (value?: string | null) => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  return /^Bearer\s+/i.test(trimmedValue)
    ? trimmedValue
    : `Bearer ${trimmedValue}`;
};

const getHeaderToken = (headers?: unknown) => {
  if (!headers || typeof headers !== "object") {
    return null;
  }

  const headerRecord = headers as Record<string, unknown> & {
    get?: (key: string) => unknown;
  };
  const authorizationByGetter =
    typeof headerRecord.get === "function"
      ? headerRecord.get("authorization")
      : null;

  if (typeof authorizationByGetter === "string") {
    return normalizeAccessToken(authorizationByGetter);
  }

  const headerAuthorization =
    typeof headerRecord.authorization === "string"
      ? headerRecord.authorization
      : typeof headerRecord.Authorization === "string"
        ? headerRecord.Authorization
        : null;

  return normalizeAccessToken(headerAuthorization);
};

const getTokenFromRecord = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  for (const [key, tokenValue] of Object.entries(record)) {
    const normalizedKey = normalizeTokenKey(key);
    if (normalizedKey.includes("refresh")) {
      continue;
    }

    if (TOKEN_RECORD_KEYS.has(normalizedKey) && typeof tokenValue === "string") {
      return normalizeAccessToken(tokenValue);
    }
  }

  for (const [key, nestedValue] of Object.entries(record)) {
    const normalizedKey = normalizeTokenKey(key);
    if (normalizedKey.includes("refresh")) {
      continue;
    }

    const nestedToken = getTokenFromRecord(nestedValue);
    if (nestedToken) {
      return nestedToken;
    }
  }

  return null;
};

export const getAccessToken = () => accessToken;

export const setAccessToken = (token?: string | null) => {
  accessToken = normalizeAccessToken(token);
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const syncAccessTokenFromResponse = (params: {
  data?: unknown;
  headers?: unknown;
}) => {
  const nextToken = getHeaderToken(params.headers) ?? getTokenFromRecord(params.data);

  if (!nextToken) {
    return null;
  }

  setAccessToken(nextToken);
  return nextToken;
};
