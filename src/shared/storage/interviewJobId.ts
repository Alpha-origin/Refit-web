const INTERVIEW_JOB_ID_KEY = "repit.interviewJobId";

export const getInterviewJobId = () =>
  window.localStorage.getItem(INTERVIEW_JOB_ID_KEY)?.trim() ?? "";

export const setInterviewJobId = (jobId: string) => {
  window.localStorage.setItem(INTERVIEW_JOB_ID_KEY, jobId.trim());
};
