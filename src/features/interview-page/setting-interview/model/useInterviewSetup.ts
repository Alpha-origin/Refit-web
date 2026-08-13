import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  createInterview,
  generateMockInterview,
  savePersona,
  setActiveInterviewSessionId,
  waitForGeneratedInterview,
  type CreateInterviewPersonaType,
  type InterviewPersonaGender,
  type InterviewPersonaMajor,
  type PersonaType,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  INTERVIEW_SETTING_INTERVIEWERS,
  type InterviewDifficultyOption,
  type InterviewSettingSelectHandlers,
  type InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";

const PREPARED_PERSONA_TYPE_BY_STYLE: Record<InterviewStyleOption, PersonaType> = {
  편함: "FRIENDLY",
  일반: "NEUTRAL",
  압박: "STRESS",
};
const CREATE_PERSONA_TYPE_BY_STYLE: Record<
  InterviewStyleOption,
  CreateInterviewPersonaType
> = {
  편함: "FRIENDLY",
  일반: "NEUTRAL",
  압박: "STRESS",
};
const CAREER_BY_DIFFICULTY: Record<InterviewDifficultyOption, number> = {
  쉬움: 0,
  보통: 3,
  어려움: 5,
};
const DEFAULT_INTERVIEW_MAJOR: InterviewPersonaMajor = "BACKEND";
const DEFAULT_INTERVIEW_GENDER: InterviewPersonaGender = "MALE";

const buildUniquePersonaName = (personaName: string) =>
  `${personaName}-${Date.now().toString(36)}`;

export const useInterviewSetup = () => {
  const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] =
    useState(INTERVIEW_SETTING_DEFAULT_SELECTION.style);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState(INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty);
  const [selectedInterviewerId, setSelectedInterviewerId] =
    useState(INTERVIEW_SETTING_DEFAULT_SELECTION.interviewerId);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => navigate(-1);

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const selectedInterviewer = INTERVIEW_SETTING_INTERVIEWERS.find(
      (interviewer) => interviewer.id === selectedInterviewerId,
    );

    if (!selectedInterviewer) {
      setIsSubmitting(false);
      setErrorMessage("선택한 면접관 정보를 찾을 수 없습니다.");
      return;
    }

    const personaPayload = {
      personaName: buildUniquePersonaName(selectedInterviewer.personaName),
      major: DEFAULT_INTERVIEW_MAJOR,
      type: CREATE_PERSONA_TYPE_BY_STYLE[selectedStyle],
      career: CAREER_BY_DIFFICULTY[selectedDifficulty],
      gender: DEFAULT_INTERVIEW_GENDER,
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
    console.log("[interviews/create] request payload", personaPayload);

    const { data, errorMessage: createErrorMessage } = await createInterview(
      personaPayload,
    );

    if (createErrorMessage || !data) {
      setIsSubmitting(false);
      setErrorMessage(createErrorMessage ?? "면접 시작에 실패했습니다.");
      return;
    }

    const {
      data: generateMockData,
      errorMessage: generateMockErrorMessage,
    } = await generateMockInterview();

    if (generateMockErrorMessage || !generateMockData?.jobId) {
      setIsSubmitting(false);
      setErrorMessage(
        generateMockErrorMessage ?? "모의 면접 생성 요청에 실패했습니다.",
      );
      return;
    }

    console.log("[GET /api/v1/ai/subscribe/{jobId}] jobId", generateMockData.jobId);

    const { errorMessage: subscribeErrorMessage } =
      await waitForGeneratedInterview(generateMockData.jobId);

    if (subscribeErrorMessage) {
      setIsSubmitting(false);
      setErrorMessage(subscribeErrorMessage);
      return;
    }

    setIsSubmitting(false);

    console.log("[interviews/create] response data", data);
    console.log("[interviews/create] server sessionId", data.sessionId);
    console.log("[generate-mock] jobId", generateMockData.jobId);

    const personaId =
      data.personaId > 0 ? data.personaId : savedPersona.personaId;

    setActiveInterviewSessionId(data.sessionId);

    navigate("/main/interview/1", {
      state: {
        preparedInterview: {
          sessionId: data.sessionId,
          interviewId: data.interviewId,
          userId: data.userId,
          personaId,
          personaType: PREPARED_PERSONA_TYPE_BY_STYLE[selectedStyle],
          jobId: generateMockData.jobId,
          status: data.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
          currentQuestionIndex: data.currentQuestionIndex,
          questions: [],
        },
        interviewSetting: {
          style: selectedStyle,
          difficulty: selectedDifficulty,
          interviewerId: selectedInterviewerId,
        },
      },
    });
  };

  const select: InterviewSettingSelectHandlers = {
    difficulty: setSelectedDifficulty,
    interviewer: setSelectedInterviewerId,
    style: setSelectedStyle,
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
      interviewerId: selectedInterviewerId,
      style: selectedStyle,
    },
  };
};
