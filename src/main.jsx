import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/general.css";
import { JobsState } from "./context/JobsContext/JobsContext.jsx";
import { PreferencesState } from "./context/PreferencesContext/PreferencesContext.jsx";
import { ToastState } from "./context/ToastContext/ToastContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  //   <React.StrictMode>
  <PreferencesState>
    <JobsState>
      <ToastState>
        <App />
      </ToastState>
    </JobsState>
  </PreferencesState>
  //   </React.StrictMode>
);
