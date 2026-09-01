import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import InterviewVisualizerIcon from "@/shared/img/interview-page/Repit-Interview.svg?url";
import type { InterviewMode } from "../type";
import * as S from "../style";

const TEXT_ANSWER_MAX_LENGTH = 10000;
const TEXT_ANSWER_PLACEHOLDER =
  "이곳에 답변을 입력해주세요. 자신의 경험과 성과를 구체적인 수치와 함께 작성하면 좋은 평가를 받을 수 있습니다.";
const FALLBACK_TOTAL_QUESTION_COUNT = 10;

const formatQuestionLabel = ({
  currentQuestionNumber,
  isLoading,
  totalQuestionCount,
}: {
  currentQuestionNumber: number;
  isLoading: boolean;
  totalQuestionCount: number;
}) => {
  if (isLoading) {
    return "Question -- / --";
  }

  return `Question ${String(currentQuestionNumber).padStart(2, "0")} / ${String(
    totalQuestionCount,
  ).padStart(2, "0")}`;
};

interface InterviewContentViewProps {
  onModeChange: (mode: InterviewMode) => void;
}

const InterviewContentView = ({ onModeChange }: InterviewContentViewProps) => {
  const {
    answerText,
    currentQuestion,
    displayQuestionNumber,
    isAwaitingNextQuestion,
    isAwaitingResponse,
    isSubmitting,
    isVoiceStarted,
    mode,
    onAnswerTextChange,
    onSubmitText,
    preparedInterview,
    voiceLevel,
  } = useInterviewSessionContext();
  const isVoiceMode = mode === "voice";
  const isTextMode = mode === "text";
  const visualizerLevel = isVoiceStarted ? voiceLevel : 0.22;
  const isQuestionLoading = currentQuestion === null;
  const totalQuestionCount =
    preparedInterview?.questions.length || FALLBACK_TOTAL_QUESTION_COUNT;
  const currentQuestionNumber = Math.max(displayQuestionNumber, 1);
  const question = {
    id: formatQuestionLabel({
      currentQuestionNumber,
      isLoading: isQuestionLoading,
      totalQuestionCount,
    }),
    text:
      currentQuestion?.content ??
      "질문을 불러오는 중입니다. 잠시만 기다려주세요.",
  };

  return (
    <S.InterviewBody $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.QuestionCard $textMode={isTextMode} $voiceMode={isVoiceMode}>
        <S.QuestionBody>
          <S.QuestionContentStack>
            <S.QuestionLabel>{question.id}</S.QuestionLabel>
            <S.QuestionText>{question.text}</S.QuestionText>

            {isVoiceMode ? (
              <S.InlineVisualizerWrap aria-hidden="true" $voiceLevel={visualizerLevel}>
                <S.InlineVisualizerIcon
                  src={InterviewVisualizerIcon}
                  alt=""
                  aria-hidden="true"
                  $voiceLevel={visualizerLevel}
                />
              </S.InlineVisualizerWrap>
            ) : null}
          </S.QuestionContentStack>
        </S.QuestionBody>
      </S.QuestionCard>

      {mode === "text" ? (
        <S.TextAnswerCard>
          <S.TextAnswerHeader>
            <S.TextModeControl>
              <S.TextModeButton
                type="button"
                $active
                aria-pressed="true"
                disabled={isAwaitingResponse}
                onClick={() => onModeChange("text")}
              >
                텍스트
              </S.TextModeButton>
              <S.TextModeButton
                type="button"
                $active={false}
                aria-pressed="false"
                disabled={isAwaitingResponse}
                onClick={() => onModeChange("voice")}
              >
                음성
              </S.TextModeButton>
            </S.TextModeControl>

            <S.TextSubmitButton
              type="button"
              onClick={onSubmitText}
              disabled={isAwaitingResponse}
              aria-busy={isAwaitingResponse}
            >
              {isSubmitting
                ? "전송 중..."
                : isAwaitingNextQuestion
                  ? "응답 대기중..."
                  : "제출하기"}
            </S.TextSubmitButton>
          </S.TextAnswerHeader>

          <S.TextAnswerBody>
            <S.TextAnswerField
              value={answerText}
              maxLength={TEXT_ANSWER_MAX_LENGTH}
              placeholder={TEXT_ANSWER_PLACEHOLDER}
              readOnly={isAwaitingResponse}
              onChange={onAnswerTextChange}
            />
            <S.TextAnswerCount>
              글자 수 {answerText.length} / {TEXT_ANSWER_MAX_LENGTH}
            </S.TextAnswerCount>
          </S.TextAnswerBody>
        </S.TextAnswerCard>
      ) : null}
    </S.InterviewBody>
  );
};

export default InterviewContentView;
