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
import { VscDebugDisconnect } from "react-icons/vsc";

export function LauncherForm({ ...props }) {
  const { jobs, formData, dispatch } = useContext(JobsContext);
  const { state } = useContext(PreferencesContext);
  const { addToast } = useContext(ToastContext);

  const [multiple_input, setMultiple_input] = useState(false);
  const [multi_from, setMultiFrom] = useState(0);
  const [multi_to, setMultiTo] = useState(0);

  const [input, setInput] = useState("");
  const [solver, setSolver] = useState("");
  const [ncpu, setNcpu] = useState("");
  const [memory, setMemory] = useState("");
  const [expr, setExpr] = useState("");
  const [preview, setPreview] = useState("");
  const [licCount, setLicCount] = useState([0, 0, 0]);
  const [freeDiskSpace, setFreeDiskSpace] = useState(["-", 0, 0]);

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

  const getFreeDiskSpace = () => {
    serverAndClient
      .request("getFreeSpace", {
        disk: "C:",
      })
      .then((result) => setFreeDiskSpace(result));
  };

  const startMultipleJobs = async () => {
    if (multiple_input) {
      if (!input.includes("$-$")) {
        addToast("warning", "Multiple input", "Missing $-$ in input");
      } else {
        var tamp_files =
          "Following jobs will be sent (forced clean / queue): \n\n";
        for (let index = multi_from; index <= multi_to; index++) {
          let a = input;
          tamp_files += a.replace("$-$", index) + "\n";
        }

        const yesno = await DYNALAUNCHER.showYesNo("", tamp_files);

        if (yesno.response === 0) {
          for (let index = multi_from; index <= multi_to; index++) {
            (function (index) {
              let a = input;
              startJob(true, true, a.replace("$-$", index));
            })(index);
          }
        }
      }
    }
    return;
  };

  const startJob = async (
    force_clean = false,
    force_queue = false,
    force_input = false
  ) => {
    const jobD = {
      input: force_input ? force_input : input,
      solver: solver,
      ncpu: ncpu,
      command: force_input
        ? expr
            .replace("$NCPU", ncpu)
            .replace("$INPUT", force_input)
            .replace("$SOLVER", solver)
            .replace("$MEMORY", memory)
        : preview,
      expr: expr,
      memory: memory,
    };

    console.log(jobD);

    const input_exists = await serverAndClient.request("fileExists", {
      input: jobD.input,
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
      input: jobD.input,
    });

    if (isRunning) {
      addToast("warning", "Input", "Job already running.");
      return;
    }

    const isInQueue = await serverAndClient.request("isInQueue", {
      input: jobD.input,
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

      if (force_queue) {
        var yn = { response: 0 };
      } else {
        var yn = await DYNALAUNCHER.showYesNo(
          "",
          "Not enough licenses, add to queue ?"
        );
      }

      if (yn.response === 0) {
        const isempty = await serverAndClient.request("isFolderEmpty", {
          input_file: jobD.input,
        });
        if (isempty) {
          const job = await serverAndClient.request("addToQueue", {
            job_data: jobD,
          });
        } else {
          if (!expr.toLowerCase().includes("r=")) {
            if (force_clean) {
              var yesno = { response: 0 };
            } else {
              var yesno = await DYNALAUNCHER.showYesNo(
                "",
                "Folder is not empty, do you want to clean it ?"
              );
            }

            if (yesno.response === 0) {
              const tt = await serverAndClient
                .request("cleanFolder", {
                  input: jobD.input,
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
        input_file: jobD.input,
      });

      if (isempty) {
        const job = await serverAndClient.request("startJob", {
          job_data: jobD,
          clean_all: true,
        });
        // console.log(job);
      } else {
        if (force_clean) {
          var yesno = { response: 0 };
        } else {
          var yesno = await DYNALAUNCHER.showYesNo(
            "",
            "Folder is not empty, do you want to clean it ?"
          );
        }

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
    }, 6000);

    const inter2 = setInterval(() => {
      getFreeDiskSpace();
    }, 10000);

    getLicCount();
    getFreeDiskSpace();
  }, []);

  useEffect(() => {}, []);

  return (
    <Card id="launcher-form" className="m-2">
      <Card.Body className="p-1">
        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "50%" }}>
            {!multiple_input && (
              <>
                <InputGroup.Text style={{ width: "9rem" }}>
                  <Form.Check // prettier-ignore
                    type="switch"
                    label="Single Input"
                    onClick={(e) => setMultiple_input(!multiple_input)}
                  />
                </InputGroup.Text>
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
                            state[0].client_home_dir,
                            state[0].server_home_dir
                          )
                        );
                      }
                    })
                  }
                >
                  ...
                </Button>
              </>
            )}
            {multiple_input && (
              <>
                <InputGroup.Text style={{ width: "9rem" }}>
                  <Form.Check // prettier-ignore
                    type="switch"
                    checked={multiple_input}
                    label="Multi Input"
                    onClick={(e) => setMultiple_input(!multiple_input)}
                  />
                </InputGroup.Text>
                {!input.includes("$-$") && (
                  <InputGroup.Text>
                    /!\ Missing $-$ replacement tag
                  </InputGroup.Text>
                )}

                <Form.Control
                  spellCheck={false}
                  type="text"
                  value={input}
                  onInput={(e) => setInput(e.target.value)}
                />
                <Form.Control
                  spellCheck={false}
                  type="number"
                  value={multi_from}
                  style={{ maxWidth: "5rem" }}
                  onInput={(e) => setMultiFrom(e.target.value)}
                />
                <Form.Control
                  spellCheck={false}
                  type="number"
                  value={multi_to}
                  style={{ maxWidth: "5rem" }}
                  onInput={(e) => setMultiTo(e.target.value)}
                />
              </>
            )}
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
              {state[0].Ncpu.map((e, i) => {
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
          <Button
            className="px-1"
            variant="danger"
            style={{ marginLeft: "auto" }}
            onClick={() => {
              window.location.reload();
            }}
          >
            <VscDebugDisconnect size="16" className="ps-0" /> Disconnect{" "}
          </Button>
        </div>
        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "50%" }}>
            <InputGroup.Text style={{ width: "9rem" }}>Solver:</InputGroup.Text>
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
                      state[0].client_home_dir,
                      state[0].server_home_dir
                    );
                  }
                })
              }
            >
              ...
            </Button>
            <DropdownButton variant="outline-secondary" title="">
              {state[0].Solvers.map((e, i) => {
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
              {state[0].Memory.map((e, i) => {
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
            <InputGroup.Text style={{ width: "9rem" }}>Expr:</InputGroup.Text>
            <Form.Control
              spellCheck={false}
              type="text"
              value={expr}
              onInput={(e) => setExpr(e.target.value)}
            />
            <DropdownButton variant="outline-secondary" title="">
              {state[0].Expressions.map((e, i) => {
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
          <div style={{ marginLeft: "auto" }}>
            <h3 className="m-0">
              {freeDiskSpace[0]} ({freeDiskSpace[1].toFixed(0)}/
              {freeDiskSpace[2].toFixed(0)} Go)
            </h3>
          </div>
        </div>

        <div className="d-flex mb-1">
          <InputGroup className="me-2" style={{ maxWidth: "75%" }}>
            <InputGroup.Text style={{ width: "9rem" }}>
              Preview:
            </InputGroup.Text>
            <Form.Control
              spellCheck={false}
              disabled
              value={preview}
              onInput={(e) => setPreview(e.target.value)}
            />
          </InputGroup>
          <Button
            className="me-2"
            onClick={(e) => {
              if (multiple_input) {
                startMultipleJobs();
              } else {
                startJob();
              }
            }}
          >
            Send Job
          </Button>

          <div style={{ marginLeft: "auto" }}>
            <h3 className="m-0">
              {licCount[0]} / {licCount[1]} ({licCount[2]})
            </h3>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
