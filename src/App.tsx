import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import FormBuilder from '../actions/form';
import { useAuthenticator } from '@aws-amplify/ui-react'

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '20px',
          borderBottom: '2px solid #ccc',
        }}
      >
        
        <div>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Home
            </button>
          </Link>
          <Link to="/form-builder" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Form Builder
            </button>
          </Link>
        </div>
      </nav>

      {/* Routing */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form-builder" element={<CreateFormDialog />} />
        <Route path="/form-statistics" element={<FormStatistics />} />
      </Routes>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default App;