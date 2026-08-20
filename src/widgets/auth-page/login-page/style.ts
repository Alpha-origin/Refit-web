import styled from "styled-components";

export const Section = styled.section`
  position: relative;
  width: 50%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6.7rem 2rem 4rem 1.8rem;
  box-sizing: border-box;
  overflow-y: auto;

  @media (max-width: 60rem) {
    width: 100%;
    min-height: auto;
    padding: 0 1.5rem 3rem;
    justify-content: center;
  }
`;

export const AuthNav = styled.nav`
  position: fixed;
  top: 1.45rem;
  right: 1.75rem;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 0.875rem;

  @media (max-width: 60rem) {
    top: 1rem;
    right: 1rem;
    gap: 0.875rem;
  }
`;

export const NavTextButton = styled.button`
  background: none;
  border: none;
  color: #3388f7;
  padding: 0.5rem 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #002655;
  }
`;

export const NavPrimaryButton = styled.button`
  background: #3388f7;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  min-height: 2.25rem;
  padding: 0.55rem 1rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 1rem;
  font-weight: 500;
  line-height: 1;
  cursor: pointer;

  &:hover {
    background: #2975d7;
  }
`;

export const Panel = styled.div`
  width: min(23.2rem, calc(100% - 2rem));
  min-height: 22rem;
  margin-left: clamp(0rem, 4vw, 5rem);
  padding: 4rem 3rem 2.15rem;
  border-radius: 0.75rem;
  background-color: #fcfaff;
  box-shadow: 0.0625rem 0.9375rem 3.125rem rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: stretch;

  @media (max-width: 60rem) {
    margin-left: 0;
    padding: 2.5rem 1.8rem 2rem;
  }
  padding-bottom: 60px;
`;

export const Title = styled.h2`
  margin: 0 0 1.8rem;
  color: ${({ theme }) => theme.colors.brand.blue};
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  font-size: 1.5rem;
  font-weight: 600;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const InputWrapper = styled.div`
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  margin: 0 0 0.55rem;
  color: rgba(0, 0, 0, 0.8);
  font-size: 0.88rem;
  font-weight: 500;
  letter-spacing: 0.0175rem;
`;

export const InputBox = styled.div`
  width: 100%;
  height: 2.45rem;
  padding: 0 0.8rem;
  border: 0.0625rem solid rgba(186, 186, 186, 0.6);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  overflow: hidden;
    &:focus-within {
    border-color: rgba(26, 115, 232, 0.58);
    box-shadow: 0 0 0 0.1875rem rgba(26, 115, 232, 0.12);
  }
`;

export const InputIcon = styled.img`
  width: 0.9rem;
  height: 0.9rem;
  flex: 0 0 auto;
  opacity: 0.72;
`;

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: none;
  background-color: transparent;
  color: #222222;
  font-size: 0.75rem;
  font-weight: 400;
  outline: none;

  &::placeholder {
    color: rgba(118, 122, 130, 0.7);
    opacity: 1;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-text-fill-color: #2478e8;
    caret-color: #2478e8;
    -webkit-box-shadow: 0 0 0 62.5rem #fcfaff inset;
    box-shadow: 0 0 0 62.5rem #fcfaff inset;
    transition: background-color 9999s ease-out;
  }
`;

export const ErrorMessage = styled.p`
  margin: 0.5rem 0 0 1rem;
  color: #ff4d4f;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const StatusMessage = styled.p`
  margin: 0.25rem 0 0 1rem;
  color: #ff4d4f;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 2.55rem;
  margin: 0.15rem 0 0;
  border: none;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.brand.blue};
  font-family: ${({ theme }) => theme.fontFamily.A2Z};
  color: #ffffff;
  box-shadow:
    inset 0 0.35rem 0.7rem rgba(53, 106, 185, 0.09),
    inset 0 -0.0625rem 0.0625rem rgba(151, 193, 255, 0.4);
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;

  &:hover {
    background-color: #1767d4;
  }

  &:disabled {
    background-color: #8cb5ef;
    cursor: not-allowed;
  }
`;

export const LinkWrapper = styled.div`
  margin-top: 1.45rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LinkText = styled.button`
  border: none;
  background: transparent;
  color: #2478e8;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
`;

export const Divider = styled.span`
  color: #2478e8;
  font-size: 0.85rem;
`;
