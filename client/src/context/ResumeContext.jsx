import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { normalizeAnalysis, normalizeMeta } from "../utils/parseResponse";

const ResumeContext = createContext(null);

const HISTORY_KEY = "resume-analyzer-history";

const initialState = {
  file: null,
  jobDescription: "",
  analysis: null,
  meta: null,
  loading: false,
  error: "",
  toasts: [],
  history: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FILE":
      return { ...state, file: action.payload, error: "" };
    case "SET_JOB_DESCRIPTION":
      return { ...state, jobDescription: action.payload };
    case "ANALYSIS_START":
      return { ...state, loading: true, error: "" };
    case "ANALYSIS_SUCCESS":
      return {
        ...state,
        loading: false,
        analysis: normalizeAnalysis(action.payload.data),
        meta: normalizeMeta(action.payload.meta),
        error: "",
      };
    case "ANALYSIS_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "RESET":
      return {
        ...initialState,
        history: state.history,
      };
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    case "SET_HISTORY":
      return {
        ...state,
        history: action.payload,
      };
    case "ADD_HISTORY_ITEM":
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 8),
      };
    default:
      return state;
  }
}

export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        dispatch({ type: "SET_HISTORY", payload: JSON.parse(stored) });
      }
    } catch {
      dispatch({ type: "SET_HISTORY", payload: [] });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
  }, [state.history]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
}

export function useResumeContext() {
  const context = useContext(ResumeContext);

  if (!context) {
    throw new Error("useResumeContext must be used within a ResumeProvider");
  }

  return context;
}
