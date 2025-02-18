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

import { BtnRenderer } from "./Renderers";
import CustomBtnComp from "./CustomBtnComp";
import { Button } from "react-bootstrap";

export function QueueTable() {
  const { jobs, dispatch, qtable } = useContext(JobsContext);
  const { night_mode, state } = useContext(PreferencesContext);

  const gridRef = useRef(); // Optional - for accessing Grid's API

  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([
    { field: "id", hide: true, editable: true, width: 40 },
    {
      field: "actions",
      width: 60,
      headerName: "Actions",
      cellRenderer: CustomBtnComp,
    },
    {
      field: "position",
      editable: true,
      sortable: true,
      sort: "asc",
      width: 60,
    },
    { field: "input", editable: false, width: 400 },
    { field: "solver", editable: false, width: 450 },
    { field: "expr", width: 250 },
    { field: "ncpu", editable: true, width: 35 },
    { field: "memory", editable: true, width: 50 },
    { field: "command" },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: false,
    filter: false,
    resizable: true,
  }));

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    if (event.column.colId == "actions") {
      serverAndClient.request("removeFromQueue", {
        position: event.rowIndex,
      });
    }

    if (event.event.ctrlKey) {
      dispatch({ type: "set_form_data", payload: event.data });
    }
  }, []);

  const handleCellEdit = useCallback((event) => {
    if (event.column.colId == "position") {
      serverAndClient.request("switchPositionQueue", {
        initial: event.oldValue,
        new: event.newValue,
      });
    } else if (event.column.colId == "ncpu") {
      serverAndClient.request("setNcpuQueue", {
        id: event.data.id,
        ncpu: event.newValue,
      });
    }
  }, []);

  useEffect(() => {}, []);

  const getRowId = useMemo(() => {
    return (params) => params.data.id;
  }, []);

  return (
    <div
      className={
        (state[0].night_mode ? "ag-theme-alpine-dark" : "ag-theme-alpine") +
        " p-2"
      }
      style={{ width: "100%", height: 250 }}
    >
      <AgGridReact
        readOnlyEdit
        ref={gridRef} // Ref for accessing Grid's API
        rowData={qtable} // Row Data for Rows
        columnDefs={columnDefs} // Column Defs for Columns
        defaultColDef={defaultColDef} // Default Column Properties
        animateRows={true} // Optional - set to 'true' to have rows animate when sorted
        rowSelection="single" // Options - allows click selection of rows
        onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        getRowId={getRowId}
        onCellEditRequest={handleCellEdit}
      />
    </div>
  );
}
