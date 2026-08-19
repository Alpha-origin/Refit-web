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
  getInterviewerName,
  sortInterviewsByCreatedAt,
} from "@/features/feedback-page/model/interviewDisplay";
import { FEEDBACK_LIST_ITEMS } from "@/shared/fixtures/feedback-page/feedback-list";
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

const getListItems = (items: Awaited<ReturnType<typeof getAllInterviews>>) =>
  sortInterviewsByCreatedAt(items).map<FeedbackListItem>((interview) => {
    const interviewerName = getInterviewerName(interview);

    return {
      id: interview.id,
      date: getFormattedDate(interview.createdAt),
      imageUrl: getInterviewerImageUrl(
        interview.id,
        interviewerName,
        interview.persona?.id,
      ),
      title: getInterviewTitle(interview.persona?.major),
      styleLabel: getInterviewStyleLabel(interview.persona?.type),
      levelLabel: getCareerLabel(interview.persona?.career),
      interviewerName,
      statusLabel: getInterviewStatusLabel(interview.status),
      sessionId: interview.sessionId,
    };
  });

const getFallbackListItems = () =>
  FEEDBACK_LIST_ITEMS.map<FeedbackListItem>((item) => ({
    ...item,
    imageUrl: getInterviewerImageUrl(item.id, item.interviewerName),
  }));

export const useFeedbackList = () => {
  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFeedbackList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const interviews = await getAllInterviews();

      setItems(getListItems(interviews));
    } catch {
      setItems(getFallbackListItems());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedbackList();
  }, [loadFeedbackList]);

  const fetchFeedback = useCallback(async (sessionId: string) => {
    try {
      const data = await getFeedback(sessionId);
      return data;
    } catch {
      return null;
    }
  }, []);

  return {
    errorMessage,
    isLoading,
    items,
    refetch: loadFeedbackList,
    fetchFeedback,
  };
};
