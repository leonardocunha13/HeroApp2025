import { Tabs, Text } from '@aws-amplify/ui-react';
import { useEffect } from 'react';
import './pages/Styles/styles.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import HomePage from '../src/pages/HomePage';
import CreateFormDialog from '../src/components/CreateFormDialog';
import CollectionForms from '../src/pages/RunForm';
import DynamicFormBuilder from './pages/BuildForm';
import { FiSun, FiMoon } from 'react-icons/fi';

const App: React.FC = () => {

  const { signOut } = useAuthenticator();
  const [tab, setTab] = useState('1');
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
        <Text color={darkMode ? 'white' : 'black'}>Hero Audit Form Builder</Text>
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
      <div style={{ marginTop: '60px' }}> {/* Add margin to avoid content being hidden behind the top bar */}
        {/* Tabs */}
        <Tabs
          value={tab}
          onValueChange={(tab) => setTab(tab)}
          className={darkMode ? 'tabs dark' : 'tabs'}
          items={[
            {
              label: 'Home',
              value: '1',
              content: <HomePage />,
            },
            {
              label: 'Forms',
              value: '2',
              content: <CreateFormDialog />,
            },
            {
              label: 'Forms List',
              value: '3',
              content: <CollectionForms />,
            },
             {
              label: 'Form Builder',
              value: '4',
              content: <DynamicFormBuilder />,
            },
          ]}
        />
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