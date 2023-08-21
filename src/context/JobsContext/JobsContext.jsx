import { createContext } from "react";
import { JobsReducer } from "./JobsReducer";
import { useReducer } from "react";

export const JobsContext = createContext();

export const JobsState = ({ children }) => {
  //   Initial State of the cart
  const initialState = {
    jobs: {},
    table: [],
    qtable: [],
    formData: {},
  };

  //Set up the reducer
  const [state, dispatch] = useReducer(JobsReducer, initialState);

  return (
    //Add the functions that have been defined above into the Context provider, and pass on to the children
    <JobsContext.Provider
      value={{
        dispatch: dispatch,
        ...state,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};
