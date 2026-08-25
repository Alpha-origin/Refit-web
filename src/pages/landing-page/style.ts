import styled from "styled-components";

export const Page = styled.main`
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;

  font-family: ${({ theme }) => theme.fontFamily.pretendard};

  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;

  & > section {
    width: 100%;
    min-height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
`;
