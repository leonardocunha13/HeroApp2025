import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import {
  ThemeProvider,
  ColorMode,
  Theme,
  Authenticator,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter } from 'react-router-dom'; // Correct package for React Router v6+

// Set colorMode to dark for the entire app
const colorMode: ColorMode = 'dark';

// Custom theme overrides for dark mode
const theme: Theme = {
  name: 'my-dark-theme',
  overrides: [
    {
      colorMode: 'dark',
      tokens: {
        colors: {
          font: {
            primary: { value: '{colors.black.100}' },
            secondary: { value: '{colors.black.90}' },
            tertiary: { value: '{colors.black.80}' },
          },
          background: {
            primary: { value: '{colors.blue.10}' },
            secondary: { value: '{colors.blue.20}' },
            tertiary: { value: '{colors.blue.40}' },
          },
          border: {
            primary: { value: '{colors.black.60}' },
            secondary: { value: '{colors.black.40}' },
            tertiary: { value: '{colors.black.20}' },
          },
        },
      },
    },
  ],
};

// Configure Amplify with outputs
Amplify.configure(outputs);

// Render the root of your React app
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <BrowserRouter>
      {/* Wrap your app with Authenticator and ThemeProvider */}
      <Authenticator>
        {/* Apply dark theme globally using ThemeProvider */}
        <ThemeProvider theme={theme} colorMode={colorMode}>
          <App />
        </ThemeProvider>
      </Authenticator>
    </BrowserRouter>
  </StrictMode>
);