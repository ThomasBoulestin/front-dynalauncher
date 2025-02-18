import { useEffect, useContext } from "react";
import { PreferencesContext } from "../../context/PreferencesContext/PreferencesContext";
import { Form, InputGroup, Button } from "react-bootstrap";
import { PrefControl } from "./Prefcontrol";
import { PrefControlColor } from "./PrefcontrolColor";

export function PreferencesPage() {
  const { dispatch, night_mode, state, initialState } =
    useContext(PreferencesContext);

  useEffect(() => {}, []);

  return (
    <div>
      <div className="d-flex p-2">
        <div
          style={{ width: "9rem", alignSelf: "center", textAlign: "center" }}
        ></div>

        <div
          style={{
            borderLeft: "solid 1px",
            borderColor: "var(--bs-border-color)",
          }}
          className="ps-2"
        >
          <div className="d-flex" style={{ width: "50rem" }}>
            <Button variant="secondary" onClick={() => DYNALAUNCHER.openFile()}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-folder"
                viewBox="0 0 16 16"
              >
                <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z" />
              </svg>{" "}
              Open settings folder
            </Button>
          </div>
        </div>
      </div>
      <div className="d-flex p-2">
        <div
          style={{ width: "9rem", alignSelf: "center", textAlign: "center" }}
        >
          Night mode
        </div>

        <div
          style={{
            borderLeft: "solid 1px",
            borderColor: "var(--bs-border-color)",
          }}
          className="ps-2"
        >
          <div className="d-flex" style={{ width: "50rem" }}>
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={night_mode}
              onChange={() =>
                dispatch({ type: "set_night_mode", value: !night_mode })
              }
            />
          </div>
        </div>
      </div>

      <div className="d-flex">
        <PrefControl
          name={"LsPrePost"}
          single={true}
          action={(value) => {
            dispatch({ type: "set_LsPrePost", value: value });
          }}
        />
        <span style={{ color: "var(--bs-danger)", alignSelf: "center" }}>
          Path to lspp on CLIENT machine (not server)
        </span>
      </div>

      <div className="d-flex">
        <PrefControl
          name={"Solvers"}
          single={false}
          action={(value) => {
            dispatch({ type: "set_Solvers", value: value });
          }}
        />
        <span style={{ color: "var(--bs-danger)", alignSelf: "center" }}>
          Path to Solvers on SERVER machine
        </span>
      </div>

      <PrefControl
        name={"Expressions"}
        single={false}
        action={(value) => {
          dispatch({ type: "set_Expressions", value: value });
        }}
      />

      <PrefControl
        name={"Ncpu"}
        single={false}
        action={(value) => {
          dispatch({ type: "set_Ncpu", value: value });
        }}
      />

      <PrefControl
        name={"Memory"}
        single={false}
        action={(value) => {
          dispatch({ type: "set_Memory", value: value });
        }}
      />

      <div className="d-flex p-2">
        <div
          style={{ width: "9rem", alignSelf: "center", textAlign: "center" }}
        >
          Terminal background
        </div>

        <div
          style={{
            borderLeft: "solid 1px",
            borderColor: "var(--bs-border-color)",
          }}
          className="ps-2"
        >
          <div className="d-flex" style={{ width: "50rem" }}>
            <Form.Control
              type="color"
              value={state[0].TerminalBgColor}
              onChange={(e) => {
                dispatch({
                  type: "set_TerminalBgColor",
                  value: e.target.value,
                });
              }}
            />
            <Button
              variant="secondary"
              className="ms-3"
              onClick={(e) => {
                dispatch({
                  type: "set_TerminalBgColor",
                  value: initialstate[0].TerminalBgColor,
                });
              }}
            >
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
        </div>
      </div>
      <div className="d-flex p-2">
        <div
          style={{ width: "9rem", alignSelf: "center", textAlign: "center" }}
        >
          Terminal text
        </div>

        <div
          style={{
            borderLeft: "solid 1px",
            borderColor: "var(--bs-border-color)",
          }}
          className="ps-2"
        >
          <div className="d-flex" style={{ width: "50rem" }}>
            <Form.Control
              type="color"
              value={state[0].TerminalTextColor}
              onChange={(e) => {
                dispatch({
                  type: "set_TerminalTextColor",
                  value: e.target.value,
                });
              }}
            />
            <Button
              variant="secondary"
              className="ms-3"
              onClick={(e) => {
                dispatch({
                  type: "set_TerminalTextColor",
                  value: initialstate[0].TerminalTextColor,
                });
              }}
            >
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
        </div>
      </div>

      <PrefControlColor
        name={"TerminalColorRules"}
        action={(value) => {
          dispatch({ type: "set_TerminalColorRules", value: value });
        }}
      />
    </div>
  );
}
