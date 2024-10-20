import { LauncherForm } from "./components/LauncherForm";
import { TerminalPage } from "./components/ShellPage/TerminalsPage";

import { useState, useEffect, useContext } from "react";

import { io } from "socket.io-client";
import { JobsContext } from "./context/JobsContext/JobsContext";
import { PageSelector } from "./components/PageSelector";

import { Socket } from "./socket/Socket";
import { serverAndClient } from "./socket/Socket";
import { LoginModal } from "./components/LoginModal";
import { PreferencesContext } from "./context/PreferencesContext/PreferencesContext";

function App() {
  const { jobs, dispatch, table } = useContext(JobsContext);

  useEffect(() => {
    serverAndClient
      .request("getFullJobList")
      .then((result) => dispatch({ type: "init_table", table: result }));

    serverAndClient
      .request("getQueue")
      .then((result) => dispatch({ type: "set_queue", jobs: result }));

    serverAndClient
      .request("getRunningShells")
      .then((result) => dispatch({ type: "set_jobs", jobs: result }));

    DYNALAUNCHER.getAppVersion().then(
      (res) => (document.title = "Dyna Launcher " + res)
    );
  }, []);

  return (
    <div className="App">
      <Socket></Socket>
      <LoginModal />
      <div className="d-flex flex-column" style={{ height: "100vh" }}>
        <LauncherForm />
        <PageSelector></PageSelector>
      </div>
    </div>
  );
}

export default App;
