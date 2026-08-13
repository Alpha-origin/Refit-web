import type {
  InterviewDifficultyOption,
  InterviewerId,
  InterviewSettingSelectHandlers,
  InterviewSettingSelection,
  InterviewStyleOption,
} from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';
import {
  SETTING_DIFFICULTY_SECTION,
  SETTING_INTERVIEWER_CARDS,
  SETTING_STYLE_SECTION,
} from './data';

interface SettingContentProps {
  onSelect: InterviewSettingSelectHandlers;
  selection: InterviewSettingSelection;
}

interface StyleOptionsProps {
  onSelect: (value: InterviewStyleOption) => void;
  selectedValue: InterviewStyleOption;
}

interface DifficultyOptionsProps {
  onSelect: (value: InterviewDifficultyOption) => void;
  selectedValue: InterviewDifficultyOption;
}

interface InterviewerOptionsProps {
  onSelect: (value: InterviewerId) => void;
  selectedValue: InterviewerId;
}

const SettingContent = ({ onSelect, selection }: SettingContentProps) => {
  return (
    <S.Sections>
      <S.ControlColumn>
        <StyleOptions
          onSelect={onSelect.style}
          selectedValue={selection.style}
        />
        <DifficultyOptions
          onSelect={onSelect.difficulty}
          selectedValue={selection.difficulty}
        />
      </S.ControlColumn>

      <InterviewerOptions
        onSelect={onSelect.interviewer}
        selectedValue={selection.interviewerId}
      />
    </S.Sections>
  );
};

const StyleOptions = ({ onSelect, selectedValue }: StyleOptionsProps) => (
  <S.Section>
    <S.Title>{SETTING_STYLE_SECTION.title}</S.Title>

    <S.StyleOptionGroup
      role="radiogroup"
      aria-label={SETTING_STYLE_SECTION.title}
    >
      {SETTING_STYLE_SECTION.options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <S.StyleOptionButton
            key={option.value}
            $selected={isSelected}
            aria-checked={isSelected}
            onClick={() => onSelect(option.value)}
            role="radio"
            type="button"
          >
            <S.StyleIcon $variant={option.icon} aria-hidden="true">
              <span />
            </S.StyleIcon>
            <S.StyleTextGroup>
              <S.OptionLabel>{option.value}</S.OptionLabel>
              <S.OptionDescription>{option.description}</S.OptionDescription>
            </S.StyleTextGroup>
            <S.SelectionCircle $selected={isSelected} aria-hidden="true" />
          </S.StyleOptionButton>
        );
      })}
    </S.StyleOptionGroup>
  </S.Section>
);

const DifficultyOptions = ({
  onSelect,
  selectedValue,
}: DifficultyOptionsProps) => (
  <S.Section>
    <S.Title>{SETTING_DIFFICULTY_SECTION.title}</S.Title>

    <S.DifficultyGroup
      role="radiogroup"
      aria-label={SETTING_DIFFICULTY_SECTION.title}
    >
      {SETTING_DIFFICULTY_SECTION.options.map((option) => {
        const isSelected = selectedValue === option;

        return (
          <S.DifficultyButton
            key={option}
            $selected={isSelected}
            aria-checked={isSelected}
            onClick={() => onSelect(option)}
            role="radio"
            type="button"
          >
            {option}
          </S.DifficultyButton>
        );
      })}
    </S.DifficultyGroup>
  </S.Section>
);

const InterviewerOptions = ({
  onSelect,
  selectedValue,
}: InterviewerOptionsProps) => (
  <S.InterviewerGrid role="radiogroup" aria-label="면접관 선택">
    {SETTING_INTERVIEWER_CARDS.map((interviewer) => {
      const isSelected = selectedValue === interviewer.id;

      return (
        <S.InterviewerCard
          key={interviewer.id}
          $selected={isSelected}
          aria-checked={isSelected}
          onClick={() => onSelect(interviewer.id)}
          role="radio"
          type="button"
        >
          <S.InterviewerImage src={interviewer.image} alt="" />
          <S.InterviewerBody $selected={isSelected}>
            {isSelected ? <S.InterviewerSelectedBadge aria-hidden="true" /> : null}
            <S.InterviewerTitle>{interviewer.name}</S.InterviewerTitle>
            <S.TagList>
              {interviewer.tags.map((tag) => (
                <S.Tag key={tag}>{tag}</S.Tag>
              ))}
            </S.TagList>
            <S.InterviewerDescription>
              {interviewer.description}
            </S.InterviewerDescription>
          </S.InterviewerBody>
        </S.InterviewerCard>
      );
    })}
  </S.InterviewerGrid>
);

export default SettingContent;
