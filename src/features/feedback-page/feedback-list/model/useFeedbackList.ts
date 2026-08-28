import { useCallback, useEffect, useState } from "react";

import {
  getAllInterviews,
  getFeedback,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getCareerLabel,
  getFormattedDate,
  getInterviewStatusLabel,
  getInterviewStyleLabel,
  getInterviewTitle,
  getInterviewId,
  getInterviewerName,
  sortInterviewsByCreatedAt,
} from "@/features/feedback-page/model/interviewDisplay";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import InterviewerImage1 from "@/shared/img/interview-page/ interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/ interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/ interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/ interviewer4.svg?url";
import type { FeedbackListItem } from "@/widgets/feedback-page/feedback-list/type";

const INTERVIEWER_IMAGES = [
  InterviewerImage1,
  InterviewerImage2,
  InterviewerImage3,
  InterviewerImage4,
] as const;

const getInterviewerImageUrl = (
  interviewId: number,
  interviewerName: string,
  personaId?: number,
) => {
  const matchedNumber = interviewerName.match(/\d+/)?.[0];
  const imageIndex = Number(matchedNumber ?? personaId);

  if (Number.isInteger(imageIndex) && imageIndex >= 1) {
    return INTERVIEWER_IMAGES[(imageIndex - 1) % INTERVIEWER_IMAGES.length];
  }

  return INTERVIEWER_IMAGES[(interviewId - 1) % INTERVIEWER_IMAGES.length];
};

const getListItems = (
  items: Awaited<ReturnType<typeof getAllInterviews>>,
  feedbackByInterviewId: Map<number, Awaited<ReturnType<typeof getFeedback>>>,
): FeedbackListItem[] =>
  sortInterviewsByCreatedAt(items).map<FeedbackListItem>((interview) => {
    const interviewerName = getInterviewerName(interview);
    const interviewId = getInterviewId(interview);
    const feedback = feedbackByInterviewId.get(interviewId);

    return {
      id: interviewId,
      date: getFormattedDate(interview.createdAt),
      imageUrl: getInterviewerImageUrl(
        interviewId,
        interviewerName,
        interview.persona?.id,
      ),
      title: getInterviewTitle(interview.persona?.major),
      styleLabel: getInterviewStyleLabel(interview.persona?.type),
      levelLabel: getCareerLabel(interview.persona?.career),
      interviewerName,
      statusLabel: getInterviewStatusLabel(feedback?.status ?? interview.status),
      sessionId: interview.sessionId,
      totalScore: feedback?.totalScore,
      summary: feedback?.summary,
      answeredCount: feedback?.answeredCount,
      questionCount: feedback?.questionCount,
    };
    });

export const useFeedbackList = () => {
  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFeedbackList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const interviews = await getAllInterviews();
      const latestInterview = sortInterviewsByCreatedAt(interviews).find(
        (interview) => getInterviewId(interview) > 0,
      );

      if (!latestInterview) {
        setItems([]);
        return;
      }

      const latestInterviewId = getInterviewId(latestInterview);
      const feedback = await getFeedback(latestInterviewId).catch(() => null);
      const feedbackByInterviewId = new Map([
        [latestInterviewId, feedback],
      ]);

      setItems(getListItems([latestInterview], feedbackByInterviewId));
    } catch (error) {
      setItems([]);
      setErrorMessage(
        extractErrorMessage(error, "지난 면접 목록을 불러오지 못했습니다."),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedbackList();
  }, [loadFeedbackList]);

  return {
    errorMessage,
    isLoading,
    items,
    refetch: loadFeedbackList,
  };
};
