import {
  INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE,
  INTERVIEW_SETTING_MAJOR_OPTIONS,
  INTERVIEW_SETTING_OPTION_SECTIONS,
  INTERVIEW_SETTING_PERSONALITY_OPTIONS,
  INTERVIEW_SETTING_STYLE_META,
  INTERVIEW_SETTING_TONE_OPTIONS,
} from '@/shared/constants/interview-page/setting-interview';
import DifficultyEasyImage from '@/shared/img/interview-page/easy.svg?url';
import DifficultyNormalImage from '@/shared/img/interview-page/normal.svg?url';
import DifficultyHardImage from '@/shared/img/interview-page/hard.svg?url';

const [styleSection, difficultySection] = INTERVIEW_SETTING_OPTION_SECTIONS;

const DIFFICULTY_IMAGES: Record<
  (typeof difficultySection.options)[number],
  string
> = {
  쉬움: DifficultyEasyImage,
  보통: DifficultyNormalImage,
  어려움: DifficultyHardImage,
};

export const SETTING_STYLE_SECTION = {
  title: styleSection.title,
  options: styleSection.options.map((value) => ({
    value,
    ...INTERVIEW_SETTING_STYLE_META[value],
  })),
};

export const SETTING_DIFFICULTY_SECTION = {
  title: difficultySection.title,
  options: difficultySection.options.map((value) => ({
    value,
    image: DIFFICULTY_IMAGES[value],
  })),
};

export const SETTING_INTERVIEWER_SECTION = {
  title: INTERVIEW_SETTING_INTERVIEWER_SECTION_TITLE,
  groups: [
    {
      key: 'personality',
      title: '성격',
      options: INTERVIEW_SETTING_PERSONALITY_OPTIONS,
    },
    {
      key: 'tone',
      title: '말투',
      options: INTERVIEW_SETTING_TONE_OPTIONS,
    },
    {
      key: 'major',
      title: '전문 분야',
      options: INTERVIEW_SETTING_MAJOR_OPTIONS,
    },
  ],
} as const;
