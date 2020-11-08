import langs from "./libs/lang.json";
import pf2eConf from "./libs/pf2conf";
import CONST from "./libs/const";

/** @type {import("../node_modules/eventemitter3/index")} */
globalThis.Hooks = new EventEmitter3();

if (document.location.hostname === "localhost") {
  globalThis.proxyUrl = "";
} else {
  globalThis.proxyUrl = "https://cors-anywhere.herokuapp.com/";
}

globalThis.i18n = langs;

globalThis.PF2E = pf2eConf;

globalThis.CONST = CONST;
