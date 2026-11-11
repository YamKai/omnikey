import Navbar from './Navbar';
import RecordModal from './RecordModal';

export default function Dashboard({
  loggedInUser,
  isUserMenuOpen,
  setIsUserMenuOpen,
  handleSignOut,

  notification,

  setCurrentView,

  selectedModule,
  setSelectedModule,
  selectedAssessment,
  setSelectedAssessment,
  searchQuery,
  setSearchQuery,

  filteredRecords,
  openModal,

  activeModalRecord,
  isEditing,
  setIsEditing,
  setActiveModalRecord,
  editFormData,
  setEditFormData,
  handleUpdateRecord,
  handleDelete
}) {
  return (
    <div className="dashboard-wrapper">

      <Navbar
        loggedInUser={loggedInUser}
        isUserMenuOpen={isUserMenuOpen}
        setIsUserMenuOpen={setIsUserMenuOpen}
        handleSignOut={handleSignOut}
      />

      <main className="app-container dashboard-container">

        {notification.message && (
          <div
            className={`notification-banner ${notification.type}`}
            aria-live="polite"
          >
            {notification.message}
          </div>
        )}

        <header className="dashboard-header">
          <div>
            <h1>Academic Records by OmniKey</h1>
            <p>Manage and review student exam records</p>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setCurrentView('form')}
              className="btn primary-btn"
            >
              + Add Record
            </button>
          </div>
        </header>

        {/* FILTER & SEARCH CONTROLS */}
        <section
          className="controls-section"
          aria-label="Filter and Search Controls"
        >
          <div>
            <label htmlFor="module-filter">
              <strong>Filter by Module: </strong>
            </label>

            <select
              id="module-filter"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
            >
              <option value="ALL">All Modules</option>
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

          <div>
            <label htmlFor="assessment-filter">
              <strong>Filter by Assessment: </strong>
            </label>

            <select
              id="assessment-filter"
              value={selectedAssessment}
              onChange={(e) =>
                setSelectedAssessment(e.target.value)
              }
            >
              <option value="ALL">All Assessments</option>
              <option value="Final Exam">Final Exam</option>
              <option value="Midterm">Midterm</option>
              <option value="Coursework">Coursework</option>
            </select>
          </div>

          <div>
            <label htmlFor="student-search">
              <strong>Search Student: </strong>
            </label>

            <input
              id="student-search"
              type="text"
              placeholder="Type name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </section>

        {/* RECORDS TABLE */}
        <section className="table-wrapper">
          <table className="records-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Module</th>
                <th>Assessment</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.student_name}</td>
                    <td>{record.student_id}</td>
                    <td>{record.module_code}</td>

                    <td>
                      <div className="assessment-grade">
                        <div className="assessment-grade-info">
                          <span>{record.assessment}</span>

                          <span className="assessment-percentage">
                            {record.score}%
                          </span>
                        </div>

                        <div
                          className="grade-progress-track"
                          role="progressbar"
                          aria-valuenow={record.score}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          aria-label={`Grade: ${record.score}%`}
                        >
                          <div
                            className="grade-progress-fill"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(
                                  0,
                                  Number(record.score) || 0
                                )
                              )}%`
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td>
                      <button
                        onClick={() => openModal(record)}
                        className="btn details-btn"
                        aria-label={`View or edit details for ${record.student_name}`}
                      >
                        View / Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* RECORD MODAL */}
        <RecordModal
          activeModalRecord={activeModalRecord}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setActiveModalRecord={setActiveModalRecord}
          editFormData={editFormData}
          setEditFormData={setEditFormData}
          handleUpdateRecord={handleUpdateRecord}
          handleDelete={handleDelete}
        />

      </main>
    </div>
  );
}
