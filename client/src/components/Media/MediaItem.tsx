import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV, FaPlay, FaTrashAlt, FaVideo } from "react-icons/fa";
import useMedia from "../../hooks/useMedia";
import { Media } from "../../types";
import DeleteConfirmation from "./DeleteConfirmation";
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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mediaItemRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);

    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
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
      setShowDeleteConfirmation(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  const handlePopupOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setModalOpen(true);
    } else {
      setPopupOpen(true);
    }
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
      <div
        className="media-item"
        onClick={handleMediaClick}
        role="button"
        tabIndex={0}
        ref={mediaItemRef}
        aria-label={`${isImage ? "Image" : "Video"}: ${
          media.originalName || media.filename
        }`}
      >
        {isImage && (
          <img
            className="media-image"
            src={media.url}
            alt={media.originalName || media.filename}
            loading="lazy"
          />
        )}
        {isVideo && (
          <div className="media-video-preview">
            <div className="video-placeholder">
              <FaVideo size={28} />
              <span>Video</span>
            </div>
            <div className="video-play-icon">
              <FaPlay />
            </div>
          </div>
        )}
        <div className="media-details">
          <div className="media-filename-container">
            <div
              className="media-filename"
              title={media.originalName || media.filename}
            >
              {media.originalName || media.filename}
            </div>
            <div className="media-actions" onClick={(e) => e.stopPropagation()}>
              <button
                className="delete-button"
                onClick={handleDeleteClick}
                disabled={isDeleting}
                aria-label="Delete media"
              >
                {isDeleting ? (
                  <span className="spinner-small"></span>
                ) : (
                  <FaTrashAlt />
                )}
              </button>
              <button
                ref={menuButtonRef}
                className="properties-button desktop-only"
                onClick={handlePopupOpen}
                aria-label="Show properties"
              >
                <FaEllipsisV />
              </button>
            </div>
          </div>
          <div className="media-date">{formatDate(media.createdAt)}</div>
          {popupOpen && !isMobile && (
            <div className="popup-container" ref={popupRef}>
              <MediaPropertiesPopup media={media} onClose={handlePopupClose} />
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <MediaModal
          media={media}
          onClose={handleModalClose}
          showPropertiesByDefault={isMobile}
        />
      )}

      {showDeleteConfirmation && (
        <DeleteConfirmation
          filename={media.originalName || media.filename}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
};

export default MediaItem;
