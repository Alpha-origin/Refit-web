import {
  getMultiInterviewerCandidateState,
  useMultiInterviewSetup,
} from "@/features/interview-page/setting-multi-interview/model/useMultiInterviewSetup";
import MultiInterviewerCatalog from "@/widgets/interview-page/multi-interviewer-catalog";
import MultiInterviewerSlots from "@/widgets/interview-page/multi-interviewer-slots";
import SettingOptions from "@/widgets/interview-page/setting-interview/setting-options";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

const SettingMultiInterviewPage = () => {
  const setup = useMultiInterviewSetup();

  return (
    <S.Container>
      <S.Content>
        <S.MainGrid>
          <SettingOptions
            onSelect={{
              difficulty: setup.select.difficulty,
              style: setup.select.style,
            }}
            selection={{
              difficulty: setup.selection.difficulty,
              style: setup.selection.style,
            }}
          />

          <S.InterviewerColumn>
            <MultiInterviewerSlots
              activeSlot={setup.selection.activeSlot}
              slots={setup.selection.slots}
              onSelectSlot={setup.select.slot}
            />
            <MultiInterviewerCatalog
              candidates={setup.candidates}
              getCandidateState={(candidate) =>
                getMultiInterviewerCandidateState(
                  candidate,
                  setup.selection.activeSlot,
                  setup.selection.slots,
                )
              }
              onSelect={setup.select.interviewer}
            />
          </S.InterviewerColumn>
        </S.MainGrid>

        {setup.errorMessage ? (
          <S.ErrorMessage role="alert">{setup.errorMessage}</S.ErrorMessage>
        ) : null}

        <S.ActionRow>
          <S.BackButton disabled={setup.isSubmitting} type="button" onClick={setup.onBack}>
            돌아가기
          </S.BackButton>
          <S.NextButton
            $analyzing={setup.isPortfolioAnalyzing}
            disabled={setup.isNextDisabled}
            type="button"
            onClick={setup.onNext}
          >
            {setup.isSubmitting
              ? "시작 중..."
              : setup.isPortfolioAnalyzing
                ? (
                  <>
                    분석 중<S.LoadingDots aria-hidden="true" />
                  </>
                )
                : "다음"}
          </S.NextButton>
        </S.ActionRow>
      </S.Content>

      {setup.isSubmitting ? (
        <S.LoadingOverlay role="status" aria-live="polite">
          <S.LoadingSpinner aria-hidden="true" />
          <S.LoadingText>면접관과 질문을 준비하고 있습니다</S.LoadingText>
        </S.LoadingOverlay>
      ) : null}
    </S.Container>
  );
};

export default SettingMultiInterviewPage;
