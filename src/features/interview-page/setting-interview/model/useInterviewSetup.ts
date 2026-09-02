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
  type InterviewPersonaTone,
  type PersonaType,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  INTERVIEW_SETTING_INTERVIEWERS,
  type InterviewDifficultyOption,
  type InterviewerPersonalityOption,
  type InterviewerSpecialtyOption,
  type InterviewerToneOption,
  type InterviewerId,
  type InterviewSettingSelectHandlers,
  type InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";
import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";

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

const LEVEL_BY_DIFFICULTY: Record<InterviewDifficultyOption, InterviewLevel> = {
  쉬움: "EASY",
  보통: "MEDIUM",
  어려움: "HARD",
};

const DEFAULT_INTERVIEW_GENDER: InterviewPersonaGender = "FEMALE";
const DEFAULT_INTERVIEW_ROLE: InterviewPersonaRole = "TECH";

const TONE_BY_OPTION: Record<InterviewerToneOption, InterviewPersonaTone> = {
  부드러운: "GENTLE",
  직설적인: "DIRECT",
  압박하는: "PRESSURING",
};

const INTERVIEWER_IMAGE_BY_ID: Record<InterviewerId, string> = {
  1: InterviewerImage1,
  2: InterviewerImage2,
  3: InterviewerImage3,
  4: InterviewerImage4,
};

const MAJOR_BY_SPECIALTY: Record<InterviewerSpecialtyOption, InterviewPersonaMajor> = {
  프론트엔드: "FRONTEND",
  백엔드: "BACKEND",
};

const buildUniquePersonaName = (personaName: string) =>
  `${personaName}-${Date.now().toString(36)}`;

export const useInterviewSetup = () => {
  const navigate = useNavigate();

  const [selectedStyle, setSelectedStyle] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.style,
  );

  const [selectedDifficulty, setSelectedDifficulty] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );

  const [selectedInterviewerId, setSelectedInterviewerId] = useState(
    INTERVIEW_SETTING_DEFAULT_SELECTION.interviewerId,
  );

  const [selectedPersonality, setSelectedPersonality] = useState<InterviewerPersonalityOption>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.personality,
  );

  const [selectedTone, setSelectedTone] = useState<InterviewerToneOption>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.tone,
  );

  const [selectedSpecialty, setSelectedSpecialty] = useState<InterviewerSpecialtyOption>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.specialty,
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

    const selectedInterviewer = INTERVIEW_SETTING_INTERVIEWERS.find(
      (interviewer) => interviewer.id === selectedInterviewerId,
    );

    if (!selectedInterviewer) {
      setIsSubmitting(false);
      setErrorMessage("선택한 면접관 정보를 찾을 수 없습니다.");
      return;
    }

    const personaPayload: SavePersonaParams = {
      personaName: buildUniquePersonaName(selectedInterviewer.personaName),
      role: DEFAULT_INTERVIEW_ROLE,
      major: MAJOR_BY_SPECIALTY[selectedSpecialty],
      type: CREATE_PERSONA_TYPE_BY_STYLE[selectedStyle],
      tone: TONE_BY_OPTION[selectedTone],
      level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
      career: CAREER_BY_DIFFICULTY[selectedDifficulty],
      gender: DEFAULT_INTERVIEW_GENDER,
      imageUrl: INTERVIEWER_IMAGE_BY_ID[selectedInterviewer.id],
      description: selectedInterviewer.description,
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

    const interviewSessionId =
      preparedInterviewRecord.sessionId ??
      data.sessionId;
    const personaId =
      data.personaId !== null && data.personaId > 0
        ? data.personaId
        : savedPersona.personaId;
    setActiveInterviewSessionId(interviewSessionId);

    setIsSubmitting(false);

    navigate(`/main/interview/${data.interviewId}`, {
      state: {
        preparedInterview: {
          sessionId: interviewSessionId,
          interviewId: preparedInterviewRecord.interviewId,
          userId: data.userId,
          personaId,
          personaName: personaPayload.personaName,
          role: personaPayload.role,
          major: personaPayload.major,
          type: personaPayload.type,
          personaType: PREPARED_PERSONA_TYPE_BY_STYLE[selectedStyle],
          level: LEVEL_BY_DIFFICULTY[selectedDifficulty],
          career: personaPayload.career,
          gender: personaPayload.gender,
          jobId: preparedInterviewRecord.jobId ?? "",
          status: data.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
          currentQuestionIndex: data.currentQuestionIndex,
          questions: [],
          mode: "SOLO",
          interviewers: [
            {
              personaId,
              name: selectedInterviewer.personaName,
              roleLabel: "기술 면접관",
              image: INTERVIEWER_IMAGE_BY_ID[selectedInterviewer.id],
            },
          ],
        },
        interviewSetting: {
          style: selectedStyle,
          difficulty: selectedDifficulty,
          interviewerId: selectedInterviewerId,
          personality: selectedPersonality,
          tone: selectedTone,
          specialty: selectedSpecialty,
        },
      },
    });
  };

  const select: InterviewSettingSelectHandlers = {
    difficulty: setSelectedDifficulty,
    interviewer: setSelectedInterviewerId,
    personality: setSelectedPersonality,
    specialty: (value) => {
      setSelectedSpecialty(value);
      setSelectedInterviewerId(value === "프론트엔드" ? 2 : 1);
    },
    style: setSelectedStyle,
    tone: setSelectedTone,
  };

  return {
    errorMessage,
    isNextDisabled: isSubmitting,
    isPortfolioAnalyzing: false,
    isSubmitting,
    onBack: handleBack,
    onNext: handleNext,
    select,
    selection: {
      difficulty: selectedDifficulty,
      interviewerId: selectedInterviewerId,
      personality: selectedPersonality,
      specialty: selectedSpecialty,
      style: selectedStyle,
      tone: selectedTone,
    },
  };
};
