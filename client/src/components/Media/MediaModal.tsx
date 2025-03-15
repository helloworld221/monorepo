import React, { useEffect, useRef } from "react";
import { Media } from "../../types";

interface MediaModalProps {
  media: Media;
  onClose: () => void;
}

const MediaModal: React.FC<MediaModalProps> = ({ media, onClose }) => {
  const isImage = media.fileType.startsWith("image/");
  const isVideo = media.fileType.startsWith("video/");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Prevent clicks inside the modal content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Start playing video when modal opens
  useEffect(() => {
    if (isVideo && videoRef.current) {
      // Small timeout to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch((err) => {
            console.log("Video autoplay prevented:", err);
          });
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isVideo]);

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    // Disable scrolling on the body while modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div className="media-modal-overlay" onClick={onClose}>
      <div className="media-modal-content" onClick={handleContentClick}>
        <button className="media-modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="media-modal-body">
          {isImage && (
            <img
              className="media-modal-image"
              src={media.url}
              alt={media.originalName || media.filename}
            />
          )}
          {isVideo && (
            <video
              ref={videoRef}
              className="media-modal-video"
              controls
              playsInline
            >
              <source src={media.url} type={media.fileType} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="media-modal-footer">
          <h3 className="media-modal-title">
            {media.originalName || media.filename}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default MediaModal;
