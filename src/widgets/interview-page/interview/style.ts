import styled, { css } from "styled-components";

interface ModeButtonProps {
  $active: boolean;
}

interface CameraVideoProps {
  $visible: boolean;
}

interface VoiceLayoutProps {
  $voiceMode?: boolean;
}

interface TextLayoutProps {
  $textMode?: boolean;
}

interface VoiceLevelProps {
  $voiceLevel?: number;
}

export const Container = styled.section<VoiceLayoutProps & TextLayoutProps>`
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-height: 0;
  align-self: stretch;
  overflow: hidden;
  padding: clamp(1rem, 2.1vh, 1.45rem) clamp(1rem, 6.9vw, 5.5rem)
    clamp(0.9rem, 2vh, 1.4rem);
  box-sizing: border-box;

  ${({ $voiceMode, $textMode }) =>
    ($voiceMode || $textMode) &&
    css`
      display: flex;
      align-items: stretch;
      justify-content: center;
    `}

  @media (max-width: 54rem) {
    overflow: auto;
    padding: 0.9rem 1rem 1rem;
  }

  @media (max-height: 42rem) {
    overflow-y: auto;
    padding-top: 0.55rem;
    padding-bottom: 0.75rem;
  }
`;

export const Content = styled.div<VoiceLayoutProps & TextLayoutProps>`
  width: min(100%, 64.5rem);
  height: 100%;
  min-height: 0;
  margin: 0 auto;
  display: grid;
  grid-template-rows: auto minmax(0, auto) auto;
  align-content: center;
  gap: clamp(0.9rem, 2.5vh, 1.55rem);
  box-sizing: border-box;

  @media (max-width: 54rem) {
    height: auto;
    min-height: 100%;
    align-content: start;
  }

  @media (max-height: 42rem) {
    gap: 0.8rem;
  }
`;

export const TopControlBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const TopControls = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
`;

export const TimerPill = styled.div`
  min-width: 6.8rem;
  height: 2.05rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  padding: 0 1rem;
  border-radius: 999rem;
  background: #eceef2;
  color: #3f3f46;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
`;

export const TimerDot = styled.span`
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: #db4545;
`;

export const InterviewStage = styled.div<VoiceLayoutProps & TextLayoutProps>`
  width: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: ${({ $voiceMode }) =>
    $voiceMode ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)"};
  gap: clamp(0.9rem, 1.5vw, 1rem);
  align-items: stretch;
  justify-items: stretch;
  height: ${({ $voiceMode }) => ($voiceMode ? "clamp(22rem, 49vh, 25.6rem)" : "auto")};

  @media (max-width: 54rem) {
    height: auto;
    grid-template-columns: 1fr;
  }

  @media (max-height: 42rem) {
    height: ${({ $voiceMode }) => ($voiceMode ? "clamp(17.5rem, 54vh, 20.5rem)" : "auto")};
  }
`;

export const InterviewBody = styled.div<VoiceLayoutProps & TextLayoutProps>`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  gap: clamp(0.9rem, 1.8vh, 1.2rem);
  align-content: stretch;
  justify-items: stretch;

  ${({ $voiceMode, $textMode }) =>
    $voiceMode
      ? css`
          grid-template-rows: minmax(0, 1fr);
        `
      : $textMode
        ? css`
            height: auto;
            grid-template-rows: auto auto;
          `
        : css`
            grid-template-rows: auto;
        `}
`;

export const PreviewSection = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  justify-content: center;
`;

export const PreviewFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border-radius: 0.5rem;
  background: #f6faff;
  border: 0.0625rem solid #d6dce6;
  box-shadow: none;

  @media (max-width: 54rem) {
    height: clamp(18rem, 48vh, 24rem);
  }

  @media (max-width: 34rem) {
    height: 16rem;
  }
`;

export const CameraVideo = styled.video<CameraVideoProps>`
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scaleX(-1);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.2s ease;
`;

export const PreviewOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.04), rgba(15, 23, 42, 0.04));
`;

export const CameraFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.55rem;
  padding: 0 1.5rem;
  text-align: center;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.76), rgba(237, 244, 255, 0.96));
`;

export const CameraFallbackTitle = styled.strong`
  color: #1a73e8;
  font-size: clamp(1rem, 1.35vw, 1.18rem);
  font-weight: 800;
  letter-spacing: -0.04rem;
`;

export const CameraFallbackText = styled.p`
  color: #5d6b86;
  font-size: 0.84rem;
  line-height: 1.45;
`;

export const QuestionCard = styled.article<VoiceLayoutProps & TextLayoutProps>`
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: clamp(2.5rem, 5vh, 3.6rem) clamp(2rem, 4vw, 4rem);
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.96);
  border: 0.0625rem solid #d8dde7;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;

  ${({ $textMode }) =>
    $textMode &&
    css`
      min-height: clamp(18rem, 36vh, 22rem);
    `}

  @media (max-width: 54rem) {
    height: clamp(18rem, 48vh, 24rem);
  }

  @media (max-width: 34rem) {
    height: 16rem;
    padding: 1.6rem 1.25rem;
  }

  @media (max-height: 42rem) {
    padding: 1.55rem 1.6rem;
  }
`;

export const QuestionLabel = styled.span`
  color: #006cff;
  font-size: clamp(0.78rem, 0.9vw, 0.9rem);
  font-weight: 800;
  line-height: 1.2;

  @media (max-height: 42rem) {
    font-size: 0.74rem;
  }
`;

export const QuestionBody = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const QuestionContentStack = styled.div`
  width: min(100%, 30rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.35rem, 3.2vh, 2.25rem);

  @media (max-height: 42rem) {
    gap: 1rem;
  }
`;

export const QuestionText = styled.p`
  width: 100%;
  margin: 0;
  text-align: center;
  color: #111111;
  font-size: clamp(1.28rem, 1.6vw, 1.58rem);
  font-weight: 500;
  line-height: 1.34;

  @media (max-width: 34rem) {
    font-size: 1.12rem;
  }

  @media (max-height: 42rem) {
    font-size: 1.08rem;
  }
`;

export const ModeControl = styled.div`
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  height: 2.05rem;
  padding: 0.18rem;
  border-radius: 0.35rem;
  border: 0.0625rem solid #dde2eb;
  background: #eef0f4;
  box-shadow: 0 0.25rem 0.8rem rgba(15, 23, 42, 0.08);
`;

export const ModeButton = styled.button<ModeButtonProps>`
  min-width: 3.65rem;
  height: 1.65rem;
  padding: 0 0.65rem;
  border: none;
  border-radius: 0.25rem;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#006cff" : "#111111")};
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: ${({ $active }) => ($active ? "#ffffff" : "#e4e9f1")};
  }
`;

export const ActionRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;

  @media (max-width: 34rem) {
    gap: 0.7rem;
  }
`;

const actionButtonBase = styled.button`
  width: 9.9rem;
  min-height: 2.75rem;
  border: 0.0625rem solid transparent;
  border-radius: 999rem;
  font-size: 1.15rem;
  font-weight: 800;
  cursor: pointer;
  flex: 0 0 auto;
  box-shadow: 0 0.35rem 0.75rem rgba(37, 126, 232, 0.2);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
  }

  @media (max-width: 34rem) {
    width: 8.8rem;
    min-height: 2.55rem;
    font-size: 1rem;
  }
`;

export const SecondaryAction = styled(actionButtonBase)`
  background: rgba(255, 255, 255, 0.96);
  border-color: #d8e6fb;
  color: #111111;
  box-shadow: 0 0.35rem 0.75rem rgba(15, 23, 42, 0.08);

  &:hover {
    background: #f7fbff;
    border-color: #b8d5ff;
  }
`;

export const PrimaryAction = styled(actionButtonBase)`
  background: #3388f7;
  color: #ffffff;

  &:hover {
    background: #2a79e5;
  }
`;

export const IconActionButton = styled.button`
  position: relative;
  width: 2.55rem;
  height: 2.55rem;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 0.35rem 0.95rem rgba(76, 112, 171, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1684ef;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
    box-shadow: 0 0.5rem 1.1rem rgba(76, 112, 171, 0.18);
  }

  @media (max-width: 34rem) {
    width: 2.35rem;
    height: 2.35rem;
  }
`;

export const CameraGlyph = styled.span`
  position: relative;
  width: 1.2rem;
  height: 0.82rem;
  border-radius: 0.16rem;
  background: currentColor;

  &::after {
    content: "";
    position: absolute;
    right: -0.45rem;
    top: 0.17rem;
    width: 0;
    height: 0;
    border-top: 0.23rem solid transparent;
    border-bottom: 0.23rem solid transparent;
    border-left: 0.45rem solid currentColor;
  }
`;

export const MicGlyph = styled.span`
  position: relative;
  width: 0.68rem;
  height: 1.1rem;
  border: 0.16rem solid currentColor;
  border-radius: 999rem;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -0.42rem;
    width: 0.16rem;
    height: 0.42rem;
    border-radius: 999rem;
    background: currentColor;
    transform: translateX(-50%);
  }

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -0.58rem;
    width: 0.8rem;
    height: 0.16rem;
    border-radius: 999rem;
    background: currentColor;
    transform: translateX(-50%);
  }
`;

export const InlineVisualizerWrap = styled.div<VoiceLevelProps>`
  width: min(100%, 6.4rem);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: ${({ $voiceLevel = 0 }) =>
    `drop-shadow(0 0 ${0.55 + $voiceLevel * 0.95}rem rgba(51, 136, 247, ${0.14 + $voiceLevel * 0.18}))`};
  transition: filter 90ms linear;

  &::before {
    content: "";
    position: absolute;
    width: clamp(5.2rem, 6.4vw, 6.2rem);
    aspect-ratio: 1;
    border-radius: 999rem;
    background: radial-gradient(
      circle,
      rgba(51, 136, 247, 0.2) 0%,
      rgba(51, 136, 247, 0.08) 45%,
      rgba(51, 136, 247, 0) 72%
    );
    opacity: ${({ $voiceLevel = 0 }) => 0.12 + $voiceLevel * 0.32};
    transform: ${({ $voiceLevel = 0 }) => `scale(${0.92 + $voiceLevel * 0.48})`};
    transition:
      opacity 90ms linear,
      transform 90ms linear;
  }
`;

export const InlineVisualizerIcon = styled.img<VoiceLevelProps>`
  width: clamp(4.7rem, 5.8vw, 5.8rem);
  position: relative;
  z-index: 1;
  height: auto;
  display: block;
  filter: none;
  transform-origin: center;
  transform: ${({ $voiceLevel = 0 }) =>
    `scale(${0.94 + $voiceLevel * 0.42}) translateY(${-0.2 * $voiceLevel}rem)`};
  opacity: ${({ $voiceLevel = 0 }) => 0.88 + $voiceLevel * 0.12};
  transition:
    transform 90ms linear,
    opacity 90ms linear;

  @media (max-height: 42rem) {
    width: 4.2rem;
  }
`;

export const TextAnswerCard = styled.div`
  width: 100%;
  min-height: clamp(8rem, 18vh, 11rem);
  padding: 1rem 1.2rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.97);
  border: 0.0625rem solid #dce3ee;
  box-shadow: none;
  min-width: 0;
  box-sizing: border-box;

  @media (max-height: 42rem) {
    min-height: 6.2rem;
    padding: 0.8rem 1rem;
  }
`;

export const TextAnswerField = styled.textarea`
  width: 100%;
  height: auto;
  min-height: clamp(4.4rem, 7vh, 5.1rem);
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  color: #111111;
  font-size: clamp(1.15rem, 1.45vw, 1.32rem);
  line-height: 1.7;

  &::placeholder {
    color: #98a2b3;
  }

  @media (max-height: 56rem) {
    min-height: 3.9rem;
    font-size: 1rem;
    line-height: 1.55;
  }
`;

export const TextActionRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  box-sizing: border-box;

  & > button {
    flex: 0 0 auto;
  }

  @media (max-width: 40rem) {
    gap: 0.75rem;

    & > button {
      width: clamp(7.6rem, 42vw, 9.6rem);
    }
  }

  @media (max-height: 42rem) {
    gap: 0.85rem;
  }
`;
