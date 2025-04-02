import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App.tsx";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";

import { BrowserRouter } from "react-router-dom"; // Correct package for React Router v6+

import { Theme } from "@radix-ui/themes";

import '@aws-amplify/ui-react/styles.css';
import '../src/pages/Styles/styles.css';

// Configure Amplify with outputs
Amplify.configure(outputs);

// Render the root of your React app
const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <Theme appearance="dark">
      <BrowserRouter>

        {/* Wrap your app with Radix UI ThemeProvider */}
        <Authenticator>
          <App />
        </Authenticator>

      </BrowserRouter>
    </Theme>
  </StrictMode>
);
