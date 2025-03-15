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

  // Handle clicks outside the popup to close it
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

  // Position the popup centered to its parent element
  useEffect(() => {
    if (popupRef.current && parentRef?.current) {
      const parentRect = parentRef.current.getBoundingClientRect();

      // Wait for the popup to render fully to get its actual dimensions
      setTimeout(() => {
        if (popupRef.current) {
          const popupRect = popupRef.current.getBoundingClientRect();

          // Calculate position to center the popup horizontally
          const leftPosition = (parentRect.width - popupRect.width) / 2;

          // Ensure the popup doesn't extend beyond viewport edges
          const parentLeftOffset = parentRect.left;
          const viewportWidth = window.innerWidth;

          let adjustedLeft = leftPosition;

          // Check if popup would extend beyond right edge of viewport
          if (
            parentLeftOffset + leftPosition + popupRect.width >
            viewportWidth
          ) {
            adjustedLeft = Math.max(
              0,
              viewportWidth - popupRect.width - parentLeftOffset
            );
          }

          // Check if popup would extend beyond left edge of viewport
          if (parentLeftOffset + leftPosition < 0) {
            adjustedLeft = -parentLeftOffset;
          }

          // Apply the calculated position
          popupRef.current.style.left = `${adjustedLeft}px`;

          // Position above the parent by default
          popupRef.current.style.bottom = `${parentRect.height}px`;

          // If popup would go beyond top of viewport, position it below parent instead
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
      {/* Semi-transparent overlay to prevent clicking on other elements */}
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
