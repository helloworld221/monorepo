import React, { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Media } from "../../types";

interface MediaPropertiesPopupProps {
  media: Media;
  onClose: () => void;
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
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create a function to handle clicks outside the popup
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add the event listener to the document
    document.addEventListener("mousedown", handleOutsideClick);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div
      className="media-properties-popup"
      ref={popupRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="popup-header">
        <h2>Properties</h2>
        <button
          className="close-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          <FaTimes />
        </button>
      </div>
      <p>Name: {media.originalName || media.filename}</p>
      <p>Type: {media.fileType}</p>
      {media.size !== undefined && <p>Size: {formatFileSize(media.size)}</p>}
      <p>Created At: {new Date(media.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default MediaPropertiesPopup;
