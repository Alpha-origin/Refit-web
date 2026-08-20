import styled from "styled-components";

export const Container = styled.section`
  position: relative;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 7.5rem;
  width: 100vw;
  min-height: 100vh;
  margin-left: -50vw;
  padding: 6.75rem 0 0;

  background: 
    radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 60%),
    radial-gradient(circle at 20% 20%, #e8eaff 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, #d8f1ff 0%, transparent 50%),
    linear-gradient(135deg, #eeeefd 0%, #e0f2fe 50%, #e8f7f5 100%);

  @media (max-width: 56.25rem) {
    gap: 6rem;
    padding: 5rem 0 0;
  }
`;