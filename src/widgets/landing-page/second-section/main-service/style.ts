import { motion } from "framer-motion";
import styled from "styled-components";
import type { ServiceCardProps, ServiceRowProps } from "./types";

export const ContentMotion = styled(motion.div)`
  width: 100%;
`;

export const Header = styled(motion.div)`
  text-align: center;
  margin-bottom: 6rem;
  font-weight: 200;
  font-family: 'Wave', sans-serif;
`;

export const SubTitle = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.brand.blueLight};
  font-size: 1.5rem;
  margin-bottom: 1.35rem;
  font-family: 'Pretendard', sans-serif;
  font-weight: 500;
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

export const ServiceGrid = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: min(100%, 72rem);
  margin: 0 auto;
  /* min-height 및 justify-content 제거 */

  @media (max-width: 56.25rem) {
    width: 100%;
  }
`;

export const ServiceRow = styled(motion.div)<ServiceRowProps>`
  display: flex;
  justify-content: ${({ $align }) =>
    $align === "right" ? "flex-end" : "flex-start"};
  width: 100%;
  
  margin-bottom: 3rem; 


  @media (max-width: 56.25rem) {
    justify-content: flex-start;
    margin-bottom: 1.5rem; 
  }
`;

export const ServiceCard = styled.article<ServiceCardProps>`
  display: flex;
  flex-direction: column;
  width: min(100%, 42rem);
  align-items: ${({ $align }) =>
  $align === "right" ? "flex-end" : "flex-start"};
  text-align: ${({ $align }) => $align};
    min-height: auto; 

  @media (max-width: 56.25rem) {
    width: 100%;
    align-items: flex-start;
    text-align: left;
  }
`;

export const CardTitle = styled.h3`
  margin: 0 0 0.125rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-size: 1.15rem;
  font-weight: 500;

  @media (max-width: 56.25rem) {
    font-size: 1.15rem;
  }
`;

export const CardHeading = styled.p`
  margin: 0 0 0.5rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.6rem;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: -0.05rem;
  padding-top: 0.7rem;
  font-family: 'A2Z', sans-serif;

  @media (max-width: 56.25rem) {
    font-size: 1.45rem;
  }
`;


export const CardDescription = styled.p`
  margin: 0.5rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.15rem;
  font-weight: 400;
  line-height: 1.2;
  

  span {
    display: block;
  }

  span + span {
    margin-top: 0;
  }

  @media (max-width: 56.25rem) {
    margin-top: 0.4rem;
    font-size: 0.875rem;
    line-height: 1.6;
  }
`;
