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
  const { state, configID } = useContext(PreferencesContext);

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

    DYNALAUNCHER.getAppVersion().then((res) => {
      // document.title = "Dyna Launcher " + res

      document.getElementsByClassName("cet-icon")[0].childNodes[0].style.width =
        "20px";

      document.getElementsByClassName("cet-menubar")[0].remove();

      document.getElementsByClassName("cet-title")[0].innerHTML =
        "Dyna Launcher " + res;
    });
  }, []);

  return (
    <div className="App">
      <Socket></Socket>
      <LoginModal />
      <div
        className="d-flex flex-column"
        id="main-frame"
        style={{
          height: "calc(100vh - 30px)",
          borderColor: state[configID].accentColor,
          borderWidth: "5px",
          borderStyle: "solid",
          borderRadius: "10px",
        }}
      >
        <LauncherForm />
        <PageSelector></PageSelector>
      </div>
    </div>
  );
}

export default App;
