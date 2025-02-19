import {
  app,
  BrowserWindow,
  shell,
  dialog,
  ipcMain,
  ipcRenderer,
  utilityProcess,
  Notification,
  globalShortcut,
} from "electron";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";

import {
  setupTitlebar,
  attachTitlebarToWindow,
} from "custom-electron-titlebar/main";
import { stdout } from "node:process";

const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

const Store = require("electron-store");
const store = new Store({ cwd: "UserPref" });

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export var win: BrowserWindow;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

// setup the titlebar main process
setupTitlebar();

async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
    alwaysOnTop: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    frame: false,
    show: true,
    width: 1550,
    height: 1005,
    webPreferences: {
      preload: preload,
      devTools: true,
      //   nodeIntegration: true,
      contextIsolation: true,
      sandbox: false,
    },
  });

  if (url) {
    // electron-vite-vue#298
    win.loadURL(url);
    // Open devTool if the app is not packaged
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  win.on("close", function (e) {
    let response = dialog.showMessageBoxSync(win, {
      type: "question",
      buttons: ["Yes", "No"],
      title: "Confirm",
      message: "Are you sure you want to quit?",
    });

    if (response == 1) e.preventDefault();
  });

  win.removeMenu();

  attachTitlebarToWindow(win);

  // Apply electron-updater
  update(win);
}

app.whenReady().then(() => {
  globalShortcut.register("F5", () => {
    win.reload();
  });
  //   globalShortcut.register("CommandOrControl+F5", () => {
  globalShortcut.register("Shift+F5", () => {
    win.webContents.reloadIgnoringCache();
  });
  globalShortcut.register("F4", () => {
    console.log("dev");
    win.webContents.openDevTools();
  });

  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

ipcMain.handle("dialog", async (event, ...args) => {
  const result = await dialog.showOpenDialog({ properties: ["openFile"] });
  return result;
});

ipcMain.handle("showMessageBox", async (event, ...args) => {
  const result = await dialog.showMessageBox({
    message: args[1],
    title: args[0],
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
  });
  return result;
});

ipcMain.handle("showYesNo", async (event, ...args) => {
  const result = await dialog.showMessageBox({
    message: args[1],
    title: args[0],
    buttons: ["Ok", "Cancel"],
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
  });
  return result;
});

ipcMain.handle("showErrorBox", async (event, ...args) => {
  const result = await dialog.showErrorBox(args[0], args[1]);
  return result;
});

ipcMain.handle("openFile", async (event, ...args) => {
  if (args[0] === undefined) {
    // console.log(process.env);
    const result = await shell.showItemInFolder(
      app.getPath("userData") + "\\UserPref\\config.json"
    );
    return result;
  } else {
    const result = await shell.showItemInFolder(args[0]);
    return result;
  }
});

ipcMain.handle("openPath", async (event, ...args) => {
  const result = await shell.openPath(args[0]);
  return result;
});

ipcMain.handle("executeCommand", async (event, ...args) => {
  const result = await exec(args[0]);
  return result;
});

ipcMain.handle("showNotification", async (event, ...args) => {
  const result = await new Notification({
    title: args[0],
    body: args[1],
    silent: true,
    icon: join(process.env.VITE_PUBLIC, "favicon.ico"),
  }).show();
  return result;
});

ipcMain.handle("getAppVersion", (event, ...args) => app.getVersion());

ipcMain.handle("getUserPref", (event, ...args) => store.get("user_pref"));

ipcMain.handle("storeUserPref", async (event, ...args) =>
  store.set("user_pref", args[0])
);

async function openRdp(host: string) {
  var result = await exec(
    'tasklist /fo csv /nh /v /fi "IMAGENAME eq mstsc.exe"'
  );

  var stdout = result.stdout;

  try {
    const csv = stdout
      .trim()
      .split("\r\n")
      .map((line: string) => line.split(","));

    const filteredCsv = csv.filter((line: string[]) =>
      line.some((field: string) => field.includes(host))
    )[0][1];

    try {
      result = await exec(
        'powershell.exe -command "(New-Object -ComObject wscript.shell).AppActivate(' +
          filteredCsv.replaceAll('"', "") +
          ')"'
      );
      return "ok";
    } catch (error) {
      return "ok";
    }
  } catch (error) {
    result = await exec("mstsc /v " + host);
    return "ok";
  }
}

ipcMain.handle("openRdp", async (event, ...args) => {
  const result = await openRdp(args[0]);

  return result;
});
