import styled from "styled-components";

export const PersonalInfoWrapper = styled.section`
  position: relative;
  width: 80%;
  min-height: 18.5em;
  padding: 1.9rem 2.3rem 2rem;
  background-color: #ffffff;
  border-radius: 1.25rem;
  box-shadow: 0 1.1rem 2.8rem rgba(169, 181, 205, 0.14);
  margin: 0 auto;
  margin-top: -1.65rem;

  @media (max-width: 48rem) {
    min-height: auto;
    padding: 1.5rem 1.4rem 1.75rem;
  }
`;

export const Title = styled.h2`
  margin: 0 0 2.6rem;
  color: #46506a;
  font-size: clamp(1.4rem, 2.5vw, 1.8rem);
  font-weight: 600;
  line-height: 1.2;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-left: 2.25rem;
  margin-top: -0.5rem;

  @media (max-width: 48rem) {
    margin-left: 0;
    gap: 1.2rem;
  }
`;

export const StatusText = styled.p`
  margin: -0.5rem 0 0 2.25rem;
  color: #55607b;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.5;

  @media (max-width: 48rem) {
    margin-left: 0;
  }
`;

export const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  align-items: center;
  column-gap: 0.65rem;

  @media (max-width: 36rem) {
    grid-template-columns: 6rem minmax(0, 1fr);
  }
`;

export const Label = styled.span`
  color: #4c91f3;
  font-size: clamp(1.05rem, 1.9vw, 1.4rem);
  font-weight: 600;
  line-height: 1;
`;

export const Value = styled.span`
  color: #55607b;
  font-size: clamp(0.95rem, 1.6vw, 1.25rem);
  font-weight: 700;
  line-height: 1.35;
  word-break: break-all;
`;

export const EditInput = styled.input`
  width: 100%;
  max-width: 20rem;
  height: 2.4rem;
  padding: 0 0.75rem;
  border: 0.0625rem solid #c8d6f0;
  border-radius: 0.5rem;
  outline: none;
  color: #33415c;
  font-size: clamp(0.95rem, 1.6vw, 1.15rem);
  font-weight: 600;
  background-color: #ffffff;

  &:focus {
    border-color: #1976e8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  margin: 0.4rem 0 0 2.25rem;
  color: #e14d4d;
  font-size: 0.85rem;
  font-weight: 600;
`;

export const EditButton = styled.button`
  position: absolute;
  right: 1.7rem;
  bottom: 1rem;
  min-width: 7.4rem;
  height: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 0.5rem;
  padding: 0 1rem;

  background-color: #1976e8;
  color: #ffffff;

  font-size: 0.82rem;
  font-weight: 800;
  cursor: pointer;

  box-shadow: 0 0.25rem 0.6rem rgba(25, 118, 232, 0.25);
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: #0f67d6;
    transform: translateY(-0.0625rem);
  }

  &:disabled {
    background-color: #9db8e3;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 48rem) {
    position: static;
    display: inline-flex;
    margin-top: 1.8rem;
  }
`;