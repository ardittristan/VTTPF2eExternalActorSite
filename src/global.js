import langs from "./libs/lang.json"

/** @type {import("../node_modules/eventemitter3/index")} */
globalThis.Hooks = new EventEmitter3();

globalThis.proxyUrl = ""
// globalThis.proxyUrl = "https://cors-anywhere.herokuapp.com/"

globalThis.i18n = langs
