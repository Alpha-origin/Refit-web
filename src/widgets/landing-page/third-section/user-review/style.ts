import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import type { ReviewChipProps, ReviewTrackProps } from "./types";

const scrollLeft = keyframes`
  from {
    transform: translate3d(var(--review-offset), 0, 0);
  }

  to {
    transform: translate3d(calc(var(--review-offset) - 50%), 0, 0);
  }
`;

export const ContentMotion = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
  padding-top: 0;
  padding-bottom: 2rem;
  overflow: hidden;
`;

export const Header = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 8rem;
  font-weight: 200;
  text-align: center;
  font-family: 'Wave', sans-serif;

  @media (max-width: 56.25rem) {
    margin-bottom: 3.5rem;
  }
`;

export const SubTitle = styled.span`
  color: ${({ theme }) => theme.colors.brand.blueLight};
  margin: 0 0 1rem;
  font-weight: 500;
  font-size: 1.5rem;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fontFamily.pretendard};
`;

export const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.8rem;
  font-weight: 200;
  line-height: 1.15;
  letter-spacing: -0.05rem;

  @media (max-width: 56.25rem) {
    font-size: 1.8rem;
  }
`;

export const ReviewStage = styled(motion.div)`
  position: relative;
  width: 250vw;
  left: calc(50% - 50vw);
  margin-left: 0;
  margin-right: 0;
  overflow: hidden;
`;

export const ReviewRow = styled.div`
  width: 100%;

  & + & {
    margin-top: clamp(1.45rem, 3vw, 2.5rem);
  }
`;

export const ReviewTrack = styled.div<ReviewTrackProps>`
  --review-offset: ${({ $offset }) => $offset};

  display: flex;
  width: max-content;
  animation: ${scrollLeft} ${({ $duration }) => $duration}s linear infinite;
  animation-play-state: ${({ $isPaused }) => ($isPaused ? "paused" : "running")};
  will-change: transform;
`;

export const ReviewSet = styled.div`
  display: flex;
  flex: 0 0 auto;
  gap: clamp(1.5rem, 3vw, 2.6rem);
  padding-right: clamp(1.5rem, 3vw, 2.6rem);
`;

export const ReviewChip = styled.div<ReviewChipProps>`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  height: ${({ $height }) => $height ?? "auto"};
  width: ${({ $width }) => $width}; 

  align-self: center;
  box-sizing: border-box;

  max-width: 90vw; 
  padding: 1.25rem 4rem;

  border: 1px solid rgba(64, 64, 64, 0.16);
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, ${({ $opacity }) => $opacity});
  box-shadow:
    -0.94rem 2.31rem 1.5rem rgba(145, 145, 145, 0.03),
    -0.44rem 1.06rem 1.13rem rgba(145, 145, 145, 0.04),
    -0.13rem 0.25rem 0.63rem rgba(145, 145, 145, 0.05);
  backdrop-filter: blur(7.5px);
  color: ${({ theme }) => theme.colors.text.strong};
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: 0;
  text-align: center;
  white-space: normal;

  @media (max-width: 56.25rem) {
    width: min(${({ $width }) => $width}, calc(100vw - 2rem));
    height: auto; 
    min-height: 4.25rem;
    padding: 0.9rem 1.4rem;
    font-size: 1rem;
  }
`;