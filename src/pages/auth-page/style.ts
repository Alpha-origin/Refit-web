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
    radial-gradient(circle at 17% 12%, rgba(137, 222, 236, 0.72) 0 8rem, transparent 19rem),
    radial-gradient(circle at 49% 53%, rgba(255, 255, 255, 0.92) 0 12rem, transparent 24rem),
    linear-gradient(132deg, #f2f3f5 44%, #e9f0ff 86%);

  &::before {
    content: "";
    position: absolute;
    top: -17.5rem;
    left: -14rem;
    width: min(88rem, 105vw);
    height: 44rem;
    border-radius: 50%;
    background: linear-gradient(108deg, rgba(157, 237, 239, 0.88) 0%, rgba(94, 181, 242, 0.92) 82%);
    filter: blur(0.15rem);
    transform: rotate(-4deg);
    pointer-events: none;
  }

  @media (max-width: 60rem) {
    height: auto;
    min-height: 100vh;
    flex-direction: column;
    overflow-y: auto;

    &::before {
      top: -10rem;
      left: -15rem;
      width: 56rem;
      height: 25rem;
    }
  }
`;
export const FullOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6); /* 반투명 배경 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 메인 콘텐츠 위에 위치 */
  backdrop-filter: blur(2px); /* 선택: 흐림 효과 */
`;