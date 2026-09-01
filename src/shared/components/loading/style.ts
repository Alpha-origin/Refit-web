import styled, { keyframes } from "styled-components";

const spin = keyframes`
    to {
        transform: rotate(360deg);
    }
`;


export const Container = styled.div`
    position: fixed;
    inset: 0;
    z-index: 1000;
    width: 100%;
    height: 100dvh;
    display: grid;
    grid-template-rows: minmax(0, 1fr);
    background-color: #f2f3f5;
    box-sizing: border-box;
    overflow: hidden;
`;

export const BackgroundImage = styled.img`
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
`;

export const LoadingBox = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 0;
    box-sizing: border-box;
`;

export const Spinner = styled.div`
    position: relative;
    width: 136px;
    height: 136px;
    display: grid;
    place-items: center;

    &::before {
        content: "";
        position: absolute;
        inset: 0;
        border: 4px solid rgba(24, 119, 242, 0.16);
        border-top-color: ${({ theme }) => theme.colors.brand.blueAction};
        border-radius: ${({ theme }) => theme.radius.circle};
        animation: ${spin} 0.9s linear infinite;
    }

    @media (max-width: 36rem) {
        width: 108px;
        height: 108px;
    }
`;

export const LoadingImage = styled.img`
    position: relative;
    z-index: 1;
    width: 112px;
    max-width: 82%;
    height: auto;
    max-height: 112px;
    display: block;
    object-fit: contain;

    @media (max-width: 36rem) {
        width: 88px;
        max-height: 88px;
    }
`;

export const Text = styled.p`
    font-size: ${({ theme }) => theme.fontSize.md};
    color: ${({ theme }) => theme.colors.text.muted};
`;
