import { useState } from 'react';
import UserManagement from './components/users/UserManagement';
import OrganizationManagement from './components/organizations/OrganizationManagement';
import ActivityList from './components/activities/ActivityList';

function App() {
  const [view, setView] = useState<'users' | 'organizations' | 'activities'>('users');

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            id="tab-users"
            className={`nav-link ${view === 'users' ? 'active' : ''}`}
            onClick={() => setView('users')}
          >
            👤 Users
          </button>
        </li>
        <li className="nav-item">
          <button
            id="tab-organizations"
            className={`nav-link ${view === 'organizations' ? 'active' : ''}`}
            onClick={() => setView('organizations')}
          >
            🏢 Organizations
          </button>
        </li>
        <li className="nav-item">
          <button
            id="tab-activities"
            className={`nav-link ${view === 'activities' ? 'active' : ''}`}
            onClick={() => setView('activities')}
          >
            📋 Activities
          </button>
        </li>
      </ul>

      {view === 'users' && <UserManagement />}
      {view === 'organizations' && <OrganizationManagement />}
      {view === 'activities' && <ActivityList />}
    </div>
  );
}

export default App;
