import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Media } from "../../types";

interface MediaPropertiesPopupProps {
  media: Media;
  onClose: () => void;
  parentRef?: React.RefObject<HTMLElement>;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const MediaPropertiesPopup: React.FC<MediaPropertiesPopupProps> = ({
  media,
  onClose,
  parentRef,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  useEffect(() => {
    if (popupRef.current && parentRef?.current) {
      const parentRect = parentRef.current.getBoundingClientRect();

      setTimeout(() => {
        if (popupRef.current) {
          const popupRect = popupRef.current.getBoundingClientRect();
          const leftPosition = (parentRect.width - popupRect.width) / 2;
          const parentLeftOffset = parentRect.left;
          const viewportWidth = window.innerWidth;

          let adjustedLeft = leftPosition;

          if (
            parentLeftOffset + leftPosition + popupRect.width >
            viewportWidth
          ) {
            adjustedLeft = Math.max(
              0,
              viewportWidth - popupRect.width - parentLeftOffset
            );
          }

          if (parentLeftOffset + leftPosition < 0) {
            adjustedLeft = -parentLeftOffset;
          }

          popupRef.current.style.left = `${adjustedLeft}px`;
          popupRef.current.style.bottom = `${parentRect.height}px`;

          if (parentRect.top - popupRect.height < 0) {
            popupRef.current.style.bottom = "auto";
            popupRef.current.style.top = `${parentRect.height}px`;
          }
        }
      }, 0);
    }
  }, [parentRef]);

  return (
    <>
      <div className="properties-overlay" onClick={onClose} />

      <div
        className="media-properties-popup"
        ref={popupRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="popup-header">
          <h2>Properties</h2>
          <button
            className="popup-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        <div className="popup-content">
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
    </>
  );
};

export default MediaPropertiesPopup;
