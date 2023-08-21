export const JobsReducer = (state, action) => {
  // The switch statement is checking the type of action that is being passed in
  switch (action.type) {
    case "init_table":
      return {
        ...state,
        table: action.table,
      };

    case "add_job":
      state.jobs[action.job.id] = action.job;

      action.job.ncpu = +action.job.ncpu;
      state.table.push(action.job);

      return {
        ...state,
        jobs: { ...state.jobs },
        table: [...state.table],
      };

    case "set_jobs":
      return {
        ...state,
        jobs: action.jobs,
      };

    case "remove_job":
      delete state.jobs[action.id];

      return {
        ...state,
        jobs: { ...state.jobs },
      };

    case "remove_all_non_running":
      Object.keys(state.jobs).forEach((key) => {
        if (
          !(
            state.jobs[key].status === "Running" ||
            state.jobs[key].status === "Starting"
          )
        ) {
          delete state.jobs[key];
        }
      });

      return {
        ...state,
        jobs: { ...state.jobs },
      };

    case "update_job":
      var elementPos = state.table
        .map(function (x) {
          return x.id;
        })
        .indexOf(action.id);

      if (
        action.payload !== undefined &&
        // action.payload.status !== undefined &&
        action.payload.status !== state.jobs[action.id].status &&
        state.jobs[action.id].status !== undefined &&
        state.jobs[action.id].status !== "Starting" &&
        state.jobs[action.id].status !== "Running"
      ) {
        DYNALAUNCHER.showNotification(
          "Job " +
            state.jobs[action.id].id +
            " - " +
            state.jobs[action.id].status,
          state.jobs[action.id].input
        );
      }

      for (const key in action.payload) {
        if (state.jobs[action.id] !== undefined) {
          state.jobs[action.id][key] = action.payload[key];
        }

        if (state.table[elementPos] !== undefined) {
          state.table[elementPos][key] = action.payload[key];
        }
      }

      return {
        ...state,
        jobs: { ...state.jobs },
        table: [...state.table],
      };

    case "append_stdout":
      if (state.jobs[action.id] !== undefined) {
        if (state.jobs[action.id].stdout === undefined) {
          state.jobs[action.id].stdout = action.payload;
        } else {
          state.jobs[action.id].stdout += action.payload;
        }
      }

      return {
        ...state,
        jobs: { ...state.jobs },
      };

    case "set_form_data":
      return {
        ...state,
        formData: action.payload,
      };

    case "set_queue":
      return {
        ...state,
        qtable: action.jobs,
      };

    //Return the state if the action type is not found
    default:
      return state;
  }
};
