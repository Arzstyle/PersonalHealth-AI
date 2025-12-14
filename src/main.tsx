import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NutritionProvider } from "./context/NutritionContext";
import { AuthProvider } from "./context/AuthContext";
import "./firebase"; 
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <NutritionProvider>
        <App />
      </NutritionProvider>
    </AuthProvider>
  </React.StrictMode>
);
