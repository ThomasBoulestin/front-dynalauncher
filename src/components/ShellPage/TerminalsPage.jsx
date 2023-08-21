import { useContext, useEffect, useReducer, useState } from "react";
import { Terminal } from "./Terminal";
import { JobsContext } from "../../context/JobsContext/JobsContext";
import { Button } from "react-bootstrap";

import { motion, AnimatePresence } from "framer-motion";

import { serverAndClient } from "../../socket/Socket";

export function TerminalPage() {
  const { jobs, dispatch } = useContext(JobsContext);

  const [terminalsData, setTerminalsData] = useState([
    {
      id: 1,
      state: "Running",
      input_path: "",
      ncpu: 8,
      c_time: 0,
      e_time: 0,
      elapsed: 0,
      eta: 0,
      content: "",
    },
  ]);

  useEffect(() => {}, []);

  if (Object.keys(jobs).length === 0) {
    return (
      <div
        className="w-100 h-100 align-middle"
        style={{
          alignContent: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        No running job
      </div>
    );
  }

  return (
    <div>
      <div className="p-2 px-0 d-flex flex-wrap">
        <AnimatePresence>
          {Object.keys(jobs).map((job, i) => (
            <Terminal key={jobs[job].id} job={jobs[job]} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
