import { useState, useEffect, useContext } from "react";
import { JobsContext } from "../context/JobsContext/JobsContext";
import { io } from "socket.io-client";
import {
  JSONRPCClient,
  JSONRPCServer,
  JSONRPCServerAndClient,
} from "json-rpc-2.0";

const URL =
  process.env.NODE_ENV === "production" ? undefined : "http://localhost:5558";

export const socket = io("http://localhost:5558", {
  autoConnect: false,
  transports: ["websocket"],
  // reconnection: false,
});

export const serverAndClient = new JSONRPCServerAndClient(
  new JSONRPCServer(),
  new JSONRPCClient((request) => {
    try {
      socket.send(JSON.stringify(request));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  })
);

export function Socket() {
  const { jobs, dispatch } = useContext(JobsContext);

  useEffect(() => {
    socket.on("message", (event) => {
      serverAndClient.receiveAndSend(JSON.parse(event));
    });

    // On close, make sure to reject all the pending requests to prevent hanging.
    socket.onclose = (event) => {
      serverAndClient.rejectAllPendingRequests(
        `Connection is closed (${event.reason}).`
      );
    };

    serverAndClient.addMethod("update_data", ({ id, payload }) => {
      //   console.log(payload);
      dispatch({ type: "update_job", id: id, payload: payload });
    });

    serverAndClient.addMethod("appendToShell", ({ id, payload }) => {
      //   console.log(payload);
      dispatch({ type: "append_stdout", id: id, payload: payload });
    });

    serverAndClient.addMethod("removeShell", ({ id }) => {
      dispatch({ type: "remove_job", id: id });
    });

    serverAndClient.addMethod("addJob", ({ job }) => {
      dispatch({ type: "add_job", job: job });
    });

    serverAndClient.addMethod("setQueue", ({ jobs }) => {
      console.log(jobs);
      dispatch({ type: "set_queue", jobs: jobs });
    });
  }, []);

  return null;
}
