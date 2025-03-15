import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteConfirmationProps {
  filename: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  filename,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <div className="properties-overlay" onClick={onCancel} />

      <div className="delete-confirmation-popup">
        <div className="delete-confirmation-header">
          <FaExclamationTriangle className="delete-warning-icon" />
          <h3>Confirm Deletion</h3>
        </div>

        <div className="delete-confirmation-content">
          <p>
            Are you sure you want to delete <strong>{filename}</strong>?
          </p>
          <p className="delete-warning">This action cannot be undone.</p>
        </div>

        <div className="delete-confirmation-actions">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmation;
