import footerGraphic from "@/shared/img/landing-page/repitMain.svg?url";
import styled from "styled-components";

export const Container = styled.footer`
  width: 100%;
  padding: 0;
  background: transparent;
`;

export const Inner = styled.div`
  position: relative;
  width: 100%;
  height: 10rem;
  overflow: hidden;
  border-radius: 0; 
  padding: 0 8em;
  background: #D1E2F8;

  @media (max-width: 56.25rem) {
    min-height: 13rem;
    height: auto;
  }
`;

export const LeftSection = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  height: 100%;
  padding-left: ${({ theme }) => theme.spacing.xxl};

  @media (max-width: 56.25rem) {
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    gap: 1.25rem;
    padding: 2.25rem 1.5rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.5rem;
  font-weight: 50;
  line-height: 1.3;
  letter-spacing: -0.05rem;
  font-family: 'Wave', sans-serif;
  margin-right: 1.5rem;

  @media (max-width: 56.25rem) {
    font-size: 1.125rem;
  }
`;

export const StartButton = styled.button`
  width: 9.5rem;
  height: 2.7rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.brand.blueAction};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1rem;
  font-weight: 400;
  font-family: 'A2Z', sans-serif;
  cursor: pointer;
  box-shadow: 0 0.1875rem 0.5rem ${({ theme }) => theme.colors.shadow.blue};
  transition: 0.2s ease;

  &:hover {
    transform: translateY(-0.125rem);
    background-color: #478eec;
  }

  @media (max-width: 56.25rem) {
    width: 100%;
    max-width: 10.5rem;
    height: 3.25rem;
  }
`;

export const GraphicImage = styled.div`
  position: absolute;
  right: 4rem;
  top: 0rem;
  z-index: 1;
  width: 35rem;
  height: 105%;
  pointer-events: none;
  background: url(${footerGraphic}) right center / auto 100% no-repeat;

  @media (max-width: 56.25rem) {
    width: 24rem;
    height: 100%;
  }
`;
