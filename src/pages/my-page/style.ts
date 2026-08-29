import styled from "styled-components";

export const Page = styled.main`
  width: min(calc(100% - 2rem), 57rem);
  min-height: 100%;
  display: grid;
  grid-template-columns: 14.75rem minmax(0, 1fr);
  align-items: start;
  gap: 1.5rem;
  margin: 0 auto;
  padding: 0.2rem 0 2.75rem;

  @media (min-width: 90rem) {
    width: min(calc(100% - 4rem), 60.25rem);
    grid-template-columns: 15.625rem minmax(0, 1fr);
    gap: 1.75rem;
    padding-top: 0.5rem;
  }

  @media (max-width: 56rem) {
    width: min(calc(100% - 1.8rem), 42rem);
    grid-template-columns: minmax(0, 1fr);
    gap: 1.25rem;
  }
`;
