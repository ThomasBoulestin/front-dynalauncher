export class ProgressRenderer {
  // init method gets the details of the cell to be renderer

  init(params) {
    if (params.value == null) {
      params.value = 0.0;
    }

    this.eGui = document.createElement("div");
    this.clr = "#000000";
    this.grd =
      "background: linear-gradient(to right, " +
      this.clr +
      " " +
      params.value +
      "%, #d9d9d9 " +
      params.value +
      "%);";
    this.eGui.style =
      this.grd +
      "border-radius: 5px; height: 92%;text-align: center;line-height: 225%";
    this.eGui.innerHTML = parseFloat(params.value).toFixed(2) + "%";
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}

export class StatusRenderer {
  // init method gets the details of the cell to be renderer
  init(params) {
    this.eGui = document.createElement("div");

    if (params.data.progress == null) {
      params.data.progress = 0.0;
    }

    if (params.value == null) {
      params.value = "Starting";
    }

    if (params.value == "Finished") {
      this.clr = "background-color: #84e184;";
    } else if (params.value == "Running") {
      this.clr =
        "background: linear-gradient(to right, " +
        "#80bdff" +
        " " +
        params.data.progress +
        "%, #d9d9d9 " +
        params.data.progress +
        "%);";
      params.value =
        params.value +
        " - " +
        parseFloat(params.data.progress).toFixed(2) +
        "%";
    } else if (params.value == "Stopped" || params.value == "sw1") {
      this.clr = "background-color: #ff8533;";
    } else if (params.value == "Error") {
      this.clr = "background-color: #ff6666;";
    } else {
      this.clr = "background-color: #efefef;";
    }

    this.eGui.style =
      this.clr +
      "border-radius: 5px; height: 92%;text-align: center;line-height: 225%";
    this.eGui.innerHTML = params.value;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}

export class DateTimeStampRenderer {
  // init method gets the details of the cell to be renderer
  init(params) {
    this.eGui = document.createElement("div");

    let unix_timestamp = params.value;
    var date = new Date(unix_timestamp * 1000);

    this.eGui.innerHTML = date.toLocaleString();
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}

export class DurationTimeStampRenderer {
  // init method gets the details of the cell to be renderer
  init(params) {
    this.eGui = document.createElement("div");

    let unix_timestamp = params.value - 3600;
    var date = new Date(unix_timestamp * 1000);

    var day = date.day;
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    var o_str = "";
    if (day > 0) {
      o_str += day + "d ";
    }
    if (hour > 0) {
      o_str += hour + "h ";
    }
    if (minutes > 0) {
      o_str += minutes + "m ";
    }
    if (seconds > 0) {
      o_str += seconds + "s";
    }

    this.eGui.innerHTML = o_str;
  }

  getGui() {
    return this.eGui;
  }

  refresh(params) {
    return false;
  }
}
