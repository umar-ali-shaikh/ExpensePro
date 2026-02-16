import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TransactionProvider } from "./context/TransactionProvider"
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="384702893972-0lopcm2t4fdntqsguc2plvc18gja18ir.apps.googleusercontent.com">
      <BrowserRouter>
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);