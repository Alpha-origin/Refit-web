import styled from "styled-components";

export const Page = styled.section`
  width: 100%;
  min-height: 0;
  height: 100%;
  overflow: auto;
  padding: clamp(1rem, 2.4vw, 2.2rem);
  box-sizing: border-box;
  background: transparent;
`;

export const Content = styled.div`
  position: relative;
  width: min(100%, 74rem);
  min-height: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.65rem;
`;

export const Timer = styled.div`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  border: 0.0625rem solid #d7dce5;
  border-radius: 999rem;
  background: #fff;
  color: #4b5563;
  font-size: 1rem;
  font-weight: 700;
`;

export const TimerDot = styled.span`
  width: 0.46rem;
  height: 0.46rem;
  border-radius: 50%;
  background: #e15858;
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  border-radius: 0.75rem;
  background: rgba(239, 244, 252, 0.52);
  backdrop-filter: blur(0.12rem);
`;

export const LoadingModal = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.8rem 1rem;
  border: 0.0625rem solid #d8e0ed;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0.35rem 1.2rem rgba(55, 82, 125, 0.14);
`;

export const LoadingSpinner = styled.span`
  width: 1rem;
  height: 1rem;
  border: 0.15rem solid #cfe0f8;
  border-top-color: #2179ed;
  border-radius: 50%;
  animation: interview-loading-spin 0.75s linear infinite;

  @keyframes interview-loading-spin {
    to { transform: rotate(360deg); }
  }
`;

export const LoadingMessage = styled.span`
  color: #4e5968;
  font-size: 0.86rem;
  font-weight: 700;
`;

export const MainGrid = styled.main`
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(17rem, 0.95fr);
  grid-template-rows: minmax(11rem, 0.72fr) minmax(23rem, 1.28fr);
  gap: clamp(0.85rem, 1.5vw, 1.2rem);

  @media (max-width: 58rem) {
    grid-template-columns: 1fr;
    grid-template-rows: none;
  }
`;

export const LeftColumn = styled.div`
  min-width: 0;
  grid-row: 1 / -1;
  display: grid;
  grid-template-rows: subgrid;

  @media (max-width: 58rem) {
    grid-row: auto;
    grid-template-rows: auto auto;
    gap: 0.85rem;
  }
`;

export const RightColumn = styled.aside`
  min-width: 0;
  display: grid;
  grid-row: 1 / -1;
  grid-template-rows: subgrid;

  @media (max-width: 58rem) {
    grid-row: auto;
    grid-template-rows: auto minmax(16rem, 1fr);
    gap: 0.85rem;
  }
`;

const panel = `
  border: 0.0625rem solid #d8e0ed;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 0.35rem 1.2rem rgba(55, 82, 125, 0.08);
`;

export const QuestionPanel = styled.article`
  ${panel}
  min-height: 0;
  padding: clamp(1.5rem, 3.5vw, 3rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
`;

export const QuestionMetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const QuestionTag = styled.span`
  width: fit-content;
  padding: 0.25rem 0.55rem;
  border: 0.0625rem solid #93c0ff;
  border-radius: 999rem;
  color: #1874e8;
  font-size: 0.7rem;
  font-weight: 800;
`;

export const QuestionAudioButton = styled.button`
  flex: 0 0 auto;
  min-height: 2rem;
  padding: 0.25rem 0.65rem;
  border: 0.0625rem solid #9ac5ff;
  border-radius: 999rem;
  background: #f5f9ff;
  color: #2179ed;
  font-size: 0.74rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    opacity: 0.58;
  }

  &:hover:not(:disabled) {
    background: #eaf3ff;
  }
`;

export const QuestionSpeaker = styled.span`
  color: #4f6b91;
  font-size: 0.78rem;
  font-weight: 700;
`;

export const QuestionText = styled.h1`
  margin: 0;
  color: #151a23;
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  font-weight: 650;
  line-height: 1.48;
  word-break: keep-all;
`;

export const AnswerPanel = styled.section`
  ${panel}
  min-height: 0;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
`;

export const AnswerTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-bottom: 0.0625rem solid #dce3ee;
`;

export const Tab = styled.button<{ $active: boolean }>`
  min-height: 2.75rem;
  border: 0;
  border-right: 0.0625rem solid #dce3ee;
  background: ${({ $active }) => ($active ? "#f9fbff" : "#f5f6f8")};
  color: ${({ $active }) => ($active ? "#1f78ef" : "#555d68")};
  box-shadow: ${({ $active }) => ($active ? "inset 0 0.125rem #6caeff" : "none")};
  font-weight: 800;
  cursor: pointer;

  &:last-child { border-right: 0; }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 0;
  resize: none;
  border: 0;
  outline: 0;
  padding: 1.5rem;
  box-sizing: border-box;
  color: #273142;
  font: inherit;
  line-height: 1.6;

  &::placeholder { color: #a0a8b4; }
`;

export const VideoArea = styled.div`
  position: relative;
  min-height: 0;
  overflow: hidden;
  background: #f4f7fb;
`;

export const VideoControls = styled.div`
  position: absolute;
  left: 1rem;
  bottom: 1rem;
  display: flex;
  gap: 0.55rem;
  z-index: 2;
`;

export const RoundButton = styled.button`
  width: 2.8rem;
  height: 2.8rem;
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: #1f78ef;
  box-shadow: 0 0.2rem 0.7rem rgba(34, 66, 112, 0.2);
  font-size: 1.1rem;
  cursor: pointer;
`;

export const BottomRow = styled.div`
  min-height: 3.5rem;
  padding: 0.55rem 0.8rem;
  border-top: 0.0625rem solid #e1e6ee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const Count = styled.span`
  color: #667085;
  font-size: 0.8rem;
  font-weight: 700;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const Button = styled.button<{ $secondary?: boolean }>`
  min-height: 2.35rem;
  padding: 0 1rem;
  border: 0.0625rem solid ${({ $secondary }) => ($secondary ? "#cfd8e6" : "#1d76ea")};
  border-radius: 0.45rem;
  background: ${({ $secondary }) => ($secondary ? "#fff" : "#2179ed")};
  color: ${({ $secondary }) => ($secondary ? "#4e5968" : "#fff")};
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;

  &:disabled { opacity: 0.55; cursor: not-allowed; }
`;

export const Interviewers = styled.section`
  ${panel}
  min-height: 0;
  padding: 0.65rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.6rem, 1fr));
  gap: 0.55rem;
`;

export const InterviewerCard = styled.article<{ $active: boolean }>`
  min-width: 0;
  min-height: 0;
  padding: 0.65rem;
  border: 0.0625rem solid ${({ $active }) => ($active ? "#4d98ff" : "#dce2ea")};
  border-radius: 0.6rem;
  background: ${({ $active }) => ($active ? "#f4f9ff" : "#fff")};
  display: flex;
  flex-direction: column;
`;

export const InterviewerImage = styled.img`
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  border-radius: 0.36rem;
  object-fit: cover;
  background: #e9edf4;
`;

export const InterviewerFallback = styled.div`
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
  border-radius: 0.36rem;
  display: grid;
  place-items: center;
  background: #e7effc;
  color: #2478e9;
  font-size: 1.6rem;
  font-weight: 900;
`;

export const InterviewerName = styled.strong`
  display: block;
  margin-top: 0.55rem;
  overflow: hidden;
  color: #1f2937;
  font-size: 0.76rem;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const InterviewerRole = styled.span`
  display: block;
  margin-top: 0.25rem;
  color: #5e779c;
  font-size: 0.65rem;
  font-weight: 700;
`;

export const ActiveBadge = styled.span`
  display: block;
  width: fit-content;
  margin: 0.45rem 0 0 auto;
  padding: 0.18rem 0.38rem;
  border-radius: 999rem;
  background: #2479ed;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 800;
`;

export const MemoPanel = styled.section`
  ${panel}
  min-height: 0;
  padding: 0.8rem;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.55rem;
`;

export const MemoLabel = styled.label`
  width: fit-content;
  padding: 0.2rem 0.5rem;
  border: 0.0625rem solid #9ac5ff;
  border-radius: 999rem;
  color: #2179ed;
  font-size: 0.75rem;
  font-weight: 800;
`;

export const MemoTextArea = styled.textarea`
  width: 100%;
  min-height: 11rem;
  resize: vertical;
  padding: 1rem;
  border: 0.0625rem solid #dce2ea;
  border-radius: 0.45rem;
  box-sizing: border-box;
  color: #4b5563;
  font: inherit;
  line-height: 1.55;
  outline-color: #78b0ff;
`;
