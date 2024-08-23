export const PreferencesReducer = (state, action) => {
  // The switch statement is checking the type of action that is being passed in
  switch (action.type) {
    case "set_all_prefs":
      for (const key in action.value) {
        state[key] = action.value[key];
      }

      return {
        ...state,
      };

    case "set_server_address":
      return {
        ...state,
        server_address: action.value,
      };

    case "set_server_port":
      return {
        ...state,
        server_port: action.value,
      };

    case "set_server_home_dir":
      return {
        ...state,
        server_home_dir: action.value,
      };

    case "set_client_home_dir":
      return {
        ...state,
        client_home_dir: action.value,
      };

    case "set_night_mode":
      return {
        ...state,
        night_mode: action.value,
      };

    case "set_LsPrePost":
      return {
        ...state,
        LsPrePost: action.value,
      };

    case "set_Solvers":
      return {
        ...state,
        Solvers: action.value,
      };

    case "set_Expressions":
      return {
        ...state,
        Expressions: action.value,
      };

    case "set_Ncpu":
      return {
        ...state,
        Ncpu: action.value,
      };

    case "set_Memory":
      return {
        ...state,
        Memory: action.value,
      };

    case "set_TerminalColorRules":
      return {
        ...state,
        TerminalColorRules: action.value,
      };

    case "set_TerminalTextColor":
      return {
        ...state,
        TerminalTextColor: action.value,
      };

    case "set_TerminalBgColor":
      return {
        ...state,
        TerminalBgColor: action.value,
      };

    //Return the state if the action type is not found
    default:
      return state;
  }
};
