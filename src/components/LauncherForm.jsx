import { useContext, useEffect, useState, useRef } from "react";
import {
  Button,
  Card,
  InputGroup,
  Form,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import { serverAndClient, socket } from "../socket/Socket";
import { JobsContext } from "../context/JobsContext/JobsContext";
import { PreferencesContext } from "../context/PreferencesContext/PreferencesContext";
import { ToastContext } from "../context/ToastContext/ToastContext";

export function LauncherForm({ ...props }) {
  const { jobs, formData, dispatch } = useContext(JobsContext);
  const { state } = useContext(PreferencesContext);
  const { addToast } = useContext(ToastContext);

  const [input, setInput] = useState("");
  const [solver, setSolver] = useState("");
  const [ncpu, setNcpu] = useState("");
  const [memory, setMemory] = useState("");
  const [expr, setExpr] = useState("");
  const [preview, setPreview] = useState("");
  const [licCount, setLicCount] = useState([0, 0, 0]);

  useEffect(() => {
    if (expr !== undefined) {
      try {
        let p = expr
          .replace("$NCPU", ncpu)
          .replace("$INPUT", input)
          .replace("$SOLVER", solver)
          .replace("$MEMORY", memory);

        setPreview(p);
      } catch {}
    }
  }, [input, solver, ncpu, memory, expr]);

  useEffect(() => {
    if (Object.values(formData).length > 0) {
      setInput(formData.input);
      setNcpu(formData.ncpu);
      setSolver(formData.solver);
      setExpr(formData.expr);
      setMemory(formData.memory);
    }
  }, [formData]);

  const getLicCount = () => {
    serverAndClient
      .request("getLicCount")
      .then((result) => setLicCount(result));
  };

  const startJob = async () => {
    let jobD = {
      input: input,
      solver: solver,
      ncpu: ncpu,
      command: preview,
      expr: expr,
      memory: memory,
    };

    const input_exists = await serverAndClient.request("fileExists", {
      input: input,
    });

    if (!input_exists) {
      addToast("warning", "Input", "Input file does not exist. (on server)");
      return;
    }

    const solver_exists = await serverAndClient.request("fileExists", {
      input: solver,
    });

    if (!solver_exists) {
      addToast("warning", "Input", "Solver does not exist. (on server)");
      return;
    }

    const isRunning = await serverAndClient.request("isjobRunning", {
      input: input,
    });

    if (isRunning) {
      addToast("warning", "Input", "Job already running.");
      return;
    }

    const isInQueue = await serverAndClient.request("isInQueue", {
      input: input,
    });

    if (isInQueue) {
      addToast("warning", "Input", "Job already in queue.");
      return;
    }

    // const job = await serverAndClient.request("startJob", {
    //   job_data: jobD,
    //   clean_all: true,
    // });

    const res_lic = await serverAndClient.request("getLicCount");
    let available = res_lic[1] - res_lic[0];

    if (ncpu > available && !expr.includes(" init")) {
      //   if (confirm("Not enough licenses, add to queue ?")) {

      const yn = await DYNALAUNCHER.showYesNo(
        "",
        "Not enough licenses, add to queue ?"
      );

      if (yn.message === 0) {
        const isempty = await serverAndClient.request("isFolderEmpty", {
          input_file: input,
        });
        if (isempty) {
          const job = await serverAndClient.request("addToQueue", {
            job_data: jobD,
          });
        } else {
          if (!expr.toLowerCase().includes("r=")) {
            const yesno = await DYNALAUNCHER.showYesNo(
              "",
              "Folder is not empty, do you want to clean it ?"
            );

            if (yesno.response === 0) {
              const tt = await serverAndClient
                .request("cleanFolder", {
                  input: input,
                })
                .then(
                  serverAndClient.request("addToQueue", {
                    job_data: jobD,
                  })
                );
            }
          } else {
            serverAndClient.request("addToQueue", {
              job_data: jobD,
            });
          }
        }
        return;
      } else {
        return;
      }
    }

    if (!expr.toLowerCase().includes("r=")) {
      const isempty = await serverAndClient.request("isFolderEmpty", {
        input_file: input,
      });

      if (isempty) {
        const job = await serverAndClient.request("startJob", {
          job_data: jobD,
          clean_all: true,
        });
        console.log(job);
      } else {
        const yesno = await DYNALAUNCHER.showYesNo(
          "",
          "Folder is not empty, do you want to clean it ?"
        );

        if (yesno.response === 0) {
          // Save it!
          const job = await serverAndClient.request("startJob", {
            job_data: jobD,
            clean_all: true,
          });
        }
      }
    } else {
      const job = await serverAndClient.request("startJob", {
        job_data: jobD,
        clean_all: false,
      });
    }
  };

  useEffect(() => {
    const inter = setInterval(() => {
      getLicCount();
    }, 2000);
  }, []);

  return (
    <Card id="launcher-form" className="m-2">
      <Card.Body className="p-1">
        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "50%" }}>
            <InputGroup.Text style={{ width: "8rem" }}>Input:</InputGroup.Text>
            <Form.Control
              spellCheck={false}
              type="text"
              value={input}
              onInput={(e) => setInput(e.target.value)}
            />

            <Button
              variant="outline-secondary"
              onClick={() =>
                DYNALAUNCHER.openDialog().then((result) => {
                  if (!result.canceled) {
                    setInput(
                      result.filePaths[0].replace(
                        state.client_home_dir,
                        state.server_home_dir
                      )
                    );
                  }
                })
              }
            >
              ...
            </Button>
          </InputGroup>
          <InputGroup style={{ width: "15rem" }}>
            <InputGroup.Text style={{ width: "5rem" }}>ncpu:</InputGroup.Text>
            <Form.Control
              spellCheck={false}
              type="number"
              value={ncpu}
              onInput={(e) => setNcpu(e.target.value)}
            />
            <DropdownButton variant="outline-secondary" title="">
              {state.Ncpu.map((e, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={(e) => setNcpu(+e.target.innerText)}
                  >
                    {e}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </InputGroup>
        </div>
        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "50%" }}>
            <InputGroup.Text style={{ width: "8rem" }}>Solver:</InputGroup.Text>
            <Form.Control
              spellCheck={false}
              type="text"
              value={solver}
              onInput={(e) => setSolver(e.target.value)}
            />
            <Button
              variant="outline-secondary"
              onClick={() =>
                DYNALAUNCHER.openDialog().then((result) => {
                  if (!result.canceled) {
                    setSolver(result.filePaths[0]).replace(
                      state.client_home_dir,
                      state.server_home_dir
                    );
                  }
                })
              }
            >
              ...
            </Button>
            <DropdownButton variant="outline-secondary" title="">
              {state.Solvers.map((e, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={(e) => setSolver(e.target.innerText)}
                  >
                    {e}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </InputGroup>
          <InputGroup style={{ width: "15rem" }}>
            <InputGroup.Text style={{ width: "5rem" }}>Memory:</InputGroup.Text>
            <Form.Control
              spellCheck={false}
              type="text"
              value={memory}
              onInput={(e) => setMemory(e.target.value)}
            />
            <DropdownButton variant="outline-secondary" title="">
              {state.Memory.map((e, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={(e) => setMemory(e.target.innerText)}
                  >
                    {e}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </InputGroup>
        </div>
        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "50%" }}>
            <InputGroup.Text style={{ width: "8rem" }}>Expr:</InputGroup.Text>
            <Form.Control
              spellCheck={false}
              type="text"
              value={expr}
              onInput={(e) => setExpr(e.target.value)}
            />
            <DropdownButton variant="outline-secondary" title="">
              {state.Expressions.map((e, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    onClick={(e) => setExpr(e.target.innerText)}
                  >
                    {e}
                  </Dropdown.Item>
                );
              })}
            </DropdownButton>
          </InputGroup>
        </div>
        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "75%" }}>
            <InputGroup.Text style={{ width: "8rem" }}>
              Preview:
            </InputGroup.Text>
            <Form.Control
              spellCheck={false}
              disabled
              value={preview}
              onInput={(e) => setPreview(e.target.value)}
            />
          </InputGroup>
          <Button className="me-2" onClick={startJob}>
            Send Job
          </Button>
          <h3 className="m-0">
            {licCount[0]} / {licCount[1]} ({licCount[2]})
          </h3>
        </div>
      </Card.Body>
    </Card>
  );
}
