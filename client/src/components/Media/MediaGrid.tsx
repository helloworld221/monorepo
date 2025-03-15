import React, { useEffect } from "react";
import { FaImage } from "react-icons/fa";
import useMedia from "../../hooks/useMedia";
import MediaItem from "./MediaItem";
import UploadForm from "./UploadForm";

const MediaGrid: React.FC = () => {
  const { media, loading, error, uploading, handleUpload, fetchMedia } =
    useMedia();

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleMediaDelete = () => {
    fetchMedia();
  };

  return (
    <div>
      <UploadForm onUpload={handleUpload} uploading={uploading} />
      {error && <div className="alert alert-danger">{error}</div>}
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
