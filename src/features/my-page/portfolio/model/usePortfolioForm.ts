import { useMemo, useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import axios from "axios"; 
import { savePortfolio } from "../api/savePortfolio"; 

const INITIAL_GIT_LINKS = [""];
const BACKEND_REAL_URL = "https://wildcat-startle-rope.ngrok-free.dev"; 

export const usePortfolioForm = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [portfolioFileError, setPortfolioFileError] = useState("");
  const [gitLinks, setGitLinks] = useState<string[]>(INITIAL_GIT_LINKS);
  const [jobRole, setJobRole] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const myToken = "Bearer eyJraWQiOiJhdXRoLXNlcnZlci1rZXktMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI1Iiwicm9sZSI6IlJPTEVfVVNFUiIsImlzcyI6Imh0dHA6Ly9hdXRoLnRlYW0tYWxwaGEuY29tIiwiZXhwIjoxNzgzMTQ0MzI3LCJpYXQiOjE3ODMxNDM0MjcsImVtYWlsIjoia0BnbWFpbC5jb20iLCJqdGkiOiIwYjI3OTBiZC04YzY2LTQzYzItODNkNy0xZGVlMTM2ZjRkYTAifQ.QwvryruabXqu3xGWcl0cRbsp3UaTorR9mit4I2rAgGZKSXFaEbbPvjOLA6rvDiW_npko0fIGsSKIjKMMQZ2WowMBocPo_ecYY74VKpi0y-OQ_3vdMukiiqCZr67WU1pQvCxPI1qwDMeJpM-fY6FnMLUDAjLw6AUh2DAqB4tY0_2DiwiJ8jooygZLgYLMmtTBRQf6Plxob77lm140XNCwv-j7DcAODeEkcyfX40KN9UnwP1cd2BB2WGx4POL6JJCqJk_z5_VzFLnisbnRhYXpGd_oO-rFXpMyOV0Rt4j1WZaUZ0oXvsIHQZdaGNRnHjO5LO-rudpxbLT6upVTZNjI8w";

        const response = await axios.get(`${BACKEND_REAL_URL}/api/v1/metaData/getMetaData`, {
          headers: { 
            Authorization: myToken,
          },
        });

        console.log("🔥 [조회 대성공] 포트폴리오 데이터:", response.data);

        if (response.data) {
          const fetchedUrls = response.data.gitUrls || response.data.gitLinks;
          if (fetchedUrls && fetchedUrls.length > 0) {
            setGitLinks(fetchedUrls);
          } else {
            setGitLinks(INITIAL_GIT_LINKS);
          }
          if (response.data.jobRole) {
            setJobRole(response.data.jobRole);
          }
        }
      } catch (error) {
        console.error("❌ ngrok 주소 조회 실패:", error);
        setGitLinks(INITIAL_GIT_LINKS);
      }
    };

    fetchExistingData();
  }, []);

  const isDirty = useMemo(
    () =>
      portfolioFile !== null ||
      gitLinks.some((link) => link.trim().length > 0) ||
      jobRole.trim().length > 0,
    [portfolioFile, gitLinks, jobRole],
  );

  const handlePortfolioUploadClick = () => {
    const input = fileInputRef.current;
    if (!input) return;
    input.value = "";
    input.click();
  };

  const handlePortfolioFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setPortfolioFile(null);
      setPortfolioFileError("");
      return;
    }

    const isPdfFile =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdfFile) {
      setPortfolioFile(null);
      setPortfolioFileError("PDF 파일만 업로드할 수 있습니다.");
      event.target.value = "";
      return;
    }

    setPortfolioFile(file);
    setPortfolioFileError("");
  };

  const handleGitLinkChange = (index: number, value: string) => {
    setGitLinks((previousLinks) =>
      previousLinks.map((link, linkIndex) => (linkIndex === index ? value : link)),
    );
  };

  const handleAddGitLink = () => {
    setGitLinks((previousLinks) => [...previousLinks, ""]);
  };

  const handleJobRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setJobRole(event.target.value);
  };

  const handleSave = async () => {
    if (!isDirty || isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveErrorMessage("");
    setSaveSuccessMessage("");

    const { errorMessage } = await savePortfolio({
      portfolioFile,
      gitLinks,
      jobRole,
    });

    setIsSaving(false);

    if (errorMessage) {
      setSaveErrorMessage(errorMessage);
      return;
    }

    setSaveSuccessMessage("저장되었습니다.");
  };

  return {
    fileError: portfolioFileError,
    fileInputRef,
    gitLinks,
    isDirty,
    isSaving,
    jobRole,
    onAddGitLink: handleAddGitLink,
    onGitLinkChange: handleGitLinkChange,
    onJobRoleChange: handleJobRoleChange,
    onPortfolioFileChange: handlePortfolioFileChange,
    onPortfolioUploadClick: handlePortfolioUploadClick,
    onSave: handleSave,
    saveErrorMessage,
    saveSuccessMessage,
    selectedPortfolioFile: portfolioFile,
  };
};