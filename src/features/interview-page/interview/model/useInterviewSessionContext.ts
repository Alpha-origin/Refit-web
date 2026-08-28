import { useContext } from "react";

import { InterviewSessionContext } from "./interviewSessionContextValue";

export const useInterviewSessionContext = () => {
  const context = useContext(InterviewSessionContext);

  if (!context) {
    throw new Error(
      "useInterviewSessionContext must be used within InterviewSessionProvider",
    );
  }

  return context;
};
