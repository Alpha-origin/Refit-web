import { useInterviewSetup } from "@/features/interview-page/setting-interview/model/useInterviewSetup";
import { INTERVIEW_SETTING_ACTION_LABELS } from "@/shared/constants/interview-page/setting-interview";
import SettingContent from "@/widgets/interview-page/setting-interview/setting-content";
import * as S from "@/widgets/interview-page/setting-interview/style";

const SettingInterviewScreen = () => {
  const setup = useInterviewSetup();

  return (
    <S.Container>
      <S.ContentWrapper>
        <SettingContent
          onSelect={setup.select}
          selection={setup.selection}
        />
        {setup.errorMessage ? (
          <S.ErrorMessage role="alert">{setup.errorMessage}</S.ErrorMessage>
        ) : null}
        <S.BottomButtonWrapper>
          <S.BackButton
            $disabled={setup.isSubmitting}
            disabled={setup.isSubmitting}
            type="button"
            onClick={setup.onBack}
          >
            {INTERVIEW_SETTING_ACTION_LABELS.back}
          </S.BackButton>
          <S.NextButton
            $disabled={setup.isNextDisabled}
            disabled={setup.isNextDisabled}
            type="button"
            onClick={setup.onNext}
          >
            {setup.isSubmitting ? "시작 중..." : INTERVIEW_SETTING_ACTION_LABELS.next}
          </S.NextButton>
        </S.BottomButtonWrapper>
      </S.ContentWrapper>
      {setup.isSubmitting ? (
        <S.LoadingOverlay role="status" aria-live="polite">
          <S.LoadingSpinner aria-hidden="true" />
          <S.LoadingMessage>질문 생성중입니다</S.LoadingMessage>
        </S.LoadingOverlay>
      ) : null}
    </S.Container>
  );
};

export default SettingInterviewScreen;
