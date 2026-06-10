import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  HISTORY_KEY,
  JOB_DESCRIPTION_KEY,
  initialState,
  reducer,
} from "./resumeContextReducer.js";

const ResumeContext = createContext(null);

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        dispatch({ type: "SET_HISTORY", payload: JSON.parse(storedHistory) });
      }

      const storedJobDescription = localStorage.getItem(JOB_DESCRIPTION_KEY);
      if (storedJobDescription) {
        dispatch({
          type: "SET_JOB_DESCRIPTION",
          payload: storedJobDescription,
        });
      }
    } catch {
      dispatch({ type: "SET_HISTORY", payload: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    localStorage.setItem(JOB_DESCRIPTION_KEY, state.jobDescription);
  }, [state.jobDescription]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error("useResumeContext must be used within a ResumeProvider");
  }

  return context;
}
