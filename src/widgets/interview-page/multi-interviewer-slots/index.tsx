import {
  MULTI_INTERVIEW_SLOT_LABELS,
  type InterviewerTemplate,
  type SlotIndex,
} from "@/shared/constants/interview-page/setting-multi-interview";
import * as S from "@/widgets/interview-page/setting-multi-interview/style";

interface MultiInterviewerSlotsProps {
  activeSlot: SlotIndex;
  slots: readonly [
    InterviewerTemplate | null,
    InterviewerTemplate | null,
    InterviewerTemplate | null,
  ];
  onSelectSlot: (slot: SlotIndex) => void;
}

const MultiInterviewerSlots = ({
  activeSlot,
  slots,
  onSelectSlot,
}: MultiInterviewerSlotsProps) => (
  <S.Section aria-labelledby="multi-interviewer-slots-title">
    <S.SectionTitle id="multi-interviewer-slots-title">면접관 선택</S.SectionTitle>
    <S.SlotGrid>
      {slots.map((interviewer, index) => {
        const slot = index as SlotIndex;
        const isActive = activeSlot === slot;

        return (
          <S.SlotButton
            key={slot}
            $active={isActive}
            $filled={Boolean(interviewer)}
            aria-pressed={isActive}
            type="button"
            onClick={() => onSelectSlot(slot)}
          >
            {interviewer ? <S.SlotImage src={interviewer.image} alt="" /> : null}
            <S.SlotBody>
              <S.SlotNumber>Slot {slot + 1}</S.SlotNumber>
              {interviewer ? (
                <>
                  <S.SlotName>{interviewer.name}</S.SlotName>
                  <S.SlotRole>{interviewer.roleLabel}</S.SlotRole>
                  <S.SlotSpecialty>{interviewer.specialty}</S.SlotSpecialty>
                </>
              ) : (
                <>
                  <S.SlotName>{MULTI_INTERVIEW_SLOT_LABELS[slot]}</S.SlotName>
                  <S.SlotPrompt>+ 면접관 선택</S.SlotPrompt>
                </>
              )}
            </S.SlotBody>
          </S.SlotButton>
        );
      })}
    </S.SlotGrid>
  </S.Section>
);

export default MultiInterviewerSlots;
