import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { serverAndClient } from "../../socket/Socket";
import { createRoot } from "react-dom/client";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import { JobsContext } from "../../context/JobsContext/JobsContext";
import { PreferencesContext } from "../../context/PreferencesContext/PreferencesContext";
import { Button } from "react-bootstrap";
import { ToastContext } from "../../context/ToastContext/ToastContext";

export function QrunQkillPage() {
  const { addToast } = useContext(ToastContext);
  const [qRunJobs, setQRunJobs] = useState([]);

  const getQrunJobs = () => {
    serverAndClient
      .request("getQrunJobs")
      .then((result) => {
        setQRunJobs(result);
        addToast("primary", "Licenses", "qrun received.");
      })
      .catch((e) => addToast("danger", "Licenses", "error getting qrun."));
  };

  useEffect(() => {
    getQrunJobs();
  }, []);

  const { night_mode, state, configID } = useContext(PreferencesContext);

  const gridRef = useRef(); // Optional - for accessing Grid's API

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "user",
      width: 150,
    },
    { field: "host", width: 300 },
    { field: "program", width: 100 },
    { field: "started", width: 140 },
    { field: "procs", width: 50 },
    { field: "jobs", width: 50 },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    resizable: true,
  }));

  const handlekill = () => {
    const rows = gridRef.current.api.getSelectedRows();
    if (rows.length === 0) {
      addToast("warning", "Licenses", "Please select a job to kill.");
      return;
    }

    serverAndClient
      .request("qKillJob", { host: rows[0].host })
      .then((result) => {
        if (result.success) {
          addToast("success", "Licenses", result.message);
        } else {
          addToast("danger", "Licenses", result.message);
        }
        getQrunJobs();
      });
  };

  const getRowId = useMemo(() => {
    return (params) => params.data.host;
  }, []);

  return (
    <div>
      <div className="p-2 pb-0">
        <Button
          onClick={handlekill}
          variant="secondary"
          style={{ color: "#bb0000" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
          </svg>
        </Button>
        <Button className="ms-3" onClick={getQrunJobs} variant="secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </Button>
      </div>
      <div
        className={
          (state[configID].night_mode
            ? "ag-theme-alpine-dark"
            : "ag-theme-alpine") + " p-2"
        }
        style={{ width: "100%", height: 400 }}
      >
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={qRunJobs} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="single" // Options - allows click selection of rows
          getRowId={getRowId}
        />
      </div>
    </div>
  );
}
