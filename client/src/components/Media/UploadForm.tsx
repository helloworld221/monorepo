import React, {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaCloudUploadAlt, FaEdit } from "react-icons/fa";

interface UploadFormProps {
  onUpload: (file: File, customName?: string) => Promise<void>;
  uploading: boolean;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload, uploading }) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customFileName, setCustomFileName] = useState<string>("");
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_NAME_LENGTH = 50;

  useEffect(() => {
    if (error) {
      setIsLeaving(false);
      const timer = setTimeout(() => {
        closeAlert();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const closeAlert = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 500);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const extension = file.name.split(".").pop() || "";
      const nameWithoutExtension = file.name.replace(`.${extension}`, "");

      setCustomFileName(nameWithoutExtension.substring(0, MAX_NAME_LENGTH));
      setError(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      const extension = file.name.split(".").pop() || "";
      const nameWithoutExtension = file.name.replace(`.${extension}`, "");

      setCustomFileName(nameWithoutExtension.substring(0, MAX_NAME_LENGTH));
      setError(null);
    }
  };

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, GIF and MP4 files are allowed");
      return false;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size exceeds 10MB");
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    if (!validateFile(selectedFile)) {
      return;
    }

    try {
      const finalName =
        customFileName.trim() || selectedFile.name.split(".")[0];

      const extension = selectedFile.name.split(".").pop() || "";

      await onUpload(selectedFile, `${finalName}.${extension}`);

      setSelectedFile(null);
      setCustomFileName("");
      setIsEditingName(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setError("Failed to upload file");
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomFileName(e.target.value.substring(0, MAX_NAME_LENGTH));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingName(true);
  };

  const handleClick = () => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Upload Media</h2>
      {isVisible && error && (
        <div
          className={`alert alert-danger ${isLeaving ? "alert-closing" : ""}`}
        >
          <span className="alert-message">{error}</span>
          <button
            type="button"
            className="alert-close-btn"
            onClick={closeAlert}
          >
            &times;
          </button>
        </div>
      )}

      {selectedFile ? (
        <div className="selected-file-container">
          <div className="selected-file-info">
            <h3>Selected File:</h3>
            <div className="file-name-container">
              {isEditingName ? (
                <div className="file-name-edit">
                  <input
                    type="text"
                    value={customFileName}
                    onChange={handleNameChange}
                    className="form-control"
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                    maxLength={MAX_NAME_LENGTH}
                    aria-label="Edit filename"
                  />
                  <small className="text-secondary">
                    {customFileName.length}/{MAX_NAME_LENGTH} characters
                  </small>
                </div>
              ) : (
                <div className="file-name-display">
                  <span className="filename-text">
                    {customFileName || selectedFile.name.split(".")[0]}
                  </span>
                  <span className="file-extension">
                    .{selectedFile.name.split(".").pop()}
                  </span>
                  <button
                    className="btn-icon"
                    onClick={handleEditClick}
                    title="Edit filename"
                    aria-label="Edit filename"
                  >
                    <FaEdit />
                  </button>
                </div>
              )}
            </div>
            <p className="file-details">
              Type: {selectedFile.type} | Size:{" "}
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>

          <div className="selected-file-actions">
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <span className="spinner-small spinner-with-text"></span>
                  <span>Uploading...</span>
                </>
              ) : (
                "Upload"
              )}
            </button>
            <button
              className="btn btn-outline"
              onClick={() => {
                setSelectedFile(null);
                setCustomFileName("");
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label="Upload area. Drag and drop files or click to select files."
        >
          <div className="upload-zone-icon">
            <FaCloudUploadAlt />
          </div>
          <div className="upload-zone-text">
            {uploading ? (
              <>
                <div className="spinner"></div>
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <p>Drag & drop your media files here</p>
                <p>or</p>
                <button className="btn btn-primary">Select Files</button>
              </>
            )}
          </div>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,video/*"
        disabled={uploading}
        aria-hidden="true"
      />
      <p className="upload-info">Supported formats: JPG, PNG, GIF, MP4</p>
    </div>
  );
};

export default UploadForm;
