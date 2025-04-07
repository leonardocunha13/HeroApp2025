import { Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './pages/Styles/styles.css';
import { useAuthenticator, Text } from '@aws-amplify/ui-react';
import HomePage from '../src/pages/HomePage';
import CreateFormDialog from '../src/components/CreateFormDialog';
import CollectionForms from '../src/pages/RunForm';
import DynamicFormBuilder from './pages/BuildForm';
import { FiSun, FiMoon } from 'react-icons/fi';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Router Setup */}
      
        {/* Top Bar */}
        <div
          className={`top-bar ${darkMode ? 'dark' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 24px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
            zIndex: 10,
            transition: 'background-color 0.3s ease',
          }}
        >
          {/* Top Bar Content */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text color={darkMode ? 'white' : 'black'}>Hero Audit Form Builder</Text>
            <nav style={{ marginLeft: '20px' }}>
              <Link to="/" style={{ margin: '0 10px' }}>
                Home
              </Link>
              <Link to="/forms" style={{ margin: '0 10px' }}>
                Forms
              </Link>
              <Link to="/forms-list" style={{ margin: '0 10px' }}>
                Forms List
              </Link>
              <Link to="/form-builder" style={{ margin: '0 10px' }}>
                Form Builder
              </Link>
            </nav>
          </div>

          <div>
            <button
              onClick={toggleDarkMode}
              style={{
                backgroundColor: darkMode ? 'transparent' : '#444',
                color: darkMode ? '#fff' : '#000',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                marginLeft: '12px',
              }}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ marginTop: '60px' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forms" element={<CreateFormDialog />} />
            <Route path="/forms-list" element={<CollectionForms />} />
            <Route path="/form-builder" element={<DynamicFormBuilder />} />
          </Routes>
        </div>

        {/* Sign-out Button */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            onClick={signOut}
            style={{
              backgroundColor: darkMode ? '#444' : '#6f6e72',
              color: darkMode ? '#fff' : '#000',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '100%',
            }}
          >
            Sign out
          </button>
        </div>
      
    </div>
  );
};

export default App;