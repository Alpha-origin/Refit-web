import { SETTING_INTERVIEWER_SECTION } from '../data';
import * as S from '../style';
import type {
  InterviewerOptionsProps,
  InterviewerSettingGroupProps,
} from './type';

const InterviewerOptions = ({
  onSelect,
  selection,
}: InterviewerOptionsProps) => {
  const [personalityGroup, toneGroup, majorGroup] =
    SETTING_INTERVIEWER_SECTION.groups;

  return (
    <S.InterviewerSettingSection
      aria-labelledby="interviewer-setting-title"
    >
      <S.Title id="interviewer-setting-title">
        {SETTING_INTERVIEWER_SECTION.title}
      </S.Title>
      <S.InterviewerSettingPanel>
        <InterviewerSettingGroup
          label={personalityGroup.title}
          onSelect={onSelect.personality}
          options={personalityGroup.options}
          selectedValue={selection.personality}
        />
        <InterviewerSettingGroup
          label={toneGroup.title}
          onSelect={onSelect.tone}
          options={toneGroup.options}
          selectedValue={selection.tone}
        />
        <InterviewerSettingGroup
          label={majorGroup.title}
          onSelect={onSelect.major}
          options={majorGroup.options}
          selectedValue={selection.major}
        />
      </S.InterviewerSettingPanel>
    </S.InterviewerSettingSection>
  );
};

const InterviewerSettingGroup = <Option extends string,>({
  label,
  onSelect,
  options,
  selectedValue,
}: InterviewerSettingGroupProps<Option>) => {
  return (
    <S.InterviewerSettingGroup>
      <S.InterviewerSettingLabel>{label}</S.InterviewerSettingLabel>
      <S.InterviewerOptionGrid
        $columns={options.length === 2 ? 2 : 3}
        aria-label={label}
        role="radiogroup"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option;

          return (
            <S.InterviewerOptionButton
              key={option}
              $selected={isSelected}
              aria-checked={isSelected}
              onClick={() => onSelect(option)}
              role="radio"
              type="button"
            >
              {option}
            </S.InterviewerOptionButton>
          );
        })}
      </S.InterviewerOptionGrid>
    </S.InterviewerSettingGroup>
  );
};

export default InterviewerOptions;
