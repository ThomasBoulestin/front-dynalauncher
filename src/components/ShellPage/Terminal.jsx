import { useEffect, useState, useContext, useRef } from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownButton,
  InputGroup,
  ButtonGroup,
} from "react-bootstrap";

import { JobsContext } from "../../context/JobsContext/JobsContext";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { serverAndClient } from "../../socket/Socket";
import parse from "html-react-parser";
import { PreferencesContext } from "../../context/PreferencesContext/PreferencesContext";

import { motion } from "framer-motion";
import { ToastContext } from "../../context/ToastContext/ToastContext";

export function Terminal({ job, ...props }) {
  const { dispatch } = useContext(JobsContext);
  const { state, LsPrePost, configID } = useContext(PreferencesContext);
  const { addToast } = useContext(ToastContext);

  const [scrollLockDown, setScrollLockDown] = useState(true);
  const [statusColorObj, setStatusColorObj] = useState({
    name: "primary",
    css_var: "var(--bs-primary)",
  });

  const [elapsed, setElapsed] = useState(0);
  const [eta, setEta] = useState(0);
  const [inter, setInter] = useState();

  const [status, setStatus] = useState("Starting");
  const [notifFlag, setNotifFlag] = useState(false);

  const [showAmassError, setShowAmassError] = useState(false);

  useEffect(() => {
    if (job.status === "Starting") {
      setStatusColorObj({
        name: "primary",
        css_var: "var(--bs-primary)",
      });
    } else if (job.status === "Running") {
      setNotifFlag(true);
      setStatusColorObj({
        name: "primary",
        css_var: "var(--bs-primary)",
      });
    } else if (job.status === "Finished") {
      setStatusColorObj({
        name: "success",
        css_var: "var(--bs-success)",
      });
    } else if (job.status === "Error") {
      setStatusColorObj({
        name: "danger",
        css_var: "var(--bs-danger)",
      });
    } else if (job.status === "sw1") {
      setStatusColorObj({
        name: "warning",
        css_var: "var(--bs-warning)",
      });
    } else if (job.status === "Stopped") {
      setStatusColorObj({
        name: "warning",
        css_var: "var(--bs-warning)",
      });
    } else {
      setStatusColorObj({
        name: "primary",
        css_var: "var(--bs-primary)",
      });
    }
  }, [job.status]);

  useEffect(() => {
    if (job.current === undefined) {
      return;
    }

    setEta(elapsed / (job.current / job.end) - elapsed);
  }, [job.current]);

  useEffect(() => {
    if (job.started === undefined) {
      return;
    }

    if (job.status === "Running" || job.status === "Starting") {
      const elapsedInter = setInterval((e) => {
        if (!(job.status === "Running" || job.status === "Starting")) {
          clearInterval(elapsedInter);
        }
        setElapsed(Date.now() - job.started * 1000);

        setEta((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(elapsedInter);
      };
    }
  }, [job.started]);

  useEffect(() => {
    if (job.pct_mass !== undefined && job.pct_mass > 1) {
      setShowAmassError(true);
    }
  }, [job.pct_mass]);

  useEffect(() => {
    job.stdout = job.stdout;
  }, [state[configID].TerminalColorRules]);

  const preRef = useRef();

  function scrollToBottom() {
    preRef.current.scrollTo(0, preRef.current.scrollHeight, {
      behavior: "smooth",
    });
  }

  function handleScroll(e) {
    let diff = preRef.current.scrollHeight - e.target.scrollTop;

    if (diff < 500) {
      setScrollLockDown(true);
    } else {
      setScrollLockDown(false);
    }
  }

  useEffect(() => {
    if (scrollLockDown) {
      scrollToBottom();
    }
  }, [job.stdout]);

  function handleD3kill(payload) {
    serverAndClient
      .request("sendD3kill", { id: job.id, payload: payload })
      .then((result) => console.log(result));
  }

  function handleKillProcess() {
    serverAndClient
      .request("KillProcessByJobId", { id: job.id })
      .then((result) => console.log(result));
  }

  function handleRemove() {
    serverAndClient.request("removeShell", { id: job.id }).then((result) => {});
  }

  const handleClick = (event) => {
    if (event.ctrlKey) {
      dispatch({ type: "set_form_data", payload: job });
    }
    if (event.shiftKey) {
      if (state[configID].server_home_dir === "") {
        DYNALAUNCHER.openFile(job.input);
      } else {
        DYNALAUNCHER.openFile(
          job.input.replace(
            state[configID].server_home_dir,
            state[configID].client_home_dir
          )
        );
      }
    }
    if (event.altKey) {
      const d3path =
        job.input.substring(0, job.input.lastIndexOf("\\")) + "\\d3plot";
      let _command = "";
      if (state[configID].server_home_dir === "") {
        _command = '"' + LsPrePost + '" "' + d3path + '"';
      } else {
        _command =
          '"' +
          LsPrePost +
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

  function colorText(text) {
    if (text === undefined) {
      return "";
    }
    // text = text.replace(/<\/?[^>]+(>|$)/g, "");

    state[configID].TerminalColorRules.forEach((element) => {
      try {
        text = text.replaceAll(
          new RegExp("^(?!.*span)" + element.re, "gm"),
          "<span style=' " + element.style + "'>$&</span>"
        );
      } catch (error) {
        console.log(err);
      }
    });

    return text;
  }

  function tsToDuration(unixTimestamp) {
    let date = new Date(unixTimestamp);
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    let seconds = date.getUTCSeconds().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    return hours + ":" + minutes + ":" + seconds;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.75 }}
      transition={{ ease: "easeIn", duration: 0.1 }}
    >
      <Card
        className="ms-2 mb-1"
        style={{ width: "465px" }}
        onClick={(e) => handleClick(e)}
      >
        <Card.Header className="d-flex p-1">
          <Button
            variant={statusColorObj.name}
            className="px-1"
            style={{ width: "8.5rem" }}
          >
            {job.id} - {job.status}
          </Button>

          <div className="ms-1 flex-grow-1" style={{ maxWidth: "75%" }}>
            <div style={{ overflow: "hidden" }}>{job.input}</div>
            <div className="d-flex">
              <div
                style={{
                  width: "70px",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                {job.ncpu}cpu
              </div>
              <div
                style={{
                  width: "90px",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                {job.current}/{job.end}
              </div>
              <div
                style={{
                  width: "80px",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                {tsToDuration(elapsed)}
              </div>
              <div
                style={{
                  width: "80px",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                {"   "}
              </div>
            </div>
          </div>

          <div style={{ height: "3rem", width: "3rem" }}>
            <CircularProgressbar
              value={job.progress === undefined ? 0 : job.progress}
              text={
                job.progress !== undefined &&
                !["Finished", "Stopped", "sw1", "Error"].includes(job.status)
                  ? Math.trunc(job.progress) + "%"
                  : ""
              }
              strokeWidth={10}
              background
              styles={{
                path: {
                  stroke: statusColorObj.css_var,
                  fill: statusColorObj.css_var,
                },
                trail: {
                  stroke: !["Finished", "Stopped", "sw1", "Error"].includes(
                    job.status
                  )
                    ? "#d6d6d6"
                    : statusColorObj.css_var,
                  strokeLinecap: "butt",
                },
                text: {
                  fill: "var(--bs-body-color)",
                  fontSize: "30px",
                  fontWeight: "normal",
                  transform: "translate(-3px, 4px)",
                },
                background: {
                  fill: !["Finished", "Stopped", "sw1", "Error"].includes(
                    job.status
                  )
                    ? "none"
                    : statusColorObj.css_var,
                },
              }}
            />
          </div>
        </Card.Header>
        <Card.Body
          className="p-0"
          style={{
            backgroundColor: "black",
            height: "300px",
          }}
        >
          <pre
            ref={preRef}
            className="terminal"
            onDoubleClick={scrollToBottom}
            onScroll={(e) => handleScroll(e)}
            style={{
              color: state[configID].TerminalTextColor,
              backgroundColor: state[configID].TerminalBgColor,
            }}
          >
            {/* {parse(colorText(job.stdout))} */}
            {job.stdout}
          </pre>
        </Card.Body>
        <Card.Footer className="pe-0 d-flex">
          <div
            className="flex-grow-1 "
            style={{ alignSelf: "center", textAlign: "center" }}
          >
            {showAmassError && (
              <div>
                ⚠️ Added mass={job.a_mass} (+{job.pct_mass}%) ⚠️
              </div>
            )}
          </div>
          <InputGroup style={{ width: "11rem" }}>
            <Button
              variant="secondary"
              disabled={
                !(
                  job.status === "Finished" ||
                  job.status === "Stopped" ||
                  job.status === "Error" ||
                  job.status === "sw1"
                )
              }
              onClick={handleRemove}
            >
              Remove
            </Button>

            <Button
              variant="secondary"
              disabled={
                !(job.status === "Running" || job.status === "Starting")
              }
              onClick={() => handleD3kill("sw1")}
            >
              sw1
            </Button>

            <DropdownButton
              //   disabled={job.status !== "Running" || job.status !== "Starting"}
              variant="secondary"
              title=""
              drop="down"
            >
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                sw1
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                sw2
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                sw3
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                sw4
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                swa
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                swb
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                swc
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                swd
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                conv
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                iter
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                lprint
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                nlprint
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                prof
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                stop
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => handleD3kill(e.target.innerText)}>
                file
              </Dropdown.Item>
              <Dropdown.Item onClick={handleKillProcess}>
                Kill Process
              </Dropdown.Item>
              <Dropdown.Item onClick={handleRemove}>
                Force Remove Shell
              </Dropdown.Item>
            </DropdownButton>
          </InputGroup>
        </Card.Footer>
      </Card>
    </motion.div>
  );
}
