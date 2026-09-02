import type { InterviewSummary } from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getFormattedDate,
  getInterviewerCount,
  getInterviewModeLabel,
  getInterviewStatusLabel,
  getInterviewStyleLabel,
} from "@/features/feedback-page/model/interviewDisplay";

import * as S from "./style";

interface FeedbackSummaryCardProps {
  interview: InterviewSummary;
  feedbackStatus?: string;
  style?: string;
}

const FeedbackSummaryCard = ({
  interview,
  feedbackStatus,
  style,
}: FeedbackSummaryCardProps) => {
  const persona = interview.persona;
  const interviewerCount = getInterviewerCount(interview);

  return (
    <S.Card>
      <S.HeaderRow>
        <S.HeaderText>
          <S.Eyebrow>면접 결과</S.Eyebrow>
          <S.Title>{getInterviewModeLabel(interview)}</S.Title>
          <S.Description>
            {getFormattedDate(interview.createdAt)}에 진행된 면접입니다.
          </S.Description>
        </S.HeaderText>

        <S.StatusBadge>
          {getInterviewStatusLabel(feedbackStatus ?? interview.status)}
        </S.StatusBadge>
      </S.HeaderRow>

      <S.MetaGrid>
        <S.MetaCard>
          <S.MetaLabel>면접 유형</S.MetaLabel>
          <S.MetaValue>{interview.mode ?? "SOLO"}</S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>면접관 수</S.MetaLabel>
          <S.MetaValue>{interviewerCount > 0 ? `${interviewerCount}명` : "미제공"}</S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>면접관 성향</S.MetaLabel>
          <S.MetaValue>
            {getInterviewStyleLabel(style ?? persona?.type)}
          </S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>Interview ID</S.MetaLabel>
          <S.MetaValue>{interview.interviewId ?? interview.id ?? "-"}</S.MetaValue>
        </S.MetaCard>

        <S.MetaCard>
          <S.MetaLabel>Session ID</S.MetaLabel>
          <S.MetaValue>{interview.sessionId ?? "-"}</S.MetaValue>
        </S.MetaCard>
      </S.MetaGrid>

    </S.Card>
  );
};

export default FeedbackSummaryCard;
