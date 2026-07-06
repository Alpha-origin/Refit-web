import { useEffect, useMemo, useState } from "react";

import {
  getMyPageMetaData,
  getMyPageUser,
  type MyPageMetaData,
  type MyPageUser,
} from "@/features/my-page/api/getMyPageData";
import { usePortfolioForm } from "@/features/my-page/portfolio/model/usePortfolioForm";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";

import * as S from "./style";

const MyPage = () => {
  const [user, setUser] = useState<MyPageUser | null>(null);
  const [metaData, setMetaData] = useState<MyPageMetaData | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userErrorMessage, setUserErrorMessage] = useState<string | null>(null);

  const initialGitUrls = useMemo(
    () => metaData?.gitUrls ?? [],
    [metaData?.gitUrls],
  );
  const portfolioForm = usePortfolioForm({
    initialGitUrls,
    onUploadSuccess: setMetaData,
  });

  useEffect(() => {
    let isActive = true;

    const fetchUser = async () => {
      setIsUserLoading(true);
      setUserErrorMessage(null);

      try {
        const nextUser = await getMyPageUser();

        if (isActive) {
          setUser(nextUser);
        }
      } catch (error) {
        if (isActive) {
          setUser(null);
          setUserErrorMessage(
            extractErrorMessage(error, "유저 정보를 불러오지 못했습니다."),
          );
        }
      } finally {
        if (isActive) {
          setIsUserLoading(false);
        }
      }
    };

    void fetchUser();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const fetchMetaData = async () => {
      try {
        const nextMetaData = await getMyPageMetaData();

        if (isActive) {
          setMetaData(nextMetaData);
        }
      } catch {
        if (isActive) {
          setMetaData(null);
        }
      }
    };

    void fetchMetaData();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <S.Page>
      <PersonalInfo
        errorMessage={userErrorMessage}
        isLoading={isUserLoading}
        user={user}
      />
      <Portfolio {...portfolioForm} />
    </S.Page>
  );
};

export default MyPage;
