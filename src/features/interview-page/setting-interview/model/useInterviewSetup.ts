import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  createInterview,
  prepareInterviewRecord,
  savePersona,
  setActiveInterviewSessionId,
  type CreateInterviewPersonaType,
  type InterviewPersonaGender,
  type InterviewLevel,
  type InterviewPersonaMajor,
  type InterviewPersonaRole,
  type InterviewTone,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  type InterviewMajorOption,
  type InterviewDifficultyOption,
  type InterviewerPersonalityOption,
  type InterviewerToneOption,
  type InterviewSettingSelectHandlers,
} from "@/shared/constants/interview-page/setting-interview";
import { getInterviewJobId } from "@/shared/storage/interviewJobId";

const TONE_BY_OPTION: Record<
  InterviewerToneOption,
  InterviewTone
> = {
  부드러운: "GENTLE",
  직설적인: "DIRECT",
  압박하는: "PRESSURING",
};

const TYPE_BY_PERSONALITY: Record<
  InterviewerPersonalityOption,
  CreateInterviewPersonaType
> = {
  친근한: "FRIENDLY",
  현실적인: "REALISTIC",
  꼼꼼한: "METICULOUS",
};

const CAREER_BY_DIFFICULTY: Record<InterviewDifficultyOption, number> = {
  쉬움: 0,
  보통: 3,
  어려움: 5,
};

const LEVEL_BY_DIFFICULTY: Record<InterviewDifficultyOption, InterviewLevel> = {
  쉬움: "EASY",
  보통: "NORMAL",
  어려움: "HARD",
};

const MAJOR_BY_OPTION: Record<InterviewMajorOption, InterviewPersonaMajor> = {
  프론트엔드: "FRONTEND",
  백엔드: "BACKEND",
};

const DEFAULT_INTERVIEW_GENDER: InterviewPersonaGender = "MALE";
const DEFAULT_INTERVIEW_ROLE: InterviewPersonaRole = "TECH";

const buildUniquePersonaName = () =>
  `맞춤 면접관-${Date.now().toString(36)}`;

export const useInterviewSetup = () => {
  const navigate = useNavigate();

  const [selectedStyle, setSelectedStyle] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.style,
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );

  const [selectedPersonality, setSelectedPersonality] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.personality,
  );

  const [selectedTone, setSelectedTone] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.tone,
  );

  const [selectedMajor, setSelectedMajor] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.major,
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => navigate(-1);

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const jobId = getInterviewJobId();

    if (!jobId) {
      setIsSubmitting(false);
      setErrorMessage("마이페이지에서 포트폴리오를 먼저 등록해주세요.");
      return;
    }

    const personaPayload: SavePersonaParams = {
      personaName: buildUniquePersonaName(),
      role: DEFAULT_INTERVIEW_ROLE,
      level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
      major: MAJOR_BY_OPTION[selectedMajor],
      type: TYPE_BY_PERSONALITY[selectedPersonality],
      career: CAREER_BY_DIFFICULTY[selectedDifficulty],
      gender: DEFAULT_INTERVIEW_GENDER,
      tone: TONE_BY_OPTION[selectedTone],
    };

    console.log("[persona/save] request payload", personaPayload);

    const { data: savedPersona, errorMessage: savePersonaErrorMessage } =
      await savePersona(personaPayload);

    if (savePersonaErrorMessage || !savedPersona) {
      setIsSubmitting(false);
      setErrorMessage(
        savePersonaErrorMessage ?? "페르소나 저장에 실패했습니다.",
      );
      return;
    }

    console.log("[persona/save] response data", savedPersona);

    const interviewPayload = {
      personaName: personaPayload.personaName,
      major: personaPayload.major,
      type: personaPayload.type,
      career: personaPayload.career,
      gender: personaPayload.gender,
    };

    console.log("[interviews/create] request payload", interviewPayload);

    const { data, errorMessage: createErrorMessage } =
      await createInterview(interviewPayload);

    if (createErrorMessage || !data) {
      setIsSubmitting(false);
      setErrorMessage(createErrorMessage ?? "면접 시작에 실패했습니다.");
      return;
    }

    console.log("[interviews/create] response data", data);
    console.log("[interviews/create] server sessionId", data.sessionId);

    const {
      data: preparedInterviewRecord,
      errorMessage: prepareInterviewErrorMessage,
    } = await prepareInterviewRecord(data.interviewId);

    if (prepareInterviewErrorMessage || !preparedInterviewRecord) {
      setIsSubmitting(false);
      setErrorMessage(
        prepareInterviewErrorMessage ?? "면접 준비에 실패했습니다.",
      );
      return;
    }

    console.log("[interviews/prepare] response data", preparedInterviewRecord);

    const personaId =
      data.personaId !== null && data.personaId > 0
        ? data.personaId
        : savedPersona.personaId;
    setActiveInterviewSessionId(data.sessionId);

    setIsSubmitting(false);

    navigate(`/main/interview/${data.interviewId}`, {
      state: {
        preparedInterview: {
          sessionId: data.sessionId,
          interviewId: preparedInterviewRecord.interviewId,
          userId: data.userId,
          personaId,
          personaName: personaPayload.personaName,
          role: personaPayload.role,
          major: personaPayload.major,
          type: personaPayload.type,
          personaType: personaPayload.type,
          level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
          career: personaPayload.career,
          gender: personaPayload.gender,
          tone: personaPayload.tone,
          jobId,
          status: data.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
          currentQuestionIndex: data.currentQuestionIndex,
          questions: [],
          mode: "SOLO",
          interviewers: [
            {
              personaId,
              name: personaPayload.personaName,
              roleLabel: "기술 면접관",
            },
          ],
        },
        interviewSetting: {
          style: selectedStyle,
          difficulty: selectedDifficulty,
          major: selectedMajor,
          personality: selectedPersonality,
          tone: selectedTone,
        },
      },
    });
  };

  const select: InterviewSettingSelectHandlers = {
    difficulty: setSelectedDifficulty,
    major: setSelectedMajor,
    personality: setSelectedPersonality,
    style: setSelectedStyle,
    tone: setSelectedTone,
  };

  return {
    errorMessage,
    isNextDisabled: isSubmitting,
    isSubmitting,
    onBack: handleBack,
    onNext: handleNext,
    select,
    selection: {
      difficulty: selectedDifficulty,
      major: selectedMajor,
      personality: selectedPersonality,
      style: selectedStyle,
      tone: selectedTone,
    },
  };
};
