import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import useMedia from "../../hooks/useMedia";
import MediaItem from "./MediaItem";
import UploadForm from "./UploadForm";

const MediaGrid: React.FC = () => {
  const { media, loading, error, uploading, handleUpload, fetchMedia } =
    useMedia();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

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
  };

  const handleMediaDelete = () => {
    fetchMedia();
  };

  return (
    <div>
      <UploadForm onUpload={handleUpload} uploading={uploading} />
      {error && (
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
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      ) : media.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaImage />
          </div>
          <h3>No media files yet</h3>
          <p>Upload your first media file to see it here</p>
        </div>
      ) : (
        <div className="media-grid">
          {media.map((item) => (
            <MediaItem
              key={item._id}
              media={item}
              onDelete={handleMediaDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaGrid;
