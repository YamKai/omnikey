import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import RecordForm from './components/RecordForm';
import { API_URL } from './config';

export default function App() {
  const [currentView, setCurrentView] = useState('login');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loginError, setLoginError] = useState('');

  // Navbar user dropdown state
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Data states
  const [records, setRecords] = useState([]);

  // Filter & Search states
  const [selectedModule, setSelectedModule] = useState('ALL');
  const [selectedAssessment, setSelectedAssessment] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Notification Banner State (Accessibility / Usability)
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Modal State
  const [activeModalRecord, setActiveModalRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Form state for creating a new record
  const [newRecord, setNewRecord] = useState({
    student_name: '',
    student_id: '',
    module_code: 'CS101 - Algorithms',
    assessment: 'Final Exam',
    score: '',
    status: 'Approved',
    review_reason: '',
  });

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchRecords();
    }
  }, [currentView]);

  // Accessibility: Listen for 'Esc' key to close modal or user menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activeModalRecord) {
          setActiveModalRecord(null);
          setIsEditing(false);
        }
        if (isUserMenuOpen) {
          setIsUserMenuOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalRecord, isUserMenuOpen]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 4000);
  };

  const fetchRecords = async () => {
    try {
      const res = await fetch('/records');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error('Failed to fetch records', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        setLoggedInUser(data.user);
        setCurrentView('dashboard');
        showNotification(`Welcome back, Prof. ${data.user.user_name}.`);
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Server connection failed');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newRecord,
        score: Number(newRecord.score),
        last_modifiedby: loggedInUser ? loggedInUser.user_name : 'Admin'
      };

      const res = await fetch(`${API_URL}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchRecords();
        setCurrentView('dashboard');
        setNewRecord({
          student_name: '',
          student_id: '',
          module_code: 'CS101 - Algorithms',
          assessment: 'Final Exam',
          score: '',
          status: 'Approved',
          review_reason: '',
        });
        showNotification('New exam record successfully created.');
      }
    } catch (err) {
      console.error('Failed to create record', err);
    }
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editFormData,
        score: Number(editFormData.score),
        last_modifiedby: loggedInUser ? loggedInUser.user_name : 'Admin'
      };

      const res = await fetch(`${API_URL}/records/${editFormData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchRecords();
        setIsEditing(false);
        setActiveModalRecord(null);
        showNotification(`Record #${editFormData.id} updated successfully.`);
      }
    } catch (err) {
      console.error('Failed to update record', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      const res = await fetch(`${API_URL}/records/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setActiveModalRecord(null);
        fetchRecords();
        showNotification(`Record #${id} deleted successfully.`, 'error');
      }
    } catch (err) {
      console.error('Failed to delete record', err);
    }
  };

  const openModal = (record) => {
    setActiveModalRecord(record);
    setEditFormData(record);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    setLoggedInUser(null);
    setCurrentView('login');
  };

  // Filter & Search logic (Module + Assessment Type + Student Search)
  const filteredRecords = records.filter(record => {
    const matchesModule = selectedModule === 'ALL' || record.module_code === selectedModule;
    const matchesAssessment = selectedAssessment === 'ALL' || record.assessment === selectedAssessment;
    const matchesSearch = searchQuery === '' ||
      record.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.student_id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesModule && matchesAssessment && matchesSearch;
  });

  // 1. LOGIN VIEW
  if (currentView === 'login') {
    return (
      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginError={loginError}
        handleLogin={handleLogin}
      />
    );
  }

  // 2. DATA-ENTRY FORM VIEW
  if (currentView === 'form') {
    return (
      <RecordForm
        newRecord={newRecord}
        setNewRecord={setNewRecord}
        handleAddRecord={handleAddRecord}
        setCurrentView={setCurrentView}
      />
    );
  }

  // 3. DASHBOARD VIEW
  return (
    <Dashboard
      loggedInUser={loggedInUser}
      isUserMenuOpen={isUserMenuOpen}
      setIsUserMenuOpen={setIsUserMenuOpen}
      handleSignOut={handleSignOut}
      notification={notification}
      setCurrentView={setCurrentView}
      selectedModule={selectedModule}
      setSelectedModule={setSelectedModule}
      selectedAssessment={selectedAssessment}
      setSelectedAssessment={setSelectedAssessment}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      filteredRecords={filteredRecords}
      openModal={openModal}
      activeModalRecord={activeModalRecord}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      setActiveModalRecord={setActiveModalRecord}
      editFormData={editFormData}
      setEditFormData={setEditFormData}
      handleUpdateRecord={handleUpdateRecord}
      handleDelete={handleDelete}
    />
  );
}
