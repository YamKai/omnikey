export default function RecordForm({
  newRecord,
  setNewRecord,
  handleAddRecord,
  setCurrentView
}) {
  return (
    <main className="app-container form-container">
      <header className="view-header">
        <h1>Add New Exam Record</h1>

        <button
          onClick={() => setCurrentView('dashboard')}
          className="btn secondary-btn"
        >
          Back to Dashboard
        </button>
      </header>

      <form onSubmit={handleAddRecord} className="record-form">
        <div className="form-group">
          <label htmlFor="student_name">Student Full Name</label>
          <input
            id="student_name"
            type="text"
            value={newRecord.student_name}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                student_name: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="student_id">Student ID</label>
          <input
            id="student_id"
            type="text"
            value={newRecord.student_id}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                student_id: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="module_code">Module Code</label>
          <select
            id="module_code"
            value={newRecord.module_code}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                module_code: e.target.value
              })
            }
          >
            <option value="CS101 - Algorithms">
              CS101 - Algorithms
            </option>
            <option value="AI402 - Neural Networks">
              AI402 - Neural Networks
            </option>
            <option value="SE305 - Software Engineering">
              SE305 - Software Engineering
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assessment">Assessment Type</label>
          <select
            id="assessment"
            value={newRecord.assessment}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                assessment: e.target.value
              })
            }
          >
            <option value="Final Exam">Final Exam</option>
            <option value="Midterm">Midterm</option>
            <option value="Coursework">Coursework</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="score">Score (0-100)</label>
          <input
            id="score"
            type="number"
            min="0"
            max="100"
            value={newRecord.score}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                score: e.target.value
              })
            }
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Grade Status</label>
          <select
            id="status"
            value={newRecord.status}
            onChange={(e) =>
              setNewRecord({
                ...newRecord,
                status: e.target.value
              })
            }
          >
            <option value="Approved">Approved</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Grade Appeal">Grade Appeal</option>
          </select>
        </div>

        {(newRecord.status === 'Pending Review' ||
          newRecord.status === 'Grade Appeal') && (
          <div className="form-group dynamic-field">
            <label htmlFor="review_reason">
              Review / Appeal Reason
            </label>
            <input
              id="review_reason"
              type="text"
              value={newRecord.review_reason}
              onChange={(e) =>
                setNewRecord({
                  ...newRecord,
                  review_reason: e.target.value
                })
              }
              required
            />
          </div>
        )}

        <button type="submit" className="btn primary-btn">
          Save Record to Database
        </button>
      </form>
    </main>
  );
}
