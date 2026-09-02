import { useFeedbackInterview } from "@/features/feedback-page/model/useFeedbackInterview";
import { buildFeedbackDetailContent } from "@/features/feedback-page/model/feedbackDisplay";
import { exportElementToPdf } from "@/shared/utils/exportElementToPdf";
import FeedbackDetailBottomSection from "@/widgets/feedback-page/feedback-detail/bottom-section";
import FeedbackDetailMiddleSection from "@/widgets/feedback-page/feedback-detail/middle-section";
import FeedbackDetailTopSection from "@/widgets/feedback-page/feedback-detail/top-section";
import FeedbackSummaryCard from "@/widgets/feedback-page/feedback-summary-card";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackDetailPage = () => {
  const { id } = useParams();
  const {
    errorMessage,
    feedback,
    feedbackErrorMessage,
    interview,
    isLoading,
    refetch,
  } = useFeedbackInterview(id);
  const content = feedback ? buildFeedbackDetailContent(feedback) : null;
  const panelRef = useRef<HTMLElement | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    if (!panelRef.current || isDownloadingPdf) {
      return;
    }

    setIsDownloadingPdf(true);

    try {
      await exportElementToPdf(panelRef.current, {
        fileName: `repit-feedback-detail-${id ?? "1"}.pdf`,
      });
    } catch (error) {
      console.error(error);
      window.alert("PDF 저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <S.Page>
      <S.Panel ref={panelRef}>
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
              notice="/api/feedbacks에서 불러온 실제 질문별 피드백 데이터입니다."
              style={feedback?.style}
            />
            <FeedbackDetailTopSection content={content.topSection} />
            <FeedbackDetailMiddleSection content={content.middleSection} />
            <FeedbackDetailBottomSection
              content={content.bottomSection}
              isDownloadingPdf={isDownloadingPdf}
              onDownloadPdf={handleDownloadPdf}
            />
          </>
        )}
      </S.Panel>
    </S.Page>
  );
};

export default FeedbackDetailPage;
