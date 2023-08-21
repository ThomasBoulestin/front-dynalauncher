import { useEffect, useState, useContext } from "react";
import { Nav } from "react-bootstrap";

import { TerminalPage } from "./ShellPage/TerminalsPage";
import { JobTable } from "./Tables/JobTable";
import { QueueTable } from "./Tables/QueueTable";
import { PreferencesPage } from "./Preferences/PreferencesPage";
import { JobsContext } from "../context/JobsContext/JobsContext";
import { QrunQkillPage } from "./QrunQkillPage/QrunQkillPage";

export function PageSelector() {
  const [selected, setSelected] = useState("tables");

  const { dispatch } = useContext(JobsContext);

  useEffect(() => {}, []);

  const deletAll = () => {
    dispatch({ type: "remove_all_non_running" });
  };

  return (
    <div
      className="p-2  d-flex flex-column"
      style={{ flex: "1 1 auto", overflow: "auto" }}
    >
      <Nav variant="tabs" onSelect={(eventKey) => setSelected(eventKey)}>
        <Nav.Item>
          <Nav.Link eventKey="tables" active={selected === "tables"}>
            📅 Tables
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="shells"
            active={selected === "shells"}
            onDoubleClick={deletAll}
          >
            📟 Terminals
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="licenses" active={selected === "licenses"}>
            💸 Licenses
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="settings" active={selected === "settings"}>
            ⚙️ Settings
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <div
        className="p-0"
        style={{
          borderBottom: "solid 1px",
          borderLeft: "solid 1px",
          borderRight: "solid 1px",
          borderBottomLeftRadius: "0.375rem",
          borderBottomRightRadius: "0.375rem",
          borderColor: "var(--bs-border-color)",
          flex: "1 1 auto",
          overflow: "auto",
        }}
      >
        {selected === "tables" && (
          <div className="d-flex flex-column h-100">
            <QueueTable />
            <JobTable />
          </div>
        )}
        {selected === "shells" && <TerminalPage></TerminalPage>}
        {selected === "settings" && <PreferencesPage></PreferencesPage>}
        {selected === "licenses" && <QrunQkillPage></QrunQkillPage>}
      </div>

      {(selected === "tables" || selected === "shells") && (
        <div className="d-flex pt-0" style={{ color: "#838383" }}>
          <div className="flex-fill text-center">ctrl + click to fill form</div>
          <div className="flex-fill text-center">
            shift + click to open file explorer
          </div>
          <div className="flex-fill text-center">
            alt + click to open d3plot in lspp
          </div>
        </div>
      )}
    </div>
  );
}
