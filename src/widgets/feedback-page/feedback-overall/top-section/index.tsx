import * as S from "../style";
import type { FeedbackOverallTopSectionProps } from "../type";
import { useNavigate, useParams } from "react-router-dom";

const FeedbackOverallTopSection = ({
  content,
}: FeedbackOverallTopSectionProps) => {
  const { averageComparison, summary, tabs } = content;
  const { activeTab, detailLabel, overallLabel } = tabs;
  const navigate = useNavigate();
  const { id } = useParams();
  const feedbackId = id ?? "1";

  return (
    <S.SectionBlock>
      <S.PageHeading>종합 피드백</S.PageHeading>
      <S.TabGroup>
        <S.TabButton
          $active={activeTab === "overall"}
          type="button"
          onClick={() => navigate(`/main/feedback/overall/${feedbackId}`)}
        >
          {overallLabel}
        </S.TabButton>
        <S.TabButton
          $active={activeTab === "detail"}
          type="button"
          onClick={() => navigate(`/main/feedback/detail/${feedbackId}`)}
        >
          {detailLabel}
        </S.TabButton>
      </S.TabGroup>

      <S.TopGrid>
        <S.ScoreCard>
          <S.ScoreRing $score={summary.score}>
            <S.ScoreRingInner>
              <S.ScoreRingLabel>{summary.title}</S.ScoreRingLabel>
              <S.MainScore>{summary.score}점</S.MainScore>
            </S.ScoreRingInner>
          </S.ScoreRing>
          <S.DescriptionBlock>
            {summary.description.map((line) => (
              <S.DescriptionLine key={line}>{line}</S.DescriptionLine>
            ))}
          </S.DescriptionBlock>
        </S.ScoreCard>

        <S.MetricsCard>
          {averageComparison.bars.map((bar) => (
            <S.MetricRow key={bar.label}>
              <S.MetricHeader>
                <S.MetricLabel>{bar.label}</S.MetricLabel>
                <S.MetricValue>{bar.score}점</S.MetricValue>
              </S.MetricHeader>
              <S.ProgressTrack>
                <S.ProgressFill $score={bar.score} $tone={bar.tone} />
              </S.ProgressTrack>
            </S.MetricRow>
          ))}
        </S.MetricsCard>
      </S.TopGrid>
    </S.SectionBlock>
  );
};

export default FeedbackOverallTopSection;
