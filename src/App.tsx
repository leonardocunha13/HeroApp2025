import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import FormBuilder from './pages/FormBuilder';
import { useAuthenticator } from '@aws-amplify/ui-react'

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
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
        <h1 style={{ margin: 0, fontSize: '24px' }}>Dynamic Form Builder</h1>
        <div>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>
            Home
          </Link>
          <Link to="/form-builder" style={{ textDecoration: 'none' }}>
            Form Builder
          </Link>
        </div>
      </nav>

      {/* Routing between Home and Form Builder pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form-builder" element={<FormBuilder />} />
      </Routes>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default App;
