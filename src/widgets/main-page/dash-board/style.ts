import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
  max-width: 108rem;
  margin: 0 auto;
  padding: 0 1.35rem 0;
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;

  @media (max-width: 72rem) {
    height: auto;
    grid-template-rows: auto auto;
  }

  @media (max-width: 64rem) {
    padding: 0 1rem 0;
  }
`;
