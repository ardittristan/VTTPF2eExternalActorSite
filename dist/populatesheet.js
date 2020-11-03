/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 401);
/******/ })
/************************************************************************/
/******/ ({

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/libs/tabs.js
/**
 * A controller class for managing tabbed navigation within an Application instance.
 * @see {@link Application}
 *
 * @param {string} navSelector      The CSS selector used to target the navigation element for these tabs
 * @param {string} contentSelector  The CSS selector used to target the content container for these tabs
 * @param {string} initial          The tab name of the initially active tab
 *
 * @example
 * <!-- Example HTML -->
 * <nav class="tabs">
 *   <a class="item" data-tab="tab1">Tab 1</li>
 *   <a class="item" data-tab="tab2">Tab 2</li>
 * </nav>
 *
 * <section class="content">
 *   <div class="tab" data-tab="tab1">Content 1</div>
 *   <div class="tab" data-tab="tab2">Content 2</div>
 * </section>
 *
 * @example
 * // JavaScript
 * const tabs = new Tabs({navSelector: ".tabs", contentSelector: ".content", initial: "tab1"});
 * tabs.bind(html);
 */
class Tabs {
  constructor({
    navSelector,
    contentSelector,
    initial
  } = {}) {
    /**
     * The value of the active tab
     * @type {string}
     */
    this.active = initial;
    /**
     * The CSS selector used to target the tab navigation element
     * @type {string}
     */

    this._navSelector = navSelector;
    /**
     * A reference to the HTML navigation element the tab controller is bound to
     * @type {HTMLElement|null}
     */

    this._nav = null;
    /**
     * The CSS selector used to target the tab content element
     * @type {string}
     */

    this._contentSelector = contentSelector;
    /**
     * A reference to the HTML container element of the tab content
     * @type {HTMLElement|null}
     */

    this._content = null;
  }
  /* -------------------------------------------- */

  /**
   * Bind the Tabs controller to an HTML application
   * @param {HTMLElement} html
   */


  bind(html) {
    // Identify navigation element
    this._nav = html.querySelector(this._navSelector);
    if (!this._nav) return; // Identify content container

    if (!this._contentSelector) this._content = null;else if (html.matches(this._contentSelector)) this._content = html;else this._content = html.querySelector(this._contentSelector); // Initialize the active tab

    this.activate(this.active); // Register listeners

    this._nav.addEventListener("click", this._onClickNav.bind(this));
  }
  /* -------------------------------------------- */

  /**
   * Activate a new tab by name
   * @param {string} tabName
   * @param {boolean} triggerCallback
   */


  activate(tabName, {
    triggerCallback = false
  } = {}) {
    // Validate the requested tab name
    const group = this._nav.dataset.group;

    const items = this._nav.querySelectorAll("[data-tab]");

    if (!items.length) return;
    const valid = Array.from(items).some(i => i.dataset.tab === tabName);
    if (!valid) tabName = items[0].dataset.tab; // Change active tab

    for (let i of items) {
      i.classList.toggle("active", i.dataset.tab === tabName);
    } // Change active content


    if (this._content) {
      const tabs = this._content.querySelectorAll("[data-tab]");

      for (let t of tabs) {
        if (t.dataset.group && t.dataset.group !== group) continue;
        t.classList.toggle("active", t.dataset.tab === tabName);
      }
    } // Store the active tab


    this.active = tabName;
  }
  /* -------------------------------------------- */

  /**
   * Handle click events on the tab navigation entries
   * @param {MouseEvent} event    A left click event
   * @private
   */


  _onClickNav(event) {
    const tab = event.target.closest("[data-tab]");
    if (!tab) return;
    event.preventDefault();
    const tabName = tab.dataset.tab;
    if (tabName !== this.active) this.activate(tabName, {
      triggerCallback: true
    });
  }

}
// CONCATENATED MODULE: ./src/populatesheet.js

/**
 * might be different for different systems, but this initializes the sheet tabs
 */

const tabs = [{
  navSelector: ".tabs",
  contentSelector: ".sheet-body",
  initial: "description"
}];

const _tabs = createTabHandlers();
/* -------------------------------------------- */

/*   Sheet Populator                            */

/* -------------------------------------------- */

/**
 * @param  {HandlebarsTemplatable} sheetTemplate
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */


function populateSheet(sheetTemplate, actorData, baseUrl) {
  /**
   * here you parse the json data into data you can send to the actor sheet
   */
  const data = getData(actorData, baseUrl);
  /**
   * here you send the data that the handlebars template reads from to the template
   */

  $(".window-content")[0].innerHTML = sheetTemplate({
    actor: data.actorData,
    data: data.actorData.data,
    items: data.actorData.items,
    isCharacter: data.actorData.data.type === "character",
    isNPC: data.actorData.data.type === "npc",
    owner: true,
    baseUrl: baseUrl
  }, {
    allowedProtoProperties: {
      size: true
    }
  });
  activateListeners();
}
/* -------------------------------------------- */

/**
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */


function getData(actorData, baseUrl) {
  actorData.img = baseUrl + actorData.img;
  let items = actorData.items;
  items.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  /**
   * any other parsing that needs to be done
   */

  return {
    actorData,
    items
  };
}
/* -------------------------------------------- */


function activateListeners() {
  // sheet object
  const html = $(".window-content").first(); // bind tabs to pages

  _tabs.forEach(t => t.bind(html[0]));
}
/* -------------------------------------------- */

/*   Helper Functions                           */

/* -------------------------------------------- */

/**
 * put any other helper functions here
 */

/* -------------------------------------------- */


function createTabHandlers() {
  return tabs.map(t => {
    return new Tabs(t);
  });
}
/* -------------------------------------------- */


Array.fromRange = function (n) {
  return Array.from(new Array(parseInt(n)).keys());
};
/**
 * listens to the hook that tells it to start the population
 */


Hooks.on("showSheet", populateSheet);

/***/ })

/******/ });