import React, { useEffect, useRef, useState } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import { Media } from "../../types";

interface MediaModalProps {
  media: Media;
  onClose: () => void;
  showPropertiesByDefault?: boolean;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const MediaModal: React.FC<MediaModalProps> = ({
  media,
  onClose,
  showPropertiesByDefault = false,
}) => {
  const isImage = media.fileType.startsWith("image/");
  const isVideo = media.fileType.startsWith("video/");
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showProperties, setShowProperties] = useState(showPropertiesByDefault);
  const [isMobile, setIsMobile] = useState(false);
  const [isImageLarge, setIsImageLarge] = useState(false);

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

  useEffect(() => {
    if (isImage) {
      const img = new Image();
      img.onload = () => {
        const isLarge =
          img.width > window.innerWidth * 0.9 ||
          img.height > window.innerHeight * 0.8;
        setIsImageLarge(isLarge);
      };
      img.src = media.url;
    }
  }, [isImage, media.url]);

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
  };

  const toggleProperties = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProperties(!showProperties);
  };

  useEffect(() => {
    if (isVideo && videoRef.current) {
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

  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="media-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="media-modal-content"
        onClick={handleContentClick}
        onTouchStart={handleTouchStart}
        ref={modalRef}
      >
        <div className="media-modal-header">
          <h3 className="media-modal-title" id="modal-title">
            {media.originalName || media.filename}
          </h3>
          <div className="media-modal-controls">
            {!isMobile && (
              <button
                className="media-modal-info-btn"
                onClick={toggleProperties}
                aria-label="Show file properties"
                title="File properties"
              >
                <FaInfoCircle />
              </button>
            )}
            <button
              className="media-modal-close"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className={`media-modal-body ${isImageLarge ? "scrollable" : ""}`}>
          {isImage && (
            <img
              className="media-modal-image"
              src={media.url}
              alt={media.originalName || media.filename}
              loading="eager"
            />
          )}
          {isVideo && (
            <video
              ref={videoRef}
              className="media-modal-video"
              controls
              playsInline
              controlsList="nodownload"
            >
              <source src={media.url} type={media.fileType} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {(showProperties || isMobile) && (
          <div className="media-properties-panel">
            <div className="properties-content">
              <p>
                <strong>Name:</strong> {media.originalName || media.filename}
              </p>
              <p>
                <strong>Type:</strong> {media.fileType}
              </p>
              {media.size !== undefined && (
                <p>
                  <strong>Size:</strong> {formatFileSize(media.size)}
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(media.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;
