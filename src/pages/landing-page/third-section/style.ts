// style.ts

import styled from "styled-components";

export const Container = styled.section`
  position: relative;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;
  /* 상하 색상 반전 (아래가 은은한 하늘색, 위가 하얀색) */
  background: linear-gradient(
    180deg,
    #f8fafc 0%,
    #edf6ff 55%,
    #dbeeff 100%
  );
  overflow: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 5.5rem 0rem 0em;

  @media (max-width: 56.25rem) {
    padding: 4.5rem 1.5rem 5rem;
  }
`;

export const Footer = styled.footer`
  width: 100%;
  height: 7.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #D1E2F8;
  font-size: 2rem;
  font-weight: 700;
  color: black;
`;