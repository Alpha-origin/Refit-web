import {
  INTERVIEW_SETTING_INTERVIEWERS,
  INTERVIEW_SETTING_OPTION_SECTIONS,
  INTERVIEW_SETTING_STYLE_META,
  type InterviewerId,
} from '@/shared/constants/interview-page/setting-interview';
import InterviewerImage1 from '@/shared/img/interview-page/ interviewer1.svg?url';
import InterviewerImage2 from '@/shared/img/interview-page/ interviewer2.svg?url';
import InterviewerImage3 from '@/shared/img/interview-page/ interviewer3.svg?url';
import InterviewerImage4 from '@/shared/img/interview-page/ interviewer4.svg?url';

const [styleSection, difficultySection] = INTERVIEW_SETTING_OPTION_SECTIONS;

const INTERVIEWER_IMAGES: Record<InterviewerId, string> = {
  1: InterviewerImage1,
  2: InterviewerImage2,
  3: InterviewerImage3,
  4: InterviewerImage4,
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
  options: difficultySection.options,
};

export const SETTING_INTERVIEWER_CARDS = INTERVIEW_SETTING_INTERVIEWERS.map(
  (interviewer) => ({
    ...interviewer,
    image: INTERVIEWER_IMAGES[interviewer.id],
  }),
);

export type SettingInterviewerCard = (typeof SETTING_INTERVIEWER_CARDS)[number];
