import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

import {
  ThemeProvider,
  ColorMode,
  Theme,
  Authenticator,
} from "@aws-amplify/ui-react";

import { BrowserRouter } from "react-router-dom";
import "@aws-amplify/ui-react/styles.css"; // Optional: remove if using Tailwind for all styling
import "../src/pages/Styles/styles.css"; // Tailwind base styles

// Optional: use dark mode by default
const colorMode: ColorMode = "dark";

// Optional: You can remove this if you're using Tailwind for styling instead of Amplify tokens
const theme: Theme = {
  name: "my-dark-theme",
  overrides: [
    {
      colorMode: "dark",
      tokens: {
        colors: {
          font: {
            primary: { value: "{colors.black.100}" },
            secondary: { value: "{colors.black.90}" },
            tertiary: { value: "{colors.black.80}" },
          },
          background: {
            primary: { value: "{colors.blue.10}" },
            secondary: { value: "{colors.blue.20}" },
            tertiary: { value: "{colors.blue.40}" },
          },
          border: {
            primary: { value: "{colors.black.60}" },
            secondary: { value: "{colors.black.40}" },
            tertiary: { value: "{colors.black.20}" },
          },
        },
      },
    },
  ],
};

Amplify.configure(outputs);

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Authenticator>
        <ThemeProvider theme={theme} colorMode={colorMode}>
          <App />
        </ThemeProvider>
      </Authenticator>
    </BrowserRouter>
  </StrictMode>
);
