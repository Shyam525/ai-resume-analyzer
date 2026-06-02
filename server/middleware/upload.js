import multer from "multer";

const maxFileSizeMb = Number(process.env.MAX_FILE_SIZE_MB || 5);

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

const allowedExtensions = [".pdf", ".docx", ".txt"];

function hasAllowedExtension(filename = "") {
  const lower = filename.toLowerCase();
  return allowedExtensions.some((extension) => lower.endsWith(extension));
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maxFileSizeMb * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const isMimeAllowed = allowedMimeTypes.has(file.mimetype);
    const isExtensionAllowed = hasAllowedExtension(file.originalname);

    if (!isMimeAllowed || !isExtensionAllowed) {
      const error = new Error(
        "Invalid file type. Please upload PDF, DOCX, or TXT.",
      );
      error.statusCode = 400;
      callback(error);
      return;
    }

    callback(null, true);
  },
});

export function handleUploadError(error, _req, res, next) {
  if (!error) {
    next();
    return;
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        success: false,
        error: `File too large. Please upload a file under ${maxFileSizeMb}MB.`,
      });
      return;
    }

    res.status(400).json({
      success: false,
      error:
        error.field === "Invalid file type. Please upload PDF, DOCX, or TXT."
          ? error.field
          : "Invalid file type. Please upload PDF, DOCX, or TXT.",
    });
    return;
  }

  if (error.statusCode === 400) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
    return;
  }

  next(error);
}
