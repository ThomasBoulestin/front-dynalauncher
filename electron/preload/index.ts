import { Titlebar, TitlebarColor } from "custom-electron-titlebar";
const { ipcRenderer, contextBridge, app, ipcMain } = require("electron");

contextBridge.exposeInMainWorld("DYNALAUNCHER", {
  openDialog: async () => {
    const result = await ipcRenderer.invoke("dialog");
    return result;
  },
  showErrorBox: async (title: String, content: String) => {
    const result = await ipcRenderer.invoke("showErrorBox", title, content);
    return result;
  },
  showMessageBox: async (title: String, content: String) => {
    const result = await ipcRenderer.invoke("showMessageBox", title, content);
    return result;
  },
  showYesNo: async (title: String, content: String) => {
    const result = await ipcRenderer.invoke("showYesNo", title, content);
    return result;
  },
  openFile: async (input: String) => {
    const result = await ipcRenderer.invoke("openFile", input);
    return result;
  },
  openPath: async (input: String) => {
    const result = await ipcRenderer.invoke("openPath", input);
    return result;
  },
  executeCommand: async (input: String) => {
    const result = await ipcRenderer.invoke("executeCommand", input);
    return result;
  },
  openRdp: async (input: String) => {
    const result = await ipcRenderer.invoke("openRdp", input);
    return result;
  },
  showNotification: async (title: String, body: String) => {
    const result = await ipcRenderer.invoke("showNotification", title, body);
    return result;
  },

  getAppVersion: (input: String) => ipcRenderer.invoke("getAppVersion"),
  getUserPref: (input: String) => ipcRenderer.invoke("getUserPref"),
  storeUserPref: async (input: String) =>
    ipcRenderer.invoke("storeUserPref", input),
});

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"]
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading();
domReady().then(appendLoading);

window.onmessage = (ev) => {
  ev.data.payload === "removeLoading" && removeLoading();
};

const options = {
  // options
  //  1a2226
  // backgroundColor: TitlebarColor.fromHex("#8584f0"),
  backgroundColor: TitlebarColor.fromHex("#111214"),
  iconSize: 20,
  // titleHorizontalAlignment: "left",
  // overflow: "auto",
  removeMenuBar: true,
  // onlyShowMenubar: false,
  // menuPosition: "bottom",
};

window.addEventListener("DOMContentLoaded", () => {
  // Title bar implementation

  var TITLEBAR = new Titlebar(options);
});

setTimeout(removeLoading, 100);
