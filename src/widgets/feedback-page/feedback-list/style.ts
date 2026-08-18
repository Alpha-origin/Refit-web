import styled, { css } from "styled-components";

interface StatusBadgeProps {
  $complete: boolean;
}

const focusRing = css`
  &:focus-visible {
    outline: 0.125rem solid rgba(26, 115, 232, 0.32);
    outline-offset: 0.125rem;
  }
`;

export const Page = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1.55rem clamp(1rem, 6.5vw, 4.4rem) 3rem;
  box-sizing: border-box;

  @media (max-width: 56rem) {
    padding: 1rem 1rem 1.5rem;
  }
`;

export const Panel = styled.section`
  width: min(100%, 59.25rem);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.7rem;
`;

export const Toolbar = styled.div`
  min-height: 1.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 0.35rem;

  @media (max-width: 34rem) {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.45rem;
  }
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #1a73e8;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.25;
`;

export const SortSelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    right: 0.25rem;
    width: 0.43rem;
    height: 0.43rem;
    border-right: 0.125rem solid #1a73e8;
    border-bottom: 0.125rem solid #1a73e8;
    pointer-events: none;
    transform: translateY(-0.12rem) rotate(45deg);
  }
`;

export const SortSelect = styled.select`
  appearance: none;
  min-height: 1.8rem;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: #1a73e8;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 800;
  line-height: 1;
  padding: 0.25rem 1.2rem 0.25rem 0.25rem;

  ${focusRing}
`;

export const List = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem 0.7rem;

  @media (max-width: 48rem) {
    grid-template-columns: 1fr;
  }
`;

export const StateCard = styled.div`
  width: 100%;
  min-height: 9rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding: 1.5rem;
  border: 0.0625rem dashed #bfd1ef;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.86);
  text-align: center;
`;

export const StateText = styled.p`
  margin: 0;
  max-width: 36rem;
  color: #4f6389;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
`;

export const RetryButton = styled.button`
  appearance: none;
  min-width: 6.5rem;
  height: 2.35rem;
  border: none;
  border-radius: 0.5rem;
  background: #1f6fe4;
  color: #ffffff;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    filter 0.2s ease;

  &:hover {
    transform: translateY(-0.05rem);
    filter: brightness(1.03);
  }

  ${focusRing}
`;

export const FeedbackCard = styled.button`
  appearance: none;
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 9.25rem;
  display: grid;
  grid-template-columns: 6.25rem minmax(0, 1fr);
  align-items: center;
  column-gap: 1.7rem;
  padding: 1rem 5.4rem 1rem 1rem;
  border: 0.0625rem solid #d8dde8;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    border-color: #9cc5fb;
    box-shadow: 0 0.65rem 1.4rem rgba(26, 115, 232, 0.08);
    transform: translateY(-0.05rem);
  }

  ${focusRing}

  @media (max-width: 56rem) {
    column-gap: 1.1rem;
    padding-right: 4.9rem;
  }

  @media (max-width: 30rem) {
    grid-template-columns: 5.35rem minmax(0, 1fr);
    min-height: 8.4rem;
    padding: 0.8rem;
  }
`;

export const CardImage = styled.img`
  width: 6.25rem;
  height: 6.8rem;
  display: block;
  border-radius: 0.18rem;
  background: #edf1f8;
  object-fit: cover;

  @media (max-width: 30rem) {
    width: 5.35rem;
    height: 5.85rem;
  }
`;

export const CardBody = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
`;

export const CardTitle = styled.h3`
  margin: 0;
  color: #30343b;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.25;
`;

export const MetaGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
`;

export const MetaLabel = styled.span`
  color: #5f6978;
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1.2;
`;

export const TagGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.28rem;
`;

export const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 1rem;
  max-width: 100%;
  padding: 0.08rem 0.34rem;
  border: 0.0625rem solid #9bc9ff;
  border-radius: 0.12rem;
  background: #eef6ff;
  color: #1376ef;
  font-size: 0.62rem;
  font-weight: 800;
  line-height: 1.15;
`;

export const CardDate = styled.p`
  margin: 0.05rem 0 0;
  color: #53606f;
  font-size: 0.66rem;
  font-weight: 600;
  line-height: 1.2;
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  position: absolute;
  top: 0.9rem;
  right: 0.8rem;
  min-height: 1.3rem;
  display: inline-flex;
  align-items: center;
  gap: 0.32rem;
  padding: 0 0.68rem;
  border: 0.0625rem solid
    ${({ $complete }) => ($complete ? "#1a73e8" : "#86bdff")};
  border-radius: 999rem;
  background: ${({ $complete }) => ($complete ? "#1a73e8" : "#f4f9ff")};
  color: ${({ $complete }) => ($complete ? "#ffffff" : "#1a73e8")};
  font-size: 0.62rem;
  font-weight: 900;
  line-height: 1;
  white-space: nowrap;

  &::after {
    content: "";
    display: ${({ $complete }) => ($complete ? "block" : "none")};
    width: 0.32rem;
    height: 0.56rem;
    border: solid #ffffff;
    border-width: 0 0.12rem 0.12rem 0;
    transform: translateY(-0.05rem) rotate(45deg);
  }

  @media (max-width: 30rem) {
    position: static;
    grid-column: 1 / -1;
    justify-self: start;
    margin-top: 0.15rem;
  }
`;
