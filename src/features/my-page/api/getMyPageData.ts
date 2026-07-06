import { authInstance, apiInstance } from "@/shared/api/axiosInstance";

export interface MyPageUser {
  id: number;
  username: string;
  nickname: string;
  email: string;
  major: string;
  provider: string;
  role: string;
  createAt: string;
}

interface UserInfoResponse {
  success: boolean;
  message: string | null;
  data?: MyPageUser;
}

export interface MyPageMetaData {
  gitUrls: string[];
  fileUrl: string;
}

interface MetaDataResponse {
  data?: MyPageMetaData;
}

const USER_INFO_URL = "/api/v1/users/me";
const META_DATA_URL = "/api/v1/metaData/getMetaData";
const META_DATA_UPLOAD_URL = "/api/v1/metaData/dataUpload";

export const getMyPageUser = async () => {
  const response = await authInstance.get<UserInfoResponse>(USER_INFO_URL);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message ?? "유저 정보를 불러오지 못했습니다.");
  }

  return response.data.data;
};

export const getMyPageMetaData = async () => {
  const response = await apiInstance.get<MyPageMetaData | MetaDataResponse>(
    META_DATA_URL,
  );
  const payload = response.data;

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  return payload as MyPageMetaData;
};

interface UploadMyPageMetaDataParams {
  file: File;
  gitUrls: string[];
}

export const uploadMyPageMetaData = async ({
  file,
  gitUrls,
}: UploadMyPageMetaDataParams) => {
  const formData = new FormData();
  formData.append("file", file);
  gitUrls.forEach((gitUrl) => {
    formData.append("gitUrls", gitUrl);
  });

  const response = await apiInstance.post<MyPageMetaData | MetaDataResponse>(
    META_DATA_UPLOAD_URL,
    formData,
  );
  const payload = response.data;

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  return payload as MyPageMetaData;
};
