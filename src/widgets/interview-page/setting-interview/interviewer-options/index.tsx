import {
  INTERVIEW_SETTING_INTERVIEWER_OPTION_SECTIONS,
  type InterviewerPersonalityOption,
  type InterviewerSpecialtyOption,
  type InterviewerToneOption,
} from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';
import type { InterviewerOptionsProps } from './type';

const [personalitySection, toneSection, specialtySection] =
  INTERVIEW_SETTING_INTERVIEWER_OPTION_SECTIONS;

interface InterviewerOptionGroupProps<Option extends string> {
  onSelect: (value: Option) => void;
  options: readonly Option[];
  selectedValue: Option;
  title: string;
}

const InterviewerOptionGroup = <Option extends string>({
  onSelect,
  options,
  selectedValue,
  title,
}: InterviewerOptionGroupProps<Option>) => (
  <S.InterviewerOptionSection>
    <S.InterviewerOptionTitle>{title}</S.InterviewerOptionTitle>
    <S.InterviewerOptionGroup
      $columns={options.length}
      role="radiogroup"
      aria-label={title}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option;

        return (
          <S.InterviewerOptionButton
            key={option}
            type="button"
            $selected={isSelected}
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(option)}
          >
            {option}
          </S.InterviewerOptionButton>
        );
      })}
    </S.InterviewerOptionGroup>
  </S.InterviewerOptionSection>
);

const InterviewerOptions = ({ onSelect, selection }: InterviewerOptionsProps) => (
  <S.InterviewerColumn>
    <S.Title>면접관 선택</S.Title>
    <S.InterviewerPanel>
      <InterviewerOptionGroup<InterviewerPersonalityOption>
        title={personalitySection.title}
        options={personalitySection.options}
        selectedValue={selection.personality}
        onSelect={onSelect.personality}
      />
      <InterviewerOptionGroup<InterviewerToneOption>
        title={toneSection.title}
        options={toneSection.options}
        selectedValue={selection.tone}
        onSelect={onSelect.tone}
      />
      <InterviewerOptionGroup<InterviewerSpecialtyOption>
        title={specialtySection.title}
        options={specialtySection.options}
        selectedValue={selection.specialty}
        onSelect={onSelect.specialty}
      />
    </S.InterviewerPanel>
  </S.InterviewerColumn>
);

export default InterviewerOptions;
