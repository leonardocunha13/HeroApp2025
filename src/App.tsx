import { Routes, Route, Link } from 'react-router-dom';
import { Button } from '@radix-ui/themes';
import { useAuthenticator } from '@aws-amplify/ui-react';
import CreateFormDialog from './components/CreateFormDialog';
import HomePage from './pages/HomePage';
import FormStatistics from './pages/FormStatistics';
import './pages/Styles/styles.css';

const App: React.FC = () => {
  const { signOut } = useAuthenticator();

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <header className="header">
        <h1 className="logo">MyApp</h1>
      </header>

      {/* Navigation Buttons */}
      <nav className="navbar">
        <Link to="/" className="nav-link">
          <Button className="Button violet">Dashboard</Button>
        </Link>
        <Link to="/form-builder" className="nav-link">
          <Button className="Button violet">Form Builder</Button>
        </Link>
        <Link to="/form-statistics" className="nav-link">
          <Button className="Button violet">Form Statistics</Button>
        </Link>
      </nav>

      {/* Routing */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form-builder" element={<CreateFormDialog />} />
        <Route path="/form-statistics" element={<FormStatistics />} />
      </Routes>

      {/* Sign-out Button */}
      <button className="signout-btn" onClick={signOut}>Sign out</button>
    </div>
  );
};

export default App;