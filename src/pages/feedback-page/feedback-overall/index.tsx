import { useFeedbackInterview } from "@/features/feedback-page/model/useFeedbackInterview";
import { buildFeedbackOverallContent } from "@/features/feedback-page/model/feedbackDisplay";
import FeedbackSummaryCard from "@/widgets/feedback-page/feedback-summary-card";
import FeedbackOverallBottomSection from "@/widgets/feedback-page/feedback-overall/bottom-section";
import FeedbackOverallMiddleSection from "@/widgets/feedback-page/feedback-overall/middle-section";
import FeedbackOverallTopSection from "@/widgets/feedback-page/feedback-overall/top-section";
import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackOverallPage = () => {
  const { id } = useParams();
  const {
    errorMessage,
    feedback,
    feedbackErrorMessage,
    interview,
    isLoading,
    refetch,
  } = useFeedbackInterview(id);
  const content = feedback ? buildFeedbackOverallContent(feedback) : null;

  return (
    <S.Page>
      <S.Panel>
        {isLoading ? (
          <S.StateCard aria-live="polite">
            <S.StateText>면접 정보를 불러오는 중입니다.</S.StateText>
          </S.StateCard>
        ) : errorMessage || !interview ? (
          <S.StateCard aria-live="polite">
            <S.StateText>{errorMessage ?? "면접 정보를 찾을 수 없습니다."}</S.StateText>
            <S.RetryButton
              type="button"
              onClick={() => {
                void refetch();
              }}
            >
              다시 시도
            </S.RetryButton>
          </S.StateCard>
        ) : !content ? (
          <S.StateCard aria-live="polite">
            <S.StateText>
              {feedbackErrorMessage ?? "피드백 분석 결과를 불러오지 못했습니다."}
            </S.StateText>
            <S.RetryButton
              type="button"
              onClick={() => {
                void refetch();
              }}
            >
              다시 시도
            </S.RetryButton>
          </S.StateCard>
        ) : (
          <>
            <FeedbackSummaryCard
              interview={interview}
              notice="/api/feedbacks에서 불러온 실제 피드백 데이터입니다."
            />
            <FeedbackOverallTopSection content={content.topSection} />
            <FeedbackOverallMiddleSection content={content.middleSection} />
            <FeedbackOverallBottomSection content={content.bottomSection} />
          </>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackOverallPage;
