    import axios from "axios";
    import { extractErrorMessage } from "@/shared/api/errorMessage";

    const BACKEND_REAL_URL = "https://wildcat-startle-rope.ngrok-free.dev"; 
    const SAVE_PORTFOLIO_URL = `${BACKEND_REAL_URL}/api/v1/metaData/dataUpload`;

    export interface SavePortfolioParams {
    portfolioFile: File | null;
    gitLinks: string[];
    jobRole: string;
    }

    export const savePortfolio = async ({
    portfolioFile,
    gitLinks = [],
    jobRole,
    }: SavePortfolioParams) => {
    try {
        if (!portfolioFile) {
        return { errorMessage: "포트폴리오 파일을 첨부해 주세요." };
        }

        const formData = new FormData();
        formData.append("file", portfolioFile);

        const validLinks = gitLinks.map((link) => link.trim()).filter(Boolean);
        validLinks.forEach((link) => {
        const validLink = link.startsWith("http") ? link : `https://${link}`;
        formData.append("gitUrls", validLink); 
        });

        if (jobRole) {
        formData.append("jobRole", jobRole);
        }

        const myToken = "Bearer eyJraWQiOiJhdXRoLXNlcnZlci1rZXktMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1Iiwicm9sZSI6IlJPTEVfVVNFUiIsImlzcyI6Imh0dHA6Ly9hdXRoLnRlYW0tYWxwaGEuY29tIiwiZXhwIjoxNzgzMTQ0MzI3LCJpYXQiOjE3ODMxNDM0MjcsImVtYWlsIjoia0BnbWFpbC5jb20iLCJqdGkiOiIwYjI3OTBiZC04YzY2LTQzYzItODNkNy0xZGVlMTM2ZjRkYTAifQ.QwvryruabXqu3xGWcl0cRbsp3UaTorR9mit4I2rAgGZKSXFaEbbPvjOLA6rvDiW_npko0fIGsSKIjKMMQZ2WowMBocPo_ecYY74VKpi0y-OQ_3vdMukiiqCZr67WU1pQvCxPI1qwDMeJpM-fY6FnMLUDAjLw6AUh2DAqB4tY0_2DiwiJ8jooygZLgYLMmtTBRQf6Plxob77lm140XNCwv-j7DcAODeEkcyfX40KN9UnwP1cd2BB2WGx4POL6JJCqJk_z5_VzFLnisbnRhYXpGd_oO-rFXpMyOV0Rt4j1WZaUZ0oXvsIHQZdaGNRnHjO5LO-rudpxbLT6upVTZNjI8w";

        await axios.post(SAVE_PORTFOLIO_URL, formData, {
        headers: { 
            "Content-Type": "multipart/form-data",
            Authorization: myToken
        },
        });

        return { errorMessage: null };
    } catch (error) {
        return {
        errorMessage: extractErrorMessage(error, "포트폴리오 저장에 실패했습니다."),
        };
    }
    };