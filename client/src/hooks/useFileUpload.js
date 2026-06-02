import { useRef } from "react";
import { useResumeContext } from "../context/ResumeContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const ALLOWED_EXTENSIONS = [".pdf", ".docx", ".txt"];

function addToast(dispatch, type, message) {
  const id = `${Date.now()}-${Math.random()}`;
  dispatch({
    type: "ADD_TOAST",
    payload: { id, type, message },
  });

  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", payload: id });
  }, 3000);
}

function validateFile(file) {
  if (!file) {
    return "Please choose a resume file first.";
  }

  const lowerName = file.name.toLowerCase();
  const hasAllowedExtension = ALLOWED_EXTENSIONS.some((extension) =>
    lowerName.endsWith(extension),
  );

  if (!ALLOWED_TYPES.includes(file.type) || !hasAllowedExtension) {
    return "Invalid file type. Please upload PDF, DOCX, or TXT.";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "File too large. Please upload a file under 5MB.";
  }

  return "";
}

export function useFileUpload() {
  const inputRef = useRef(null);
  const { state, dispatch } = useResumeContext();

  function setFile(file) {
    const error = validateFile(file);

    if (error) {
      dispatch({ type: "ANALYSIS_ERROR", payload: error });
      addToast(dispatch, "error", error);
      return false;
    }

    dispatch({ type: "SET_FILE", payload: file });
    return true;
  }

  function openFilePicker() {
    inputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];

    if (file) {
      setFile(file);
    }
  }

  return {
    inputRef,
    file: state.file,
    openFilePicker,
    handleFileChange,
    handleDrop,
    setFile,
  };
}
