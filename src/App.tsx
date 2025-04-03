import { Tabs, Text } from '@aws-amplify/ui-react';
import * as Avatar from '@radix-ui/react-avatar';
import './pages/Styles/styles.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useState } from 'react';
import HomePage from '../src/pages/HomePage';
import CreateFormDialog from '../src/components/CreateFormDialog';
import CollectionForms from '../src/pages/RunForm';
import { FiSun, FiMoon } from 'react-icons/fi';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [tab, setTab] = useState('1');
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Top Bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 24px',
          backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.1)',
          zIndex: 10,
          transition: 'background-color 0.3s ease',
        }}
      >
        {/* App Name */}
        <Text
          fontWeight="bold"
          fontSize="large"
          style={{ fontSize: '24px', color: darkMode ? '#fdd835' : '#222' }}
        >
          Hero Engineering Audit App
        </Text>

        {/* Right Side: Dark Mode Toggle + Avatar */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginRight: '16px',
              color: darkMode ? '#fdd835' : '#333',
              fontSize: '20px',
              transition: 'color 0.3s',
            }}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Avatar */}
          <Avatar.Root style={{ display: 'inline-block', position: 'relative' }}>
            <Avatar.Image
              src=""
              alt="User Avatar"
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'transparent',
                objectFit: 'cover',
                boxShadow: darkMode
                  ? '0 2px 6px rgba(255, 255, 255, 0.2)'
                  : '0 2px 6px rgba(0, 0, 0, 0.1)',
                transition: 'box-shadow 0.3s ease',
              }}
            />
            <Avatar.Fallback
              delayMs={600}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: darkMode ? '#555' : '#ddd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6f6e72',
                fontSize: '18px',
              }}
            >
              {'H'}
            </Avatar.Fallback>
          </Avatar.Root>

          {/* Username */}
          <Text
            style={{
              marginLeft: '12px',
              fontSize: '16px',
              fontWeight: '500',
              color: darkMode ? '#eee' : '#333',
              transition: 'color 0.3s',
            }}
          >
            {'Hero'}
          </Text>
        </div>
      </div>

      {/* Main Content */}

      <Tabs
        value={tab}
        onValueChange={(tab) => setTab(tab)}
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
        ]}
        
      />

      {/* Sign-out Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={signOut}
          style={{
            backgroundColor: '#6f6e72',
            color: '#000000',
            padding: '10px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            width: '100%'
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#f8f9fa')
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#6f6e72')
          }
        >
          Sign out
        </button>
      </div>
    </div>
  );
};

export default App;