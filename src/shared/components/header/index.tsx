import {
  clearActiveInterviewSessionId,
  disconnectInterviewSocket,
  getActiveInterviewSessionId,
  quitInterview,
} from "@/features/interview-page/interview/api";
import { clearAccessToken } from "@/shared/api/accessToken";
import { useEnsureCurrentUser } from "@/shared/model/useEnsureCurrentUser";
import { useUserStore } from "@/shared/store/userStore";
import Repit from "@/shared/img/logo/Repit-logo.svg?url";
import { useLocation, useNavigate } from "react-router-dom";
import * as S from "./style";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname.toLowerCase().replace(/\/+$/, "") || "/";

  useEnsureCurrentUser();
  const nickname = useUserStore((state) => state.nickname);
  const name = useUserStore((state) => state.name);
  const resetUser = useUserStore((state) => state.reset);
  const displayName = nickname || name || "회원";

  const isInterviewPage =
    pathname === "/main" ||
    pathname.startsWith("/main/interview") ||
    pathname.startsWith("/main/setting/interview");
  const isFeedbackPage =
    pathname === "/main/feedback/list" ||
    pathname.startsWith("/main/feedback/detail/") ||
    pathname.startsWith("/main/feedback/overall/");
  const isMypage = pathname === "/main/mypage";

  const quitActiveInterviewSession = () => {
    if (!pathname.startsWith("/main/interview")) {
      return;
    }

    const sessionId = getActiveInterviewSessionId(location.state);

    if (!sessionId) {
      return;
    }

    clearActiveInterviewSessionId();
    disconnectInterviewSocket(sessionId);
    void quitInterview(sessionId);
  };

  const handleNavigate = (path: string) => {
    quitActiveInterviewSession();
    navigate(path);
  };

  const handleLogout = () => {
    quitActiveInterviewSession();
    clearAccessToken();
    resetUser();
    navigate("/login");
  };

  return (
    <S.Header>
      <S.LogoImage src={Repit} alt="Repit" onClick={() => handleNavigate("/main")} />

      <S.TopButtons>
        <S.TopButton
          onClick={() => handleNavigate("/main")}
          $active={isInterviewPage}
        >
          면접
        </S.TopButton>
        <S.TopButton
          onClick={() => handleNavigate("/main/feedback/list")}
          $active={isFeedbackPage}
        >
          피드백
        </S.TopButton>
        <S.TopButton
          onClick={() => handleNavigate("/main/mypage")}
          $active={isMypage}
        >
          마이페이지
        </S.TopButton>
      </S.TopButtons>

      <S.StatusButtons>
        <S.LogoutButton onClick={handleLogout}>로그아웃</S.LogoutButton>
        <S.StatusButton>{displayName}님</S.StatusButton>
      </S.StatusButtons>
    </S.Header>
  );
};

export default Header;