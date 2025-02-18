export const PreferencesReducer = (state, action) => {
  // The switch statement is checking the type of action that is being passed in
  var arr = [...state];
  switch (action.type) {
    case "set_all_prefs":
      //   for (const key in action.value) {
      //     arr[0][key] = action.value[key];
      //   }

      return action.value;

    case "set_server_address":
      //arr = [...state];
      arr[0].server_address = action.value;
      return arr;

    case "set_server_port":
      //arr = [...state];
      arr[0].server_port = action.value;
      return arr;

    case "set_server_home_dir":
      //arr = [...state];
      arr[0].server_home_dir = action.value;
      return arr;

    case "set_client_home_dir":
      //arr = [...state];
      arr[0].client_home_dir = action.value;
      return arr;

    case "set_night_mode":
      //arr = [...state];
      arr[0].night_mode = action.value;
      return arr;

    case "set_LsPrePost":
      //arr = [...state];
      arr[0].LsPrePost = action.value;
      return arr;

    case "set_Solvers":
      //arr = [...state];
      arr[0].Solvers = action.value;
      return arr;

    case "set_Expressions":
      //arr = [...state];
      arr[0].Expressions = action.value;
      return arr;

    case "set_Ncpu":
      //arr = [...state];
      arr[0].Ncpu = action.value;
      return arr;

    case "set_Memory":
      //arr = [...state];
      arr[0].Memory = action.value;
      return arr;

    case "set_TerminalColorRules":
      //arr = [...state];
      arr[0].TerminalColorRules = action.value;
      return arr;

    case "set_TerminalTextColor":
      //arr = [...state];
      arr[0].TerminalTextColor = action.value;
      return arr;

    case "set_TerminalBgColor":
      //arr = [...state];
      arr[0].TerminalBgColor = action.value;
      return arr;

    //Return the state if the action type is not found
    default:
      return state;
  }
};
