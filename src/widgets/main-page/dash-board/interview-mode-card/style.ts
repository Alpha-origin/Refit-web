import styled, { css } from "styled-components";

import type { InterviewModeCardVariant } from "./type";

interface VariantProps {
  $variant: InterviewModeCardVariant;
}

interface ReversedProps {
  $isReversed: boolean;
}

export const Card = styled.article`
  position: relative;
  width: 100%;
  min-height: 0;
  padding: 0.7rem;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 0.625rem 2rem rgba(0, 0, 0, 0.08);
`;

export const CardInner = styled.div`
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.35rem;

  @media (max-width: 72rem) {
    grid-template-columns: 1fr;
    gap: 1.35rem;
  }
`;

export const Banner = styled.div<ReversedProps>`
  position: relative;
  height: 100%;
  min-height: 0;
  border-radius: 1rem;
  overflow: hidden;
  order: ${({ $isReversed }) => ($isReversed ? 2 : 1)};

  @media (max-width: 72rem) {
    order: 1;
    height: 18rem;
  }

  @media (max-width: 48rem) {
    height: 14rem;
  }
`;

export const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  user-select: none;
  -webkit-user-drag: none;
`;

export const BannerCopy = styled.div`
  position: absolute;
  left: 1.75rem;
  bottom: 1.35rem;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 72rem) {
    left: 1.25rem;
    bottom: 1rem;
  }
`;

export const BannerBadge = styled.button<VariantProps>`
  min-width: 6rem;
  height: 2.35rem;
  padding: 0 1.2rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0;
  border-radius: 0.5rem;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  ${({ $variant }) =>
    $variant === "dark"
      ? css`
          background-color: #ffffff;
          color: #2774df;
          box-shadow: 0 0.25rem 0.75rem rgba(0, 45, 110, 0.18);
        `
      : css`
          background-color: #0c66de;
          color: #ffffff;
          box-shadow: 0 0.25rem 0.75rem rgba(12, 102, 222, 0.24);
        `}

  @media (max-width: 72rem) {
    height: 2rem;
    padding: 0 1rem;
    font-size: 0.875rem;
  }
`;

export const BannerTitle = styled.h2<VariantProps>`
  margin: 1rem 0 0;
  color: ${({ $variant }) => ($variant === "dark" ? "#ffffff" : "#2774df")};
  font-size: clamp(2.15rem, 3.2vw, 3.8rem);
  font-weight: 200;
  line-height: 1.1;
  letter-spacing: -0.08rem;
  white-space: nowrap;
`;

export const Content = styled.div<ReversedProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
  order: ${({ $isReversed }) => ($isReversed ? 1 : 2)};
  padding: ${({ $isReversed }) =>
    $isReversed ? "0.2rem 0 0.2rem 0.65rem" : "0.2rem 0.65rem 0.2rem 0"};

  @media (max-width: 72rem) {
    order: 2;
    padding: 0;
  }
`;

export const DescriptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

export const CheckIcon = styled.img<ReversedProps>`
  width: 1.95rem;
  height: 1.95rem;
  display: block;
  flex-shrink: 0;
  object-fit: contain;
  margin-left: ${({ $isReversed }) => ($isReversed ? "auto" : "0")};
`;

export const Description = styled.p<ReversedProps>`
  margin: 0;
  flex: ${({ $isReversed }) => ($isReversed ? "0 1 auto" : "1")};
  color: #4b4b4b;
  font-size: clamp(1rem, 1.4vw, 1.25rem);
  font-weight: 400;
  line-height: 1.35;
  letter-spacing: -0.03rem;
  word-break: keep-all;
`;

export const AiBadge = styled.span<ReversedProps>`
  order: ${({ $isReversed }) => ($isReversed ? -1 : 0)};
  min-width: 5rem;
  height: 3rem;
  padding: 0 1.6rem;
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 0.0625rem solid rgba(0, 65, 150, 0.1);
  border-radius: 999rem;
  background-color: rgba(255, 255, 255, 0.95);
  color: #486fe6;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1;

  @media (max-width: 72rem) {
    min-width: 5rem;
    height: 2.9rem;
    font-size: 1.5rem;
  }
`;

export const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.35rem;
  align-items: end;
  margin: 1.4rem 0 1rem;

  @media (max-width: 72rem) {
    margin: 1rem 0 0.75rem;
  }
`;

export const FeatureItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  text-align: center;
`;

export const FeatureDescription = styled.p`
  margin: 0;
  width: 100%;
  color: #4b4b4b;
  font-size: clamp(0.95rem, 1.25vw, 1.2rem);
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: -0.02rem;
  word-break: keep-all;
`;

export const FeatureTitle = styled.strong<VariantProps>`
  display: block;
  width: 100%;
  color: #2874df;
  font-size: ${({ $variant }) =>
    $variant === "dark"
      ? "clamp(1.15rem, 1.5vw, 1.72rem)"
      : "clamp(1.38rem, 1.82vw, 2.08rem)"};
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.05rem;
  word-break: keep-all;
`;

export const StartButton = styled.button<VariantProps>`
  width: 100%;
  height: 3.55rem;
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
  border-radius: 0.875rem;
  font-size: clamp(1rem, 1.4vw, 1.35rem);
  font-weight: 550;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;

  ${({ $variant }) =>
    $variant === "dark"
      ? css`
          border: 0.0625rem solid rgba(0, 65, 150, 0.14);
          background-color: #ffffff;
          color: #2371dc;
          box-shadow: 0 0.2rem 0.45rem rgba(0, 65, 150, 0.1);

          &:hover:not(:disabled) {
            transform: translateY(-0.0625rem);
            border-color: rgba(35, 113, 220, 0.32);
            box-shadow: 0 0.35rem 0.8rem rgba(0, 65, 150, 0.14);
          }

          &:disabled {
            border-color: rgba(0, 65, 150, 0.1);
            background-color: #ffffff;
            color: #7e97ba;
          }
        `
      : css`
          border: none;
          background-color: #2371dc;
          color: #ffffff;
          box-shadow: 0 0.2rem 0.45rem rgba(0, 65, 150, 0.22);

          &:hover:not(:disabled) {
            transform: translateY(-0.0625rem);
            background-color: #1d68cf;
            box-shadow: 0 0.35rem 0.8rem rgba(0, 65, 150, 0.22);
          }

          &:disabled {
            background-color: #9bb7dd;
          }
        `}

  &:disabled {
    box-shadow: none;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 72rem) {
    height: 3.1rem;
  }
`;
