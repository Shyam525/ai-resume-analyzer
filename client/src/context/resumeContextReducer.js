import { normalizeAnalysis, normalizeMeta } from "../utils/parseResponse.js";

export const HISTORY_KEY = "resume-analyzer-history";
export const JOB_DESCRIPTION_KEY = "resume-analyzer-job-description";

export const initialState = {
  file: null,
  jobDescription: "",
  analysis: null,
  meta: null,
  loading: false,
  error: "",
  toasts: [],
  history: [],
};

export function reducer(state, action) {
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
    case "CLEAR_HISTORY":
      return {
        ...state,
        history: [],
      };
    default:
      return state;
  }
}
