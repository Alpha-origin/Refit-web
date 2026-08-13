import { type KeyboardEvent } from "react";
import InterviewVisualizerIcon from "@/shared/img/interview-page/Repit-Interview.svg?url";
import type { InterviewContentViewProps } from "../type";
import * as S from "../style";

const InterviewContentView = ({
  answerText,
  isVoiceStarted,
  mode,
  onAnswerTextChange,
  onSubmitText,
  question,
  voiceLevel,
}: InterviewContentViewProps) => {
  const isVoiceMode = mode === "voice";
  const isTextMode = mode === "text";
  const visualizerLevel = isVoiceStarted ? voiceLevel : 0.22;

  const handleTextAnswerKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();
    onSubmitText();
  };

  return (
    <S.InterviewBody $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.QuestionCard
        $textMode={isTextMode}
        $voiceMode={isVoiceMode}
      >
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
          <S.TextAnswerField
            value={answerText}
            placeholder="답변을 텍스트로 입력해주세요."
            onChange={onAnswerTextChange}
            onKeyDown={handleTextAnswerKeyDown}
          />
        </S.TextAnswerCard>
      ) : null}
    </S.InterviewBody>
  );
};

export default InterviewContentView;
