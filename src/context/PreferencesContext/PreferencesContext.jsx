import { createContext, useEffect, useState } from "react";
import { PreferencesReducer } from "./PreferencesReducer";
import { useReducer } from "react";

export const PreferencesContext = createContext();

export const PreferencesState = ({ children }) => {
  const initialState = [
    {
      name: "default",
      server_address: "",
      server_port: 5568,
      server_home_dir: "",
      client_home_dir: "",
      night_mode: true,
      LsPrePost: "",
      Solvers: [""],
      Ncpu: [""],
      Memory: [""],
      Expressions: [""],
      TerminalColorRules: [],
      TerminalBgColor: "#262626",
      TerminalTextColor: "#babec5",
    },
  ];

  //Set up the reducer
  const [state, dispatch] = useReducer(PreferencesReducer, initialState);
  const [configID, setConfigID] = useState(0);

  useEffect(() => {
    DYNALAUNCHER.getUserPref().then((resp) => {
      // si pas de config detectee, on en cree une basique
      if (resp === undefined) {
        // dispatch({ type: "set_all_prefs", value: initialState });
      } else {
        console.log(resp);

        dispatch({ type: "set_all_prefs", value: resp });
      }
    });
  }, []);

  useEffect(() => {
    let a = state;
    console.log(a);
    DYNALAUNCHER.storeUserPref(a);

    if (state[0].night_mode !== undefined) {
      const html = document.getElementsByTagName("html");
      html[0].dataset.bsTheme = state[0].night_mode ? "dark" : "light";
    }
  }, [state]);

  return (
    //Add the functions that have been defined above into the Context provider, and pass on to the children
    <PreferencesContext.Provider
      value={{
        state: state,
        initialState: initialState,
        configID,
        setConfigID,
        dispatch: dispatch,
        ...state,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};
