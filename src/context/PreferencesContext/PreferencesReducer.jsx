export const PreferencesReducer = (state, action) => {
  // The switch statement is checking the type of action that is being passed in
  var arr = [...state];
  switch (action.type) {
    case "set_all_prefs":
      //   for (const key in action.value) {
      //     arr[action.id][key] = action.value[key];
      //   }

      return action.value;

    case "set_name":
      //arr = [...state];
      arr[action.id].name = action.value;
      return arr;

    case "set_accent_color":
      //arr = [...state];
      arr[action.id].accent_color = action.value;
      return arr;

    case "set_server_address":
      //arr = [...state];
      arr[action.id].server_address = action.value;
      return arr;

    case "set_server_port":
      //arr = [...state];
      arr[action.id].server_port = action.value;
      return arr;

    case "set_server_home_dir":
      //arr = [...state];
      arr[action.id].server_home_dir = action.value;
      return arr;

    case "set_client_home_dir":
      //arr = [...state];
      arr[action.id].client_home_dir = action.value;
      return arr;

    case "set_night_mode":
      //arr = [...state];
      arr[action.id].night_mode = action.value;
      return arr;

    case "set_LsPrePost":
      //arr = [...state];
      arr[action.id].LsPrePost = action.value;
      return arr;

    case "set_Solvers":
      //arr = [...state];
      arr[action.id].Solvers = action.value;
      return arr;

    case "set_Expressions":
      //arr = [...state];
      arr[action.id].Expressions = action.value;
      return arr;

    case "set_Ncpu":
      //arr = [...state];
      arr[action.id].Ncpu = action.value;
      return arr;

    case "set_Memory":
      //arr = [...state];
      arr[action.id].Memory = action.value;
      return arr;

    case "set_TerminalColorRules":
      //arr = [...state];
      arr[action.id].TerminalColorRules = action.value;
      return arr;

    case "set_TerminalTextColor":
      //arr = [...state];
      arr[action.id].TerminalTextColor = action.value;
      return arr;

    case "set_TerminalBgColor":
      //arr = [...state];
      arr[action.id].TerminalBgColor = action.value;
      return arr;

    //Return the state if the action type is not found
    default:
      return state;
  }
};
