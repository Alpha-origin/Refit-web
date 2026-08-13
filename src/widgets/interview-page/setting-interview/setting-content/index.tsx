import {
  INTERVIEW_SETTING_INTERVIEWERS,
  INTERVIEW_SETTING_OPTION_SECTIONS,
  INTERVIEW_SETTING_STYLE_META,
} from '@/shared/constants/interview-page/setting-interview';
import InterviewerImage1 from '@/shared/img/interview-page/ interviewer1.svg?url';
import InterviewerImage2 from '@/shared/img/interview-page/ interviewer2.svg?url';
import InterviewerImage3 from '@/shared/img/interview-page/ interviewer3.svg?url';
import InterviewerImage4 from '@/shared/img/interview-page/ interviewer4.svg?url';
import * as S from '../style';

type InterviewStyleOption =
  (typeof INTERVIEW_SETTING_OPTION_SECTIONS)[0]['options'][number];
type InterviewDifficultyOption =
  (typeof INTERVIEW_SETTING_OPTION_SECTIONS)[1]['options'][number];
type InterviewerId =
  (typeof INTERVIEW_SETTING_INTERVIEWERS)[number]['id'];

const [styleSection, difficultySection] = INTERVIEW_SETTING_OPTION_SECTIONS;

const INTERVIEWER_IMAGES: Record<InterviewerId, string> = {
  1: InterviewerImage1,
  2: InterviewerImage2,
  3: InterviewerImage3,
  4: InterviewerImage4,
};

interface SettingContentProps {
  onDifficultySelect: (value: InterviewDifficultyOption) => void;
  onInterviewerSelect: (value: InterviewerId) => void;
  onStyleSelect: (value: InterviewStyleOption) => void;
  selectedDifficulty: InterviewDifficultyOption | null;
  selectedInterviewerId: InterviewerId | null;
  selectedStyle: InterviewStyleOption | null;
}

const SettingContent = ({
  onDifficultySelect,
  onInterviewerSelect,
  onStyleSelect,
  selectedDifficulty,
  selectedInterviewerId,
  selectedStyle,
}: SettingContentProps) => {
  return (
    <S.Sections>
      <S.ControlColumn>
        <S.Section>
          <S.Title>{styleSection.title}</S.Title>

          <S.StyleOptionGroup role="radiogroup" aria-label={styleSection.title}>
            {styleSection.options.map((option) => {
              const meta = INTERVIEW_SETTING_STYLE_META[option];
              const isSelected = selectedStyle === option;

              return (
                <S.StyleOptionButton
                  key={option}
                  $selected={isSelected}
                  aria-checked={isSelected}
                  onClick={() => onStyleSelect(option)}
                  role="radio"
                  type="button"
                >
                  <S.StyleIcon $variant={meta.icon} aria-hidden="true">
                    <span />
                  </S.StyleIcon>
                  <S.StyleTextGroup>
                    <S.OptionLabel>{option}</S.OptionLabel>
                    <S.OptionDescription>{meta.description}</S.OptionDescription>
                  </S.StyleTextGroup>
                  <S.SelectionCircle $selected={isSelected} aria-hidden="true" />
                </S.StyleOptionButton>
              );
            })}
          </S.StyleOptionGroup>
        </S.Section>

        <S.Section>
          <S.Title>{difficultySection.title}</S.Title>

          <S.DifficultyGroup role="radiogroup" aria-label={difficultySection.title}>
            {difficultySection.options.map((option) => {
              const isSelected = selectedDifficulty === option;

              return (
                <S.DifficultyButton
                  key={option}
                  $selected={isSelected}
                  aria-checked={isSelected}
                  onClick={() => onDifficultySelect(option)}
                  role="radio"
                  type="button"
                >
                  {option}
                </S.DifficultyButton>
              );
            })}
          </S.DifficultyGroup>
        </S.Section>
      </S.ControlColumn>

      <S.InterviewerGrid role="radiogroup" aria-label="면접관 선택">
        {INTERVIEW_SETTING_INTERVIEWERS.map((item) => {
          const isSelected = selectedInterviewerId === item.id;

          return (
            <S.InterviewerCard
              key={item.id}
              $selected={isSelected}
              aria-checked={isSelected}
              onClick={() => onInterviewerSelect(item.id)}
              role="radio"
              type="button"
            >
              <S.InterviewerImage src={INTERVIEWER_IMAGES[item.id]} alt="" />
              <S.InterviewerBody>
                {isSelected ? (
                  <S.InterviewerSelectedBadge aria-hidden="true" />
                ) : null}
                <S.InterviewerTitle>{item.name}</S.InterviewerTitle>
                <S.TagList>
                  {item.tags.map((tag) => (
                    <S.Tag key={tag}>{tag}</S.Tag>
                  ))}
                </S.TagList>
                <S.InterviewerDescription>{item.description}</S.InterviewerDescription>
              </S.InterviewerBody>
            </S.InterviewerCard>
          );
        })}
      </S.InterviewerGrid>
    </S.Sections>
  );
};

export default SettingContent;
