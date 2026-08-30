import { useEffect, useMemo, useState } from "react";

import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import * as S from "./style";

const TEXT_ANSWER_MAX_LENGTH = 10_000;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const getMemoKey = (sessionId?: string) =>
  sessionId ? `interview-memo:${sessionId}` : null;

const InterviewDashboard = () => {
  const interview = useInterviewSessionContext();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isVoiceAnswering, setIsVoiceAnswering] = useState(false);
  const sessionId = interview.preparedInterview?.sessionId;
  const memoKey = useMemo(() => getMemoKey(sessionId), [sessionId]);
  const [memo, setMemo] = useState(() =>
    memoKey ? window.sessionStorage.getItem(memoKey) ?? "" : "",
  );
  const isVoiceMode = interview.mode === "voice";
  const isQuestionLoading = interview.currentQuestion === null;
  const totalQuestionCount = interview.totalQuestionCount || 10;
  const activePersonaId = interview.currentQuestion?.personaId;
  const interviewers = interview.preparedInterview?.interviewers ?? [];
  const activeInterviewer = interviewers.find(
    (interviewer) => interviewer.personaId === activePersonaId,
  );
  const isAnswerDisabled =
    !interview.isInterviewReady || isQuestionLoading || interview.isSubmitting;

  useEffect(() => {
    if (!interview.isInterviewReady) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [interview.isInterviewReady]);

  useEffect(() => {
    setMemo(memoKey ? window.sessionStorage.getItem(memoKey) ?? "" : "");
  }, [memoKey]);

  useEffect(() => {
    if (memoKey) {
      window.sessionStorage.setItem(memoKey, memo);
    }
  }, [memo, memoKey]);

  const handleModeChange = (mode: typeof interview.mode) => {
    if (mode === "text") {
      setIsVoiceAnswering(false);
    }

    interview.onModeChange(mode);
  };

  const handleStartVoice = () => {
    setIsVoiceAnswering(true);
    interview.onStartVoice();
  };

  const handleCompleteVoice = async () => {
    try {
      await interview.onCompleteVoice();
    } finally {
      setIsVoiceAnswering(false);
    }
  };

  return (
    <S.Page>
      <S.Content>
        <S.Timer aria-label={`경과 시간 ${formatTime(elapsedSeconds)}`}>
          <S.TimerDot aria-hidden="true" />
          {formatTime(elapsedSeconds)}
        </S.Timer>

        <S.MainGrid>
          <S.LeftColumn>
            <S.QuestionPanel aria-live="polite">
              <S.QuestionTag>
                Question {String(Math.max(interview.displayQuestionNumber, 1)).padStart(2, "0")} / {String(totalQuestionCount).padStart(2, "0")}
              </S.QuestionTag>
              {activeInterviewer ? (
                <S.QuestionSpeaker>
                  {activeInterviewer.name} · {activeInterviewer.roleLabel}
                </S.QuestionSpeaker>
              ) : null}
              <S.QuestionText>
                {interview.currentQuestion?.content ?? "질문을 불러오는 중입니다."}
              </S.QuestionText>
            </S.QuestionPanel>

            <S.AnswerPanel>
              <S.AnswerTabs>
                <S.Tab
                  type="button"
                  $active={isVoiceMode}
                  aria-pressed={isVoiceMode}
                  onClick={() => handleModeChange("voice")}
                >
                  영상/음성 답변
                </S.Tab>
                <S.Tab
                  type="button"
                  $active={!isVoiceMode}
                  aria-pressed={!isVoiceMode}
                  onClick={() => handleModeChange("text")}
                >
                  텍스트 답변
                </S.Tab>
              </S.AnswerTabs>

              {isVoiceMode ? (
                <S.VideoArea>
                  <InterviewCameraView />
                  <S.VideoControls>
                    <S.RoundButton type="button" aria-label="카메라 상태">▣</S.RoundButton>
                    <S.RoundButton type="button" aria-label="마이크 상태">●</S.RoundButton>
                  </S.VideoControls>
                </S.VideoArea>
              ) : (
                <S.TextArea
                  value={interview.answerText}
                  maxLength={TEXT_ANSWER_MAX_LENGTH}
                  placeholder="이곳에 답변을 입력해주세요. 자신의 경험과 성과를 구체적인 수치와 함께 작성하면 좋은 평가를 받을 수 있습니다."
                  onChange={interview.onAnswerTextChange}
                />
              )}

              <S.BottomRow>
                <S.Count>글자 수 {interview.answerText.length} / {TEXT_ANSWER_MAX_LENGTH}</S.Count>
                <S.Actions>
                  <S.Button
                    type="button"
                    $secondary
                    onClick={() => void interview.onQuitInterview()}
                  >
                    그만두기
                  </S.Button>
                  {isVoiceMode ? (
                    isVoiceAnswering || interview.isVoiceStarted ? (
                      <S.Button type="button" onClick={() => void handleCompleteVoice()}>
                        답변 끝내기
                      </S.Button>
                    ) : (
                      <S.Button type="button" disabled={isAnswerDisabled} onClick={handleStartVoice}>
                        음성 답변 시작
                      </S.Button>
                    )
                  ) : (
                    <S.Button
                      type="button"
                      disabled={isAnswerDisabled || !interview.answerText.trim()}
                      onClick={() => void interview.onSubmitText()}
                    >
                      {interview.isSubmitting ? "제출 중..." : "제출하기"}
                    </S.Button>
                  )}
                </S.Actions>
              </S.BottomRow>
            </S.AnswerPanel>
          </S.LeftColumn>

          <S.RightColumn>
            <S.Interviewers aria-label="면접관 목록">
              {interviewers.map((interviewer) => {
                const isActive = interviewer.personaId === activePersonaId;

                return (
                  <S.InterviewerCard key={interviewer.personaId} $active={isActive}>
                    {interviewer.image ? (
                      <S.InterviewerImage src={interviewer.image} alt={`${interviewer.name} 면접관`} />
                    ) : (
                      <S.InterviewerFallback aria-hidden="true">
                        {interviewer.name.slice(0, 1)}
                      </S.InterviewerFallback>
                    )}
                    <S.InterviewerName>{interviewer.name}</S.InterviewerName>
                    <S.InterviewerRole>{interviewer.roleLabel}</S.InterviewerRole>
                    {isActive ? <S.ActiveBadge>질문 중</S.ActiveBadge> : null}
                  </S.InterviewerCard>
                );
              })}
            </S.Interviewers>

            <S.MemoPanel>
              <S.MemoLabel htmlFor="interview-memo">메모</S.MemoLabel>
              <S.MemoTextArea
                id="interview-memo"
                value={memo}
                placeholder="기억해야 할 키워드를 자유롭게 적어보세요.&#10;평가에 반영되지 않습니다."
                onChange={(event) => setMemo(event.target.value)}
              />
            </S.MemoPanel>
          </S.RightColumn>
        </S.MainGrid>
      </S.Content>
    </S.Page>
  );
};

export default InterviewDashboard;
