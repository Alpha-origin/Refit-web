import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTailoredQuestions,
  normalizeTailoredQuestions,
} from "@/features/feedback-page/api/tailorQuestions";
import {
  createInterview,
  prepareInterviewRecord,
  savePersona,
  setActiveInterviewSessionId,
  type PrepareInterviewQuestion,
  type SavePersonaParams,
} from "@/features/interview-page/interview/api";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import {
  LEVEL_BY_DIFFICULTY,
  TYPE_BY_STYLE,
  getInterviewerCandidatesForSlot,
  type InterviewerTemplate,
  type MultiInterviewSelection,
  type MultiInterviewValidation,
  type SlotIndex,
} from "@/shared/constants/interview-page/setting-multi-interview";
import {
  INTERVIEW_SETTING_DEFAULT_SELECTION,
  type InterviewDifficultyOption,
  type InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";
import { getInterviewJobId } from "@/shared/storage/interviewJobId";

type CompletedSlots = [InterviewerTemplate, InterviewerTemplate, InterviewerTemplate];

const INITIAL_SLOTS: MultiInterviewSelection["slots"] = [null, null, null];

const getCompletedSlots = (
  slots: MultiInterviewSelection["slots"],
): CompletedSlots | null => {
  if (!slots.every(Boolean)) {
    return null;
  }

  return slots as CompletedSlots;
};

const getValidation = (
  slots: MultiInterviewSelection["slots"],
): MultiInterviewValidation => {
  const selectedInterviewers = slots.filter(
    (interviewer): interviewer is InterviewerTemplate => interviewer !== null,
  );
  const selectedNonTechnicalRoles = slots
    .slice(1)
    .filter((interviewer): interviewer is InterviewerTemplate => interviewer !== null)
    .map((interviewer) => interviewer.role);

  return {
    hasDuplicateInterviewer:
      new Set(selectedInterviewers.map((interviewer) => interviewer.key)).size !==
      selectedInterviewers.length,
    hasDuplicateRole:
      new Set(selectedNonTechnicalRoles).size !== selectedNonTechnicalRoles.length,
  };
};

const getNextEmptySlot = (
  slots: MultiInterviewSelection["slots"],
): SlotIndex | null => {
  const slot = slots.findIndex((interviewer) => interviewer === null);

  return slot === -1 ? null : (slot as SlotIndex);
};

const getCandidateConflictMessage = (
  candidate: InterviewerTemplate,
  activeSlot: SlotIndex,
  slots: MultiInterviewSelection["slots"],
) => {
  const selectedInAnotherSlot = slots.some(
    (selected, index) => index !== activeSlot && selected?.key === candidate.key,
  );

  if (selectedInAnotherSlot) {
    return "이미 선택된 면접관입니다.";
  }

  if (activeSlot > 0) {
    const selectedRoleInAnotherNonTechnicalSlot = slots.some(
      (selected, index) =>
        index !== activeSlot && index > 0 && selected?.role === candidate.role,
    );

    if (selectedRoleInAnotherNonTechnicalSlot) {
      return "이미 유사한 평가 분야의 면접관이 선택되었습니다.";
    }
  }

  return null;
};

const buildPersonaName = (template: InterviewerTemplate) =>
  `${template.key}-${crypto.randomUUID()}`;

export const useMultiInterviewSetup = () => {
  const navigate = useNavigate();
  const [style, setStyle] = useState<InterviewStyleOption>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.style,
  );
  const [difficulty, setDifficulty] = useState<InterviewDifficultyOption>(
    INTERVIEW_SETTING_DEFAULT_SELECTION.difficulty,
  );
  const [activeSlot, setActiveSlot] = useState<SlotIndex>(0);
  const [slots, setSlots] = useState<MultiInterviewSelection["slots"]>(INITIAL_SLOTS);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validation = useMemo(() => getValidation(slots), [slots]);
  const completedSlots = getCompletedSlots(slots);
  const canSubmit =
    Boolean(completedSlots) &&
    !validation.hasDuplicateInterviewer &&
    !validation.hasDuplicateRole &&
    !isSubmitting;

  const selectSlot = (slot: SlotIndex) => {
    if (isSubmitting) {
      return;
    }

    setErrorMessage("");
    setActiveSlot(slot);
  };

  const selectInterviewer = (candidate: InterviewerTemplate) => {
    if (isSubmitting) {
      return;
    }

    const conflictMessage = getCandidateConflictMessage(candidate, activeSlot, slots);

    if (conflictMessage) {
      setErrorMessage(conflictMessage);
      return;
    }

    const nextSlots = [...slots] as MultiInterviewSelection["slots"];
    nextSlots[activeSlot] = candidate;
    setSlots(nextSlots);
    setErrorMessage("");

    const nextEmptySlot = getNextEmptySlot(nextSlots);

    if (nextEmptySlot !== null) {
      setActiveSlot(nextEmptySlot);
    }
  };

  const handleNext = async () => {
    if (isSubmitting) {
      return;
    }

    const selectedSlots = getCompletedSlots(slots);

    if (!selectedSlots) {
      setErrorMessage("면접관 3명을 모두 선택해주세요.");
      return;
    }

    const nextValidation = getValidation(slots);

    if (nextValidation.hasDuplicateInterviewer) {
      setErrorMessage("이미 선택된 면접관입니다.");
      return;
    }

    if (nextValidation.hasDuplicateRole) {
      setErrorMessage("이미 유사한 평가 분야의 면접관이 선택되었습니다.");
      return;
    }

    const jobId = getInterviewJobId();

    if (!jobId) {
      setErrorMessage("마이페이지에서 포트폴리오를 먼저 등록해주세요.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const personaIds: number[] = [];

      for (const template of selectedSlots) {
        const personaPayload: SavePersonaParams = {
          personaName: buildPersonaName(template),
          role: template.role,
          major: template.role === "TECH" ? template.major ?? null : null,
          type: TYPE_BY_STYLE[style],
          level: LEVEL_BY_DIFFICULTY[difficulty],
          career: template.career,
          gender: template.gender,
        };
        const { data: savedPersona, errorMessage: savePersonaError } =
          await savePersona(personaPayload);

        if (savePersonaError || !savedPersona) {
          throw new Error(savePersonaError ?? "페르소나 저장에 실패했습니다.");
        }

        personaIds.push(savedPersona.personaId);
      }

      const { data: createdInterview, errorMessage: createError } =
        await createInterview({ personaIds });

      if (createError || !createdInterview) {
        throw new Error(createError ?? "MULTI 면접 생성에 실패했습니다.");
      }

      const { data: preparedInterviewRecord, errorMessage: prepareError } =
        await prepareInterviewRecord(createdInterview.interviewId);

      if (prepareError || !preparedInterviewRecord) {
        throw new Error(prepareError ?? "질문 준비에 실패했습니다.");
      }

      const tailorResponse = await getTailoredQuestions(
        preparedInterviewRecord.interviewId,
      );
      const tailoredQuestions: PrepareInterviewQuestion[] = normalizeTailoredQuestions(
        tailorResponse,
        personaIds[0],
      );

      if (tailoredQuestions.length === 0) {
        throw new Error("질문 준비에 실패했습니다.");
      }

      const representative = selectedSlots[0];
      setActiveInterviewSessionId(createdInterview.sessionId);

      navigate(`/main/interview/${createdInterview.interviewId}`, {
        state: {
          preparedInterview: {
            sessionId: createdInterview.sessionId,
            interviewId: preparedInterviewRecord.interviewId,
            userId: createdInterview.userId,
            personaId: personaIds[0],
            personaName: representative.name,
            role: representative.role,
            major: representative.major ?? null,
            type: TYPE_BY_STYLE[style],
            personaType: TYPE_BY_STYLE[style],
            level: LEVEL_BY_DIFFICULTY[difficulty],
            career: representative.career,
            gender: representative.gender,
            jobId,
            status:
              createdInterview.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS",
            currentQuestionIndex: createdInterview.currentQuestionIndex,
            questions: tailoredQuestions,
          },
          multiInterview: {
            interviewId: createdInterview.interviewId,
            sessionId: createdInterview.sessionId,
            mode: "MULTI",
            personaIds: createdInterview.personaIds,
            interviewers: selectedSlots,
            style,
            difficulty,
          },
        },
      });
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "MULTI 면접 준비에 실패했습니다."));
      setIsSubmitting(false);
    }
  };

  return {
    candidates: getInterviewerCandidatesForSlot(activeSlot),
    errorMessage,
    isSubmitting,
    isNextDisabled: !canSubmit,
    onBack: () => navigate(-1),
    onNext: handleNext,
    select: {
      difficulty: setDifficulty,
      interviewer: selectInterviewer,
      slot: selectSlot,
      style: setStyle,
    },
    selection: {
      activeSlot,
      difficulty,
      slots,
      style,
    } satisfies MultiInterviewSelection,
    validation,
  };
};

export const getMultiInterviewerCandidateState = (
  candidate: InterviewerTemplate,
  activeSlot: SlotIndex,
  slots: MultiInterviewSelection["slots"],
) => {
  const disabledReason = getCandidateConflictMessage(candidate, activeSlot, slots);

  return {
    disabled: Boolean(disabledReason),
    disabledReason: disabledReason ?? undefined,
    selected: slots[activeSlot]?.key === candidate.key,
  };
};
