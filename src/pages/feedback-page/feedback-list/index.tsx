import { useFeedbackList } from "@/features/feedback-page/feedback-list/model/useFeedbackList";
import { FEEDBACK_LIST_TITLE } from "@/shared/fixtures/feedback-page/feedback-list";
import FeedbackList from "@/widgets/feedback-page/feedback-list";
import { useNavigate } from "react-router-dom";

import type { FeedbackListItem } from "@/widgets/feedback-page/feedback-list/type";

const FeedbackListPage = () => {
  const { errorMessage, isLoading, items, refetch } = useFeedbackList();
  const navigate = useNavigate();

  const handleItemClick = async (item: FeedbackListItem) => {
    let feedbackData = null;

    // Lazy import API to avoid circular deps
    const { getFeedback } =
      await import("@/features/feedback-page/feedback-list/api/getAllInterviews");

    try {
      feedbackData = await getFeedback(item.id);
    } catch {
      feedbackData = null;
    }

    navigate(`/main/feedback/overall/${item.id}`, {
      state: { feedback: feedbackData },
    });
  };

  return (
    <FeedbackList
      errorMessage={errorMessage}
      isLoading={isLoading}
      items={items}
      onRetry={() => {
        void refetch();
      }}
      title={FEEDBACK_LIST_TITLE}
      onItemClick={handleItemClick}
    />
  );
};

export default FeedbackListPage;
