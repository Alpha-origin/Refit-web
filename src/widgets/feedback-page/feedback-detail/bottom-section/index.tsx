import RobotImageAsset from "@/shared/img/feedback-page/Repit-feedback.svg?url";
import * as S from "../style";
import type { FeedbackDetailBottomSectionProps } from "../type";

const FeedbackDetailBottomSection = ({
  content,
  isDownloadingPdf,
  onDownloadPdf,
}: FeedbackDetailBottomSectionProps) => {
  return (
    <S.BottomBlock>
      <S.CoachCard>
        <S.CoachIllustration>
          <S.RobotImage src={RobotImageAsset} alt="Repit 피드백 로봇" />
        </S.CoachIllustration>

        <S.CoachBubble>
          <S.CoachTextBox>
            <S.CoachText>{content.coachComment}</S.CoachText>
          </S.CoachTextBox>
        </S.CoachBubble>
      </S.CoachCard>

      <S.ActionRow>
        <S.SecondaryActionButton
          type="button"
          disabled={isDownloadingPdf}
          onClick={onDownloadPdf}
        >
          {isDownloadingPdf ? "PDF 저장 중..." : content.secondaryActionLabel}
        </S.SecondaryActionButton>
        <S.PrimaryActionButton
          type="button"
          disabled
          title="면접 기록 조회 API의 소유권 검증과 다시보기 화면이 준비된 뒤 제공됩니다."
        >
          {content.primaryActionLabel} (준비 중)
        </S.PrimaryActionButton>
      </S.ActionRow>
    </S.BottomBlock>
  );
};

export default FeedbackDetailBottomSection;
