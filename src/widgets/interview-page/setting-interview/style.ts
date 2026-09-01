import styled, { css, keyframes } from 'styled-components';
import type {
  ActionButtonProps,
  SelectedProps,
  StyleIconProps,
} from './type';

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const focusRing = css`
  &:focus-visible {
    outline: 0.125rem solid rgba(47, 128, 237, 0.34);
    outline-offset: 0.125rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: auto;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  overflow-x: hidden;
  overflow-y: auto;
  padding: clamp(2rem, 6vh, 3.3rem) clamp(1.25rem, 6.8vw, 6.5rem)
    clamp(1.25rem, 3vh, 1.55rem);
  box-sizing: border-box;

  @media (max-width: 52rem) {
    align-items: flex-start;
    overflow-y: auto;
    padding: 0.9rem 1rem 1rem;
  }

  @media (max-height: 44rem) {
    padding-top: 0.55rem;
    padding-bottom: 0.55rem;
  }
`;

export const ContentWrapper = styled.div`
  --setting-group-height: 20.75rem;
  --setting-column-gap: 1.5rem;
  --style-option-gap: clamp(0.65rem, 1.3vh, 0.85rem);

  position: relative;
  width: min(100%, 74rem);
  height: auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(0.7rem, 1.8vh, 1.35rem);
  box-sizing: border-box;

  @media (max-width: 64rem) {
    --setting-group-height: clamp(17rem, 31vh, 20.75rem);
    width: min(100%, 68rem);
  }

  @media (max-height: 52rem) {
    --setting-column-gap: clamp(1.25rem, 3.4vh, 2rem);
    --style-option-gap: 0.45rem;
  }

  @media (max-height: 44rem) {
    --setting-group-height: clamp(14rem, 32vh, 17rem);
    --setting-column-gap: 0.75rem;
    --style-option-gap: 0.4rem;

    gap: 0.55rem;
  }

  @media (max-width: 52rem) {
    --setting-group-height: 13rem;
    --setting-column-gap: 1.5rem;

    height: auto;
    min-height: 100%;
  }
`;

export const Sections = styled.div`
  width: 100%;
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: minmax(21rem, 28.5rem) minmax(0, 1fr);
  gap: clamp(2rem, 4.4vw, 4.4rem);
  align-items: stretch;

  @media (max-width: 64rem) {
    grid-template-columns: minmax(18.5rem, 23rem) minmax(0, 1fr);
    gap: 1.75rem;
  }

  @media (max-width: 52rem) {
    grid-template-columns: 1fr;
  }

  @media (max-height: 44rem) {
    gap: 1rem;
  }
`;

export const ControlColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--setting-column-gap);
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: clamp(0.55rem, 1.5vh, 0.9rem);

  @media (max-height: 44rem) {
    gap: 0.45rem;
  }
`;

export const Title = styled.h2`
  margin: 0;
  color: #4d5570;
  font-size: clamp(1.55rem, 1.38rem + 0.34vw, 1.85rem);
  font-weight: 800;
  line-height: 1.25;

  @media (max-height: 44rem) {
    font-size: 1.12rem;
  }
`;

export const StyleOptionGroup = styled.div`
  display: grid;
  grid-template-rows: repeat(3, minmax(0, 1fr));
  height: var(--setting-group-height);
  gap: var(--style-option-gap);
`;

export const StyleOptionButton = styled.button<SelectedProps>`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr) 1.5rem;
  align-items: center;
  gap: 0.95rem;
  padding: var(--setting-option-padding-y, 0.6rem) 1.65rem
    var(--setting-option-padding-y, 0.6rem) 1.2rem;
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#d5d9e2')};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? '#eef4ff' : '#ffffff')};
  color: #171717;
  cursor: pointer;
  text-align: left;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 0.75rem 1.75rem rgba(38, 111, 224, 0.1);
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

  @media (max-width: 30rem) {
    grid-template-columns: 2.1rem minmax(0, 1fr) 1.35rem;
    padding-inline: 1rem;
  }

  @media (max-height: 44rem) {
    grid-template-columns: 2rem minmax(0, 1fr) 1.35rem;
    gap: 0.65rem;
    padding: 0.45rem 0.8rem;
  }
`;

export const StyleIcon = styled.span<StyleIconProps>`
  position: relative;
  width: 2.15rem;
  height: 2.15rem;
  border: 0.125rem solid #111111;
  border-radius: 50%;
  box-sizing: border-box;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0.58rem;
    left: 0.52rem;
    width: 0.18rem;
    height: 0.18rem;
    border-radius: 50%;
    background: #111111;
    box-shadow: 0.68rem 0 0 #111111;
  }

  span {
    position: absolute;
    left: 50%;
    bottom: ${({ $variant }) => ($variant === 'pressure' ? '0.42rem' : '0.48rem')};
    width: 0.82rem;
    height: ${({ $variant }) => ($variant === 'neutral' ? '0.12rem' : '0.42rem')};
    border: ${({ $variant }) =>
      $variant === 'neutral' ? 'none' : '0.125rem solid #111111'};
    border-top: 0;
    border-radius: 0 0 999rem 999rem;
    background: ${({ $variant }) => ($variant === 'neutral' ? '#111111' : 'transparent')};
    transform: translateX(-50%)
      ${({ $variant }) => ($variant === 'pressure' ? 'rotate(180deg)' : '')};
    transform-origin: center;
  }

  @media (max-height: 44rem) {
    width: 2rem;
    height: 2rem;
  }
`;

export const StyleTextGroup = styled.span`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const OptionLabel = styled.span`
  color: #171717;
  font-size: var(--setting-option-label-size, 1.14rem);
  font-weight: 800;
  line-height: 1.2;

  @media (max-height: 44rem) {
    font-size: 0.9rem;
  }
`;

export const OptionDescription = styled.span`
  color: #262626;
  font-size: var(--setting-option-description-size, 1rem);
  font-weight: 500;
  line-height: 1.35;

  @media (max-height: 44rem) {
    font-size: 0.76rem;
  }
`;

export const SelectionCircle = styled.span<SelectedProps>`
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.125rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#c8cbd0')};
  border-radius: 50%;
  box-sizing: border-box;

  &::after {
    content: '';
    position: absolute;
    display: ${({ $selected }) => ($selected ? 'block' : 'none')};
    left: 0.34rem;
    top: 0.18rem;
    width: 0.36rem;
    height: 0.62rem;
    border: solid #3388f7;
    border-width: 0 0.125rem 0.125rem 0;
    transform: rotate(45deg);
  }
`;

export const DifficultyGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  height: 4rem;
  gap: var(--style-option-gap);
`;

export const DifficultyButton = styled.button<SelectedProps>`
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#d5d9e2')};
  border-radius: 0.5rem;
  background: ${({ $selected }) => ($selected ? '#eef4ff' : '#ffffff')};
  color: #171717;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 0.75rem 1.75rem rgba(38, 111, 224, 0.1);
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

  @media (max-height: 44rem) {
    padding-inline: 0.4rem;
  }
`;

export const DifficultyIcon = styled.img`
  width: 2.15rem;
  height: 2.15rem;
  object-fit: contain;
  object-position: center;
  flex-shrink: 0;

  @media (max-height: 44rem) {
    width: 2rem;
    height: 2rem;
  }
`;

export const InterviewerPanel = styled.section`
  width: 100%;
  flex: 1;
  min-height: 0;
  padding: 2.1rem 3.5rem 2.6rem;
  border: 0.0625rem solid #d9dce2;
  border-radius: 1rem;
  background: #f8f9fb;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 52rem) {
    padding: 1.5rem;
    gap: 1.5rem;
  }
`;

export const InterviewerColumn = styled.div`
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(0.55rem, 1.5vh, 0.9rem);
`;

export const InterviewerOptionSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
`;

export const InterviewerOptionTitle = styled.h3`
  margin: 0;
  color: #4d5570;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.25;
`;

export const InterviewerOptionGroup = styled.div<{ $columns: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns}, minmax(0, 1fr));
  gap: 1rem;
`;

export const InterviewerOptionButton = styled.button<SelectedProps>`
  min-width: 0;
  height: 4rem;
  padding: 0 1rem;
  border: 0.0625rem solid
    ${({ $selected }) => ($selected ? '#3388f7' : '#d5d9e2')};
  border-radius: 0.6rem;
  background: ${({ $selected }) => ($selected ? '#eef4ff' : '#ffffff')};
  color: #171717;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    border-color: #3388f7;
    box-shadow: 0 0.55rem 1.2rem rgba(38, 111, 224, 0.1);
  }

  ${focusRing}

  @media (max-width: 52rem) {
    height: 3.5rem;
    padding-inline: 0.5rem;
    font-size: 0.95rem;
  }
`;

export const BottomButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: clamp(0.85rem, 2vh, 1.25rem);

  @media (max-width: 52rem) {
    margin-top: 0;
    padding-top: 0.75rem;
    padding-bottom: 0.25rem;
  }

  @media (max-width: 34rem) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0;
  color: #d14343;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.45;
  text-align: center;
`;

const baseButton = styled.button<ActionButtonProps>`
  width: min(100%, 9.5rem);
  height: clamp(2.85rem, 5.8vh, 3.35rem);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 0.5rem;
  box-sizing: border-box;
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1.2;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:disabled {
    transform: none;
    box-shadow: none;
  }

  &:not(:disabled):hover {
    transform: translateY(-0.0625rem);
  }

  ${focusRing}

  @media (max-width: 34rem) {
    width: 100%;
  }

  @media (max-height: 44rem) {
    height: 2.65rem;
    font-size: 1rem;
  }
`;

export const BackButton = styled(baseButton)`
  border: 0.0625rem solid #dde3ed;
  background: #ffffff;
  color: #171717;

  &:not(:disabled):hover {
    border-color: #cbd3df;
    box-shadow: 0 0.75rem 1.6rem rgba(15, 23, 42, 0.08);
  }
`;

export const NextButton = styled(baseButton)`
  border: 0.0625rem solid
    ${({ $disabled }) => ($disabled ? '#b9c7db' : '#257ee8')};
  background: ${({ $disabled }) => ($disabled ? '#b9c7db' : '#257ee8')};
  color: #ffffff;

  &:not(:disabled):hover {
    background: #176fd9;
    border-color: #176fd9;
    box-shadow: 0 0.85rem 1.7rem rgba(37, 126, 232, 0.2);
  }
`;

export const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.5);
`;

export const LoadingSpinner = styled.div`
  width: 4rem;
  height: 4rem;
  border: 0.25rem solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.85s linear infinite;
`;

export const LoadingMessage = styled.p`
  margin: 0;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.4;
`;
