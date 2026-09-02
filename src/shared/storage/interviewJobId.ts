const INTERVIEW_JOB_ID_KEY = "repit.interviewJobId";
const INTERVIEW_JOB_READY_KEY = "repit.interviewJobReadyId";

export const getInterviewJobId = () =>
  window.localStorage.getItem(INTERVIEW_JOB_ID_KEY)?.trim() ?? "";

export const setInterviewJobId = (jobId: string) => {
  const trimmedJobId = jobId.trim();

  window.localStorage.setItem(INTERVIEW_JOB_ID_KEY, trimmedJobId);
  window.localStorage.removeItem(INTERVIEW_JOB_READY_KEY);
};

export const clearInterviewJobId = () => {
  window.localStorage.removeItem(INTERVIEW_JOB_ID_KEY);
  window.localStorage.removeItem(INTERVIEW_JOB_READY_KEY);
};

export const getInterviewJobReadyId = () =>
  window.localStorage.getItem(INTERVIEW_JOB_READY_KEY)?.trim() ?? "";

export const markInterviewJobReady = (jobId: string) => {
  window.localStorage.setItem(INTERVIEW_JOB_READY_KEY, jobId.trim());
};
