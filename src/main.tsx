import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";

import { BrowserRouter } from "react-router-dom"; // Correct package for React Router v6+

import "./index.css";
import '@aws-amplify/ui-react/styles.css';

// Configure Amplify with outputs
Amplify.configure(outputs);

// Render the root of your React app
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Authenticator>
        <App />
      </Authenticator>
    </BrowserRouter>
  </React.StrictMode>
);
