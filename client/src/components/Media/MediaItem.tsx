import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaPlay, FaTrashAlt, FaVideo } from "react-icons/fa";
import useMedia from "../../hooks/useMedia";
import { Media } from "../../types";
import MediaModal from "./MediaModal";
import MediaPropertiesPopup from "./MediaPropertiesPopup";

interface MediaItemProps {
  media: Media;
  onDelete?: (mediaId: string) => void;
}

const MediaItem: React.FC<MediaItemProps> = ({ media, onDelete }) => {
  const isImage = media.fileType.startsWith("image/");
  const isVideo = media.fileType.startsWith("video/");
  const { deleteMedia } = useMedia();
  const [popupOpen, setPopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMedia(media._id);

      setIsDeleted(true);

      if (onDelete) {
        onDelete(media._id);
      }
    } catch (error) {
      console.error("Failed to delete media:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePopupOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleMediaClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target as Node)
      ) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isDeleted) {
    return null;
  }

  return (
    <>
      <div className="media-item" onClick={handleMediaClick}>
        {isImage && (
          <img
            className="media-image"
            src={media.url}
            alt={media.originalName}
            loading="lazy"
          />
        )}
        {isVideo && (
          <div className="media-video-preview">
            <div className="video-placeholder">
              <FaVideo size={36} />
              <span>Video</span>
            </div>
            <div className="video-play-icon">
              <FaPlay />
            </div>
          </div>
        )}
        <div className="media-details">
          <div className="media-filename-container">
            <div className="media-filename" title={media.originalName}>
              {media.originalName ?? media.filename}
            </div>
            <div className="media-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="delete-button"
                onClick={handleDelete}
                disabled={isDeleting}
                aria-label="Delete"
              >
                {isDeleting ? (
                  <span className="spinner-small"></span>
                ) : (
                  <FaTrashAlt />
                )}
              </button>
              <button
                ref={menuButtonRef}
                className="properties-button"
                onClick={handlePopupOpen}
                aria-label="Properties"
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>
          <div className="media-date">{formatDate(media.createdAt)}</div>
          {popupOpen && (
            <div className="popup-container" ref={popupRef}>
              <MediaPropertiesPopup media={media} onClose={handlePopupClose} />
            </div>
          )}
        </div>
      </div>

      {modalOpen && <MediaModal media={media} onClose={handleModalClose} />}
    </>
  );
};

export default MediaItem;
