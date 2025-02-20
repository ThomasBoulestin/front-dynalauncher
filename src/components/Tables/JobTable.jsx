import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

import {
  ProgressRenderer,
  StatusRenderer,
  DurationTimeStampRenderer,
  DateTimeStampRenderer,
} from "./Renderers";

import { PreferencesContext } from "../../context/PreferencesContext/PreferencesContext";
import { JobsContext } from "../../context/JobsContext/JobsContext";
import { ToastContext } from "../../context/ToastContext/ToastContext";

export function JobTable() {
  const { jobs, dispatch, table } = useContext(JobsContext);
  const { night_mode, state, configID } = useContext(PreferencesContext);
  const { addToast } = useContext(ToastContext);

  const gridRef = useRef(); // Optional - for accessing Grid's API

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "id",
      cellStyle: { color: "#0d6efd" },
      width: 40,
      sortable: true,
      sort: "desc",
    },
    { field: "input", width: 250, filter: true },
    { field: "command", filter: true },
    { field: "ncpu", width: 55 },
    { field: "memory", width: 80 },
    {
      field: "status",
      width: 100,
      cellRenderer: StatusRenderer,
      cellStyle: { color: "#000000" },
    },
    {
      field: "progress",
      width: 100,
      cellRenderer: ProgressRenderer,
      hide: true,
    },
    { field: "started", width: 120, cellRenderer: DateTimeStampRenderer },
    { field: "ETA", width: 100, cellRenderer: DurationTimeStampRenderer },
    {
      field: "elapsed",
      width: 100,
      cellRenderer: DurationTimeStampRenderer,
    },
    { field: "current", width: 80 },
    { field: "end", width: 45 },
    { field: "pid", width: 45 },
    { field: "a_mass", hide: false, width: 45 },
    { field: "pct_mass", hide: false, width: 45 },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = (event) => {
    if (event.event.ctrlKey) {
      dispatch({ type: "set_form_data", payload: event.data });
    }
    if (event.event.shiftKey) {
      if (state[configID].server_home_dir === "") {
        DYNALAUNCHER.openFile(event.data.input);
      } else {
        DYNALAUNCHER.openFile(
          event.data.input.replace(
            state[configID].server_home_dir,
            state[configID].client_home_dir
          )
        );
      }
    }
    if (event.event.altKey) {
      const d3path =
        event.data.input.substring(0, event.data.input.lastIndexOf("\\")) +
        "\\d3plot";

      let _command = "";
      if (state[configID].server_home_dir === "") {
        _command = '"' + state[configID].LsPrePost + '" "' + d3path + '"';
      } else {
        _command =
          '"' +
          state[configID].LsPrePost +
          '" "' +
          d3path.replace(
            state[configID].server_home_dir,
            state[configID].client_home_dir
          );
      }
      addToast("primary", "d3plot", "Opening d3plot ...");
      DYNALAUNCHER.executeCommand(_command)
        .then()
        .catch((e) => {
          addToast("danger", "Error", e.message, 5000);
        });
    }
  };

  useEffect(() => {}, []);

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);

  return (
    <div
      className={
        (state[configID].night_mode
          ? "ag-theme-alpine-dark"
          : "ag-theme-alpine") + " p-2 pt-0"
      }
      style={{ width: "100%", flex: "1 1 auto", overflow: "auto" }}
    >
      <AgGridReact
        ref={gridRef} // Ref for accessing Grid's API
        rowData={table} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection="single" // Options - allows click selection of rows
        onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        getRowId={getRowId}
      />
    </div>
  );
}
