    import { apiInstance } from "@/shared/api/axiosInstance";
    import { extractErrorMessage } from "@/shared/api/errorMessage";

    const SAVE_PORTFOLIO_URL = "/api/v1/metaData/dataUpload";

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

        await apiInstance.post(SAVE_PORTFOLIO_URL, formData, {
        headers: { 
            "Content-Type": "multipart/form-data",
        },
        });

        return { errorMessage: null };
    } catch (error) {
        return {
        errorMessage: extractErrorMessage(error, "포트폴리오 저장에 실패했습니다."),
        };
    }
    };
