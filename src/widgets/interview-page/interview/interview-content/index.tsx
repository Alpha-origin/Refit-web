import InterviewVisualizerIcon from "@/shared/img/interview-page/Repit-Interview.svg?url";
import type { InterviewContentViewProps } from "../type";
import * as S from "../style";

const TEXT_ANSWER_MAX_LENGTH = 10000;
const TEXT_ANSWER_PLACEHOLDER =
  "이곳에 답변을 입력해주세요. 자신의 경험과 성과를 구체적인 수치와 함께 작성하면 좋은 평가를 받을 수 있습니다.";

const InterviewContentView = ({
  answerText,
  isVoiceStarted,
  mode,
  onAnswerTextChange,
  onModeChange,
  onSubmitText,
  question,
  voiceLevel,
}: InterviewContentViewProps) => {
  const isVoiceMode = mode === "voice";
  const isTextMode = mode === "text";
  const visualizerLevel = isVoiceStarted ? voiceLevel : 0.22;

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
                onClick={() => onModeChange("text")}
              >
                텍스트
              </S.TextModeButton>
              <S.TextModeButton
                type="button"
                $active={false}
                aria-pressed="false"
                onClick={() => onModeChange("voice")}
              >
                음성
              </S.TextModeButton>
            </S.TextModeControl>

            <S.TextSubmitButton type="button" onClick={onSubmitText}>
              제출하기
            </S.TextSubmitButton>
          </S.TextAnswerHeader>

          <S.TextAnswerBody>
            <S.TextAnswerField
              value={answerText}
              maxLength={TEXT_ANSWER_MAX_LENGTH}
              placeholder={TEXT_ANSWER_PLACEHOLDER}
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
