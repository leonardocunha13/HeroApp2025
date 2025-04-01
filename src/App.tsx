import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from '../src/(dashboard)/page';
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
        
        <div>
          <Link to="/form-builder" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Form Builder
            </button>
          </Link>
        </div>
      </nav>

      {/* Routing between Home and Form Builder pages */}
      <Routes>
         <Route path="/form-builder" element={<Home />} />
      </Routes>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
};

export default App;
