import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import FormBuilder from '../actions/form';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { GetClients } from '../actions/form'; // Import your function

const App: React.FC = () => {
  const { signOut } = useAuthenticator();
  const [clients, setClients] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>("");

  useEffect(() => {
    async function loadClients() {
      try {
        const clientList = await GetClients(); // Fetch clients from form.tsx
        setClients(clientList);
      } catch (error) {
        console.error("Failed to load clients", error);
      }
    }
    loadClients();
  }, []);

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(event.target.value);
    console.log("Selected Client:", event.target.value);
  };

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
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none' }}>
            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Home
            </button>
          </Link>
          <Link to="/form-builder" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Form Builders
            </button>
          </Link>
        </div>

        {/* Dropdown for Client Selection */}
        <select value={selectedClient} onChange={handleClientChange} style={{ padding: '10px', fontSize: '16px' }}>
          <option value="">Select Client</option>
          {clients.map((client, index) => (
            <option key={index} value={client}>
              {client}
            </option>
          ))}
        </select>
      </nav>

      {/* Routing between Home and Form Builder pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form-builder" element={<FormBuilder />} />
      </Routes>

      <button onClick={signOut} style={{ marginTop: '20px', padding: '10px', cursor: 'pointer' }}>Sign out</button>
    </div>
  );
};

export default App;
