export default function RecordModal({
  activeModalRecord,
  isEditing,
  setIsEditing,
  setActiveModalRecord,
  editFormData,
  setEditFormData,
  handleUpdateRecord,
  handleDelete
}) {
  if (!activeModalRecord) return null;

  const closeModal = () => {
    setActiveModalRecord(null);
    setIsEditing(false);
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="modal-title">
            {isEditing
              ? `Edit Record: #${activeModalRecord.id}`
              : `Record Details: #${activeModalRecord.id}`}
          </h2>

          <button
            onClick={closeModal}
            className="close-modal-btn"
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>

        {!isEditing ? (
          <div className="modal-body">
            <p>
              <strong>Student Name:</strong>{' '}
              {activeModalRecord.student_name}
            </p>

            <p>
              <strong>Student ID:</strong>{' '}
              {activeModalRecord.student_id}
            </p>

            <p>
              <strong>Module Code:</strong>{' '}
              {activeModalRecord.module_code}
            </p>

            <p>
              <strong>Assessment:</strong>{' '}
              {activeModalRecord.assessment}
            </p>

            <p>
              <strong>Final Score:</strong>{' '}
              <span className="score-badge">
                {activeModalRecord.score}/100
              </span>
            </p>

            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`status-tag ${activeModalRecord.status
                  .toLowerCase()
                  .replace(' ', '-')}`}
              >
                {activeModalRecord.status}
              </span>
            </p>

            {activeModalRecord.review_reason && (
              <p className="review-reason-box">
                <strong>Review / Appeal Reason:</strong>{' '}
                {activeModalRecord.review_reason}
              </p>
            )}

            <p className="audit-trail">
              <small>
                Last modified by:{' '}
                {activeModalRecord.last_modifiedby || 'System'} on{' '}
                {activeModalRecord.last_modified}
              </small>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleUpdateRecord}
            className="modal-body edit-form"
          >
            <div className="form-group">
              <label htmlFor="edit_name">Student Name</label>
              <input
                id="edit_name"
                type="text"
                value={editFormData.student_name || ''}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    student_name: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit_score">Score (0-100)</label>
              <input
                id="edit_score"
                type="number"
                min="0"
                max="100"
                value={editFormData.score || ''}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    score: e.target.value
                  })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit_status">Status</label>
              <select
                id="edit_status"
                value={editFormData.status || 'Approved'}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.value
                  })
                }
              >
                <option value="Approved">Approved</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Grade Appeal">Grade Appeal</option>
              </select>
            </div>

            {(editFormData.status === 'Pending Review' ||
              editFormData.status === 'Grade Appeal') && (
              <div className="form-group">
                <label htmlFor="edit_reason">
                  Review / Appeal Reason
                </label>
                <input
                  id="edit_reason"
                  type="text"
                  value={editFormData.review_reason || ''}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      review_reason: e.target.value
                    })
                  }
                  required
                />
              </div>
            )}

            <div className="modal-edit-actions">
              <button type="submit" className="btn primary-btn">
                Save Changes
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn secondary-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <footer className="modal-footer">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn edit-btn"
              >
                Edit Record
              </button>

              <button
                onClick={() => handleDelete(activeModalRecord.id)}
                className="btn delete-btn"
              >
                Delete
              </button>
            </>
          )}

          <button
            onClick={closeModal}
            className="btn secondary-btn"
          >
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}
