import axios from "axios";
import type {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import {
  clearAccessToken,
  getAccessToken,
  syncAccessTokenFromResponse,
} from "./accessToken";

const resolveServerUrl = (url?: string) => {
  if (!url) return "";
  const normalizedUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  return normalizedUrl.replace(/\/+$/, "");
};

export const AUTH_URL = resolveServerUrl(import.meta.env.VITE_AUTH_URL);
export const API_URL = resolveServerUrl(import.meta.env.VITE_API_URL);
export const CHAT_URL = resolveServerUrl(import.meta.env.VITE_CHAT_URL);

export const authInstance = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const apiInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "" : API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export const chatInstance = axios.create({
  baseURL: CHAT_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

const refreshInstance = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const goToLoginPage = () => {
  window.location.href = "/login";
};

const tryRefreshSession = async () => {
  try {
    const response = await refreshInstance.post("/api/v1/auth/refresh");
    const refreshedAccessToken = syncAccessTokenFromResponse({
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    });
    return Boolean(refreshedAccessToken);
  } catch {
    return false;
  }
};

const getReadyAccessToken = async (shouldRefreshBeforeRequest: boolean) => {
  const currentAccessToken = getAccessToken();
  if (currentAccessToken || !shouldRefreshBeforeRequest) {
    return currentAccessToken;
  }

  const refreshed = await tryRefreshSession();
  return refreshed ? getAccessToken() : null;
};

export const ensureAccessToken = async () => {
  const authorizationHeader = await getReadyAccessToken(true);

  if (!authorizationHeader) {
    throw new Error("로그인 토큰을 찾지 못했습니다. 다시 로그인해 주세요.");
  }

  return authorizationHeader;
};

const addAuthorizationInterceptor = (
  instance: AxiosInstance,
  options: { refreshBeforeRequest?: boolean } = {},
) => {
  instance.interceptors.request.use(async (config) => {
    const authorizationHeader = await getReadyAccessToken(
      options.refreshBeforeRequest ?? false,
    );
    if (!authorizationHeader) return config;

    const nextHeaders = axios.AxiosHeaders.from(config.headers) as AxiosHeaders;
    if (!nextHeaders.has("Authorization")) {
      nextHeaders.set("Authorization", authorizationHeader);
    }
    config.headers = nextHeaders;
    return config;
  });
};

const addFormDataInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use((config) => {
    if (!(config.data instanceof FormData)) {
      return config;
    }

    const nextHeaders = axios.AxiosHeaders.from(
      config.headers,
    ) as AxiosHeaders;
    nextHeaders.delete("Content-Type");
    config.headers = nextHeaders;

    return config;
  });
};

const addAccessTokenSyncInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use((response) => {
    syncAccessTokenFromResponse({
      data: response.data,
      headers: response.headers as Record<string, unknown>,
    });
    return response;
  });
};

const addRefreshInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as
        | RetryableRequestConfig
        | undefined;
      const isRefreshRequest =
        originalRequest?.url?.includes("/api/v1/auth/refresh") ?? false;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        !isRefreshRequest
      ) {
        originalRequest._retry = true;
        const refreshed = await tryRefreshSession();
        if (refreshed) {
          const nextHeaders = axios.AxiosHeaders.from(
            originalRequest.headers,
          ) as AxiosHeaders;
          nextHeaders.delete("Authorization");
          originalRequest.headers = nextHeaders;

          return instance(originalRequest);
        }
      }

      if (error.response?.status === 401) {
        clearAccessToken();
        goToLoginPage();
      }
      return Promise.reject(error);
    },
  );
};

addAccessTokenSyncInterceptor(authInstance);
addAccessTokenSyncInterceptor(apiInstance);
addAccessTokenSyncInterceptor(chatInstance);
addRefreshInterceptor(authInstance);
addRefreshInterceptor(apiInstance);
addRefreshInterceptor(chatInstance);
addFormDataInterceptor(apiInstance);
addAuthorizationInterceptor(authInstance);
addAuthorizationInterceptor(apiInstance, { refreshBeforeRequest: true });
addAuthorizationInterceptor(chatInstance, { refreshBeforeRequest: true });
