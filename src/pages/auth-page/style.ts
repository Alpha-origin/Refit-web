import styled from "styled-components";

import type { AuthPageStyleProps } from "@/pages/auth-page/type";

export const Container = styled.main.attrs<AuthPageStyleProps>(({ $isLogin }) => ({
  "data-is-login": String($isLogin),
}))<AuthPageStyleProps>`
  width: 100vw;
  height: 100vh;
  min-height: 42rem;
  display: flex;
  position: relative;
  overflow: hidden;

  background:
    /* 왼쪽: #AFF3FF (가로 폭을 85%로 넓혀 우측으로 크게 당기고, 세로는 85%로 축소하여 높이 감량) */
    radial-gradient(ellipse 85% 85% at 0% -5%, #AFF3FF 0%, rgba(175, 243, 255, 0.8) 40%, rgba(255, 255, 255, 0) 75%),
    /* 오른쪽: #61C2FF (기존 유지) */
    radial-gradient(ellipse 65% 80% at 100% -5%, #61C2FF 0%, rgba(97, 194, 255, 0.85) 35%, rgba(255, 255, 255, 0) 70%),
    /* 중앙: #8BDCFF (기존 유지) */
    radial-gradient(ellipse 55% 85% at 50% -10%, #8BDCFF 0%, rgba(139, 220, 255, 0.75) 40%, rgba(255, 255, 255, 0) 75%),
    /* 바탕 흰색 베이스 */
    linear-gradient(180deg, #edf7ff 0%, #ffffff 78%);

  @media (max-width: 60rem) {
    height: auto;
    min-height: 100vh;
    flex-direction: column;
    overflow-y: auto;
  }
`;

export const FullOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  backdrop-filter: blur(2px);
`;