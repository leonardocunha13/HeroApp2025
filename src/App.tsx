import { Route, Routes, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './pages/Styles/styles.css';
import { useAuthenticator, Text, Menu, MenuItem, Divider, Button } from '@aws-amplify/ui-react';
import HomePage from '../src/pages/HomePage';
import CreateFormDialog from '../src/components/CreateFormDialog';
import CollectionForms from '../src/pages/RunForm';
import RunningForm from '../src/pages/RunningForm';
//import DynamicFormBuilder from './pages/BuildForm';
import { FiSun, FiMoon } from 'react-icons/fi';
import ProjectLog from '../src/pages/ProjectLog';
import FormBuilder from './pages/BuildForm';

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
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.22)' : ' rgb(255, 243, 135)',
          alignItems: 'center',
          padding: '30px 24px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          transition: 'background-color 0.3s ease',
          //backgroundColor: '#ffffff',
        }}
      >
        {/* Logo */}
        <img
          src="\logo.png"
          alt="App Logo"
          style={{ width: '300px', height: '100px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '10px' }}

        />
        {/* Top Bar Content */}
        <Menu
          menuAlign="start"
          style={{
            backgroundColor: darkMode ? '#fff' : '#fff',
            color: darkMode ? '#000' : '#000', // <- texto preto no dark
            border: darkMode ? '1px solid #444' : '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
          }}
        >
          <MenuItem isDisabled>
            <Text fontWeight="bold" style={{ color: darkMode ? '#000' : '#000' }}>
              Hero Audit Form Builder
            </Text>
          </MenuItem>
          <Divider style={{ backgroundColor: '#ccc' }} />

          <MenuItem style={{ color: darkMode ? '#000' : '#000' }}>
            <Link to="/" style={{ textDecoration: 'none', color: darkMode ? '#000' : '#000' }}>Home</Link>
          </MenuItem>
          <MenuItem style={{ color: darkMode ? '#000' : '#000' }}>
            <Link to="/forms" style={{ textDecoration: 'none', color: darkMode ? '#000' : '#000' }}>Create New Form</Link>
          </MenuItem>
          <MenuItem style={{ color: darkMode ? '#000' : '#000' }}>
            <Link to="/forms-list" style={{ textDecoration: 'none', color: darkMode ? '#000' : '#000' }}>Forms List</Link>
          </MenuItem>
          <MenuItem style={{ color: darkMode ? '#000' : '#000' }}>
            <Link to="/form-builder" style={{ textDecoration: 'none', color: darkMode ? '#000' : '#000' }}>Form Builder</Link>
          </MenuItem>
          <MenuItem style={{ color: darkMode ? '#000' : '#000' }}>
            <Link to="/projectLog" style={{ textDecoration: 'none', color: darkMode ? '#000' : '#000' }}>Project Log</Link>
          </MenuItem>
          <Divider style={{ backgroundColor: '#ccc' }} />
          <MenuItem
            onClick={signOut}
            style={{
              color: darkMode ? '#000' : '#000',
              backgroundColor: darkMode ? '#e0e0e0' : '#6f6e72',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
              width: '100%',
              textAlign: 'left',
            }}
          >
            Sign out
          </MenuItem>
        </Menu>


        <div>
          <Button
            onClick={toggleDarkMode}
            style={{
              backgroundColor: darkMode ? '#333' : '#e0e0e0',
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
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ marginTop: '60px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/forms" element={<CreateFormDialog onFormCreated={() => { console.log("Form created!"); }} />} />
          <Route path="/forms-list" element={<CollectionForms />} />
          <Route path="/form-builder" element={<FormBuilder />} />
          <Route path="/RunningForm" element={<RunningForm />} /> {/* Add this route */}
          <Route path="/projectLog" element={<ProjectLog />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
