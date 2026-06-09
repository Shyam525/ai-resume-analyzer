import { useResumeContext } from "../context/ResumeContext";

const ANALYSIS_TIMEOUT_MS = Number(import.meta.env.VITE_ANALYSIS_TIMEOUT_MS || 120000);

function addToast(dispatch, type, message) {
  const id = `${Date.now()}-${Math.random()}`;
  dispatch({
    type: "ADD_TOAST",
    payload: { id, type, message },
  });

  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  }, 3200);
}

export function useAnalysis() {
  const { state, dispatch } = useResumeContext();

  async function runAnalysis({
    file = state.file,
    jobDescription = state.jobDescription,
    preserveResults = false,
  } = {}) {
    if (!file) {
      const message = "Please upload a resume before starting analysis.";
      dispatch({ type: "ANALYSIS_ERROR", payload: message });
      addToast(dispatch, "error", message);
      return false;
    }

    dispatch({ type: "ANALYSIS_START" });
    dispatch({ type: "SET_JOB_DESCRIPTION", payload: jobDescription || "" });

    let timeoutId;

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (jobDescription?.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        const message =
          payload.error || "Analysis failed. Please retry with the same file.";
        dispatch({ type: "ANALYSIS_ERROR", payload: message });
        addToast(dispatch, "error", message);
        return false;
      }

      dispatch({
        type: "ANALYSIS_SUCCESS",
        payload,
      });

      dispatch({
        type: "ADD_HISTORY_ITEM",
        payload: {
          id: `${Date.now()}`,
          fileName: file.name,
          createdAt: new Date().toISOString(),
          overallScore: payload.data?.overallScore ?? null,
          atsScore: payload.data?.atsScore ?? null,
          jobMatchScore: payload.data?.jobMatchScore ?? null,
        },
      });

      addToast(dispatch, "success", "Analysis complete.");
      return true;
    } catch (error) {
      const isTimeout = error?.name === "AbortError";
      const message = isTimeout
        ? `The analysis took longer than ${Math.round(ANALYSIS_TIMEOUT_MS / 1000)} seconds. Please try again with a smaller file or a shorter job description.`
        : "We could not reach the analysis service. Please retry without re-uploading.";
      dispatch({ type: "ANALYSIS_ERROR", payload: message });
      addToast(dispatch, "error", message);
      return false;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  return {
    state,
    dispatch,
    runAnalysis,
  };
}
