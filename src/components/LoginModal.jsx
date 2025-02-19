import { useEffect, useState, useContext } from "react";
import { Modal, Button, Form, InputGroup, Card } from "react-bootstrap";
import { socket } from "../socket/Socket";
import { PreferencesContext } from "../context/PreferencesContext/PreferencesContext";
import { motion } from "framer-motion";
import { CiSettings } from "react-icons/ci";

export function LoginModal() {
  const { dispatch, state, configID, setConfigID } =
    useContext(PreferencesContext);

  const [show, setShow] = useState(true);

  const [errorMessage, setErrorMessage] = useState(" ");

  const [currID, setCurrID] = useState(0);

  const setTitleBar = (version) => {
    document.getElementsByClassName("cet-title")[0].innerHTML =
      "Dyna Launcher " +
      version +
      " -- " +
      state[currID].server_address +
      ":" +
      state[currID].server_port;
  };

  const appendTitleBar = (text) => {
    document.getElementsByClassName("cet-title")[0].innerHTML += text;
  };

  useEffect(() => {
    socket.on("connect_error", (err) => {
      setErrorMessage("Can not connect to server.");
      socket.disconnect();
      setShow(true);
    });

    socket.on("disconnect", (e) => {
      setShow(false);
      setErrorMessage(" ");
    });

    socket.on("connect", (e) => {
      setShow(false);
      setErrorMessage(" ");

      //   document.getElementsByClassName("cet-titlebar")[0].style.backgroundColor =
      //     "#8584f0";
    });
    socket.on("connect_failed", (err) => {
      setErrorMessage("Can not connect to server.");

      socket.disconnect();
      setShow(true);
    });

    socket.io.on("close", (err) => {
      setShow(true);
      //   if (socket.connected) {
      //     DYNALAUNCHER.showNotification(
      //       "Connection",
      //       "You have been disconnected from server."
      //     );
      //   }
    });
  }, []);

  function handleChangeUri(id = 0) {
    setConfigID(id);
    setCurrID(id);

    setErrorMessage("");
    socket.io.uri = state[id].server_address + ":" + state[id].server_port;

    document.getElementById("main-frame").style.borderColor =
      state[id].accent_color;

    appendTitleBar(
      " --- " + state[id].server_address + ":" + state[id].server_port
    );
    // socket.disconnect();
    try {
      console.log("connect");
      socket.connect();
    } catch {
      console.log("wrong url");
    }
  }

  function handleKeyPress(target) {
    if (target.keyCode == 13) {
      handleChangeUri();
    }
  }

  function isLocalhost(text) {
    if (text === "localhost") {
      return true;
    }

    if (text.includes("127.0.0")) {
      return true;
    }

    return false;
  }

  return (
    <Modal aria-labelledby="contained-modal-title-vcenter" centered show={show}>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Connection to server
        </Modal.Title>
        <Button
          variant="secondary"
          className="mt-0 p-1"
          onClick={() => DYNALAUNCHER.openFile()}
        >
          <CiSettings size="22" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        {state.map((e, i) => {
          return (
            <MachineDefinition
              key={i}
              id={i}
              handleKeyPress={handleKeyPress}
              handleChangeUri={handleChangeUri}
            />
          );
        })}

        {errorMessage !== "" && (
          <div
            className="mt-2"
            style={{ color: "#bb0000", fontWeight: "bold" }}
          >
            {errorMessage}
          </div>
        )}

        {errorMessage === "" && !socket.active && (
          <div className="mt-4 w-50 mx-auto">
            <motion.div
              animate={{ x: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-rocket-takeoff"
                viewBox="0 0 16 16"
              >
                <path d="M9.752 6.193c.599.6 1.73.437 2.528-.362.798-.799.96-1.932.362-2.531-.599-.6-1.73-.438-2.528.361-.798.8-.96 1.933-.362 2.532Z" />
                <path d="M15.811 3.312c-.363 1.534-1.334 3.626-3.64 6.218l-.24 2.408a2.56 2.56 0 0 1-.732 1.526L8.817 15.85a.51.51 0 0 1-.867-.434l.27-1.899c.04-.28-.013-.593-.131-.956a9.42 9.42 0 0 0-.249-.657l-.082-.202c-.815-.197-1.578-.662-2.191-1.277-.614-.615-1.079-1.379-1.275-2.195l-.203-.083a9.556 9.556 0 0 0-.655-.248c-.363-.119-.675-.172-.955-.132l-1.896.27A.51.51 0 0 1 .15 7.17l2.382-2.386c.41-.41.947-.67 1.524-.734h.006l2.4-.238C9.005 1.55 11.087.582 12.623.208c.89-.217 1.59-.232 2.08-.188.244.023.435.06.57.093.067.017.12.033.16.045.184.06.279.13.351.295l.029.073a3.475 3.475 0 0 1 .157.721c.055.485.051 1.178-.159 2.065Zm-4.828 7.475.04-.04-.107 1.081a1.536 1.536 0 0 1-.44.913l-1.298 1.3.054-.38c.072-.506-.034-.993-.172-1.418a8.548 8.548 0 0 0-.164-.45c.738-.065 1.462-.38 2.087-1.006ZM5.205 5c-.625.626-.94 1.351-1.004 2.09a8.497 8.497 0 0 0-.45-.164c-.424-.138-.91-.244-1.416-.172l-.38.054 1.3-1.3c.245-.246.566-.401.91-.44l1.08-.107-.04.039Zm9.406-3.961c-.38-.034-.967-.027-1.746.163-1.558.38-3.917 1.496-6.937 4.521-.62.62-.799 1.34-.687 2.051.107.676.483 1.362 1.048 1.928.564.565 1.25.941 1.924 1.049.71.112 1.429-.067 2.048-.688 3.079-3.083 4.192-5.444 4.556-6.987.183-.771.18-1.345.138-1.713a2.835 2.835 0 0 0-.045-.283 3.078 3.078 0 0 0-.3-.041Z" />
                <path d="M7.009 12.139a7.632 7.632 0 0 1-1.804-1.352A7.568 7.568 0 0 1 3.794 8.86c-1.102.992-1.965 5.054-1.839 5.18.125.126 3.936-.896 5.054-1.902Z" />
              </svg>
            </motion.div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

function MachineDefinition({ id = 0, handleKeyPress, handleChangeUri }) {
  const { dispatch, state } = useContext(PreferencesContext);

  //   function handleKeyPress(target) {}
  //   function handleChangeUri(target) {}

  return (
    <Card
      className="mb-2"
      style={{ borderColor: state[id].accent_color, borderWidth: "3px" }}
    >
      <Card.Header>
        <Form.Control
          type="text"
          value={state[id].name}
          onChange={(e) =>
            dispatch({ type: "set_name", value: e.target.value, id: id })
          }
          onKeyDown={handleKeyPress}
        />

        <Form.Control
          type="color"
          value={state[id].accent_color}
          onChange={(e) => {
            dispatch({
              type: "set_accent_color",
              value: e.target.value,
              id: id,
            });
          }}
        />
      </Card.Header>
      <Card.Body>
        <div className="machine-definition">
          <InputGroup>
            <Form.Control
              type="text"
              value={state[id].server_address}
              onChange={(e) =>
                dispatch({
                  type: "set_server_address",
                  value: e.target.value,
                  id: id,
                })
              }
              onKeyDown={handleKeyPress}
            />
            <InputGroup.Text>{":"}</InputGroup.Text>
            <Form.Control
              type="text"
              value={state[id].server_port}
              onChange={(e) =>
                dispatch({
                  type: "set_server_port",
                  value: e.target.value,
                  id: id,
                })
              }
              onKeyDown={handleKeyPress}
            />

            <Button
              onClick={() => {
                handleChangeUri(id);
              }}
            >
              Connect
            </Button>
          </InputGroup>
          <div className="d-flex mt-2">
            <div
              style={{
                width: "10rem",
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              Server home dir :
            </div>
            <Form.Control
              type="text"
              value={state[id].server_home_dir}
              onChange={(e) =>
                dispatch({
                  type: "set_server_home_dir",
                  value: e.target.value,
                  id: id,
                })
              }
              onKeyDown={handleKeyPress}
            />
          </div>

          <div className="d-flex mt-2">
            <div
              style={{
                width: "10rem",
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              Client home dir :
            </div>
            <Form.Control
              type="text"
              value={state[id].client_home_dir}
              onChange={(e) =>
                dispatch({
                  type: "set_client_home_dir",
                  value: e.target.value,
                  id: id,
                })
              }
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
