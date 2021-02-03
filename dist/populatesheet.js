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

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

/** @type {import('../../../node_modules/dot-prop/index')} */
const dotProp = __webpack_require__(104);

module.exports = function (value) {
  let local = dotProp.get(i18n, value);
  return local || value;
};

/***/ }),

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const isObj = __webpack_require__(105);

const disallowedKeys = new Set([
	'__proto__',
	'prototype',
	'constructor'
]);

const isValidPath = pathSegments => !pathSegments.some(segment => disallowedKeys.has(segment));

function getPathSegments(path) {
	const pathArray = path.split('.');
	const parts = [];

	for (let i = 0; i < pathArray.length; i++) {
		let p = pathArray[i];

		while (p[p.length - 1] === '\\' && pathArray[i + 1] !== undefined) {
			p = p.slice(0, -1) + '.';
			p += pathArray[++i];
		}

		parts.push(p);
	}

	if (!isValidPath(parts)) {
		return [];
	}

	return parts;
}

module.exports = {
	get(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return value === undefined ? object : value;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return;
		}

		for (let i = 0; i < pathArray.length; i++) {
			object = object[pathArray[i]];

			if (object === undefined || object === null) {
				// `object` is either `undefined` or `null` so we want to stop the loop, and
				// if this is not the last bit of the path, and
				// if it did't return `undefined`
				// it would return `null` if `object` is `null`
				// but we want `get({foo: null}, 'foo.bar')` to equal `undefined`, or the supplied value, not `null`
				if (i !== pathArray.length - 1) {
					return value;
				}

				break;
			}
		}

		return object === undefined ? value : object;
	},

	set(object, path, value) {
		if (!isObj(object) || typeof path !== 'string') {
			return object;
		}

		const root = object;
		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (!isObj(object[p])) {
				object[p] = {};
			}

			if (i === pathArray.length - 1) {
				object[p] = value;
			}

			object = object[p];
		}

		return root;
	},

	delete(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);

		for (let i = 0; i < pathArray.length; i++) {
			const p = pathArray[i];

			if (i === pathArray.length - 1) {
				delete object[p];
				return true;
			}

			object = object[p];

			if (!isObj(object)) {
				return false;
			}
		}
	},

	has(object, path) {
		if (!isObj(object) || typeof path !== 'string') {
			return false;
		}

		const pathArray = getPathSegments(path);
		if (pathArray.length === 0) {
			return false;
		}

		// eslint-disable-next-line unicorn/no-for-loop
		for (let i = 0; i < pathArray.length; i++) {
			if (isObj(object)) {
				if (!(pathArray[i] in object)) {
					return false;
				}

				object = object[pathArray[i]];
			} else {
				return false;
			}
		}

		return true;
	}
};


/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = value => {
	const type = typeof value;
	return value !== null && (type === 'object' || type === 'function');
};


/***/ }),

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
// EXTERNAL MODULE: ./src/handlebars/helpers/stringify.js
var stringify = __webpack_require__(0);
var stringify_default = /*#__PURE__*/__webpack_require__.n(stringify);

// CONCATENATED MODULE: ./src/libs/modifiers.js
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const PF2ModifierType = Object.freeze({
  ABILITY: "ability",
  PROFICIENCY: "proficiency",
  CIRCUMSTANCE: "circumstance",
  ITEM: "item",
  STATUS: "status",
  UNTYPED: "untyped"
});

class PF2Modifier {
  /**
   * Create a new modifier.
   * @param {string} name The name for the modifier; should generally be a localization key.
   * @param {number} modifier The actual numeric benefit/penalty that this modifier provides.
   * @param {string} type The type of the modifier - modifiers of the same type do not stack (except for `untyped` modifiers).
   * @param {boolean} enabled If true, this modifier will be applied to the result; otherwise, it will not.
   * @param {string} source The source which this modifier originates from, if any.
   * @param {string} notes Any notes about this modifier.
   */
  constructor(name, modifier, type, enabled = true, source = undefined, notes = undefined) {
    _defineProperty(this, "name", void 0);

    _defineProperty(this, "modifier", void 0);

    _defineProperty(this, "type", void 0);

    _defineProperty(this, "enabled", void 0);

    _defineProperty(this, "source", void 0);

    _defineProperty(this, "notes", void 0);

    _defineProperty(this, "ignored", void 0);

    _defineProperty(this, "custom", void 0);

    _defineProperty(this, "damageType", void 0);

    _defineProperty(this, "predicate", void 0);

    _defineProperty(this, "critical", void 0);

    _defineProperty(this, "traits", void 0);

    this.name = name;
    this.modifier = modifier;
    this.type = type;
    this.enabled = enabled;
    this.ignored = false;
    this.custom = false;
    if (source) this.source = source;
    if (notes) this.notes = notes;
  }

}

let UNTRAINED = {};
let TRAINED = {};
let EXPERT = {};
let MASTER = {};
let LEGENDARY = {};
function initModifiers(actorData) {
  UNTRAINED = {
    atLevel: level => {
      var _actorData$flags$exte, _actorData$flags, _actorData$flags$exte2;

      const modifier = (_actorData$flags$exte = (_actorData$flags = actorData.flags) === null || _actorData$flags === void 0 ? void 0 : (_actorData$flags$exte2 = _actorData$flags.externalactor) === null || _actorData$flags$exte2 === void 0 ? void 0 : _actorData$flags$exte2.proficiencyUntrainedModifier) !== null && _actorData$flags$exte !== void 0 ? _actorData$flags$exte : 0;
      return new PF2Modifier("PF2E.ProficiencyLevel0", modifier, PF2ModifierType.PROFICIENCY);
    }
  };
  TRAINED = {
    atLevel: level => {
      var _actorData$flags$exte3, _actorData$flags2, _actorData$flags2$ext, _actorData$flags$exte4, _actorData$flags3, _actorData$flags3$ext;

      const rule = (_actorData$flags$exte3 = (_actorData$flags2 = actorData.flags) === null || _actorData$flags2 === void 0 ? void 0 : (_actorData$flags2$ext = _actorData$flags2.externalactor) === null || _actorData$flags2$ext === void 0 ? void 0 : _actorData$flags2$ext.proficiencyVariant) !== null && _actorData$flags$exte3 !== void 0 ? _actorData$flags$exte3 : "ProficiencyWithLevel";
      let modifier = (_actorData$flags$exte4 = (_actorData$flags3 = actorData.flags) === null || _actorData$flags3 === void 0 ? void 0 : (_actorData$flags3$ext = _actorData$flags3.externalactor) === null || _actorData$flags3$ext === void 0 ? void 0 : _actorData$flags3$ext.proficiencyTrainedModifier) !== null && _actorData$flags$exte4 !== void 0 ? _actorData$flags$exte4 : 2;

      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }

      return new PF2Modifier("PF2E.ProficiencyLevel1", modifier, PF2ModifierType.PROFICIENCY);
    }
  };
  EXPERT = {
    atLevel: level => {
      var _actorData$flags$exte5, _actorData$flags4, _actorData$flags4$ext, _actorData$flags$exte6, _actorData$flags5, _actorData$flags5$ext;

      const rule = (_actorData$flags$exte5 = (_actorData$flags4 = actorData.flags) === null || _actorData$flags4 === void 0 ? void 0 : (_actorData$flags4$ext = _actorData$flags4.externalactor) === null || _actorData$flags4$ext === void 0 ? void 0 : _actorData$flags4$ext.proficiencyVariant) !== null && _actorData$flags$exte5 !== void 0 ? _actorData$flags$exte5 : "ProficiencyWithLevel";
      let modifier = (_actorData$flags$exte6 = (_actorData$flags5 = actorData.flags) === null || _actorData$flags5 === void 0 ? void 0 : (_actorData$flags5$ext = _actorData$flags5.externalactor) === null || _actorData$flags5$ext === void 0 ? void 0 : _actorData$flags5$ext.proficiencyExpertModifier) !== null && _actorData$flags$exte6 !== void 0 ? _actorData$flags$exte6 : 4;

      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }

      return new PF2Modifier("PF2E.ProficiencyLevel2", modifier, PF2ModifierType.PROFICIENCY);
    }
  };
  MASTER = {
    atLevel: level => {
      var _actorData$flags$exte7, _actorData$flags6, _actorData$flags6$ext, _actorData$flags$exte8, _actorData$flags7, _actorData$flags7$ext;

      const rule = (_actorData$flags$exte7 = (_actorData$flags6 = actorData.flags) === null || _actorData$flags6 === void 0 ? void 0 : (_actorData$flags6$ext = _actorData$flags6.externalactor) === null || _actorData$flags6$ext === void 0 ? void 0 : _actorData$flags6$ext.proficiencyVariant) !== null && _actorData$flags$exte7 !== void 0 ? _actorData$flags$exte7 : "ProficiencyWithLevel";
      let modifier = (_actorData$flags$exte8 = (_actorData$flags7 = actorData.flags) === null || _actorData$flags7 === void 0 ? void 0 : (_actorData$flags7$ext = _actorData$flags7.externalactor) === null || _actorData$flags7$ext === void 0 ? void 0 : _actorData$flags7$ext.proficiencyMasterModifier) !== null && _actorData$flags$exte8 !== void 0 ? _actorData$flags$exte8 : 6;

      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }

      return new PF2Modifier("PF2E.ProficiencyLevel3", modifier, PF2ModifierType.PROFICIENCY);
    }
  };
  LEGENDARY = {
    atLevel: level => {
      var _actorData$flags$exte9, _actorData$flags8, _actorData$flags8$ext, _actorData$flags$exte10, _actorData$flags9, _actorData$flags9$ext;

      const rule = (_actorData$flags$exte9 = (_actorData$flags8 = actorData.flags) === null || _actorData$flags8 === void 0 ? void 0 : (_actorData$flags8$ext = _actorData$flags8.externalactor) === null || _actorData$flags8$ext === void 0 ? void 0 : _actorData$flags8$ext.proficiencyVariant) !== null && _actorData$flags$exte9 !== void 0 ? _actorData$flags$exte9 : "ProficiencyWithLevel";
      let modifier = (_actorData$flags$exte10 = (_actorData$flags9 = actorData.flags) === null || _actorData$flags9 === void 0 ? void 0 : (_actorData$flags9$ext = _actorData$flags9.externalactor) === null || _actorData$flags9$ext === void 0 ? void 0 : _actorData$flags9$ext.proficiencyLegendaryModifier) !== null && _actorData$flags$exte10 !== void 0 ? _actorData$flags$exte10 : 8;

      if (rule === "ProficiencyWithLevel") {
        modifier += level;
      }

      return new PF2Modifier("PF2E.ProficiencyLevel4", modifier, PF2ModifierType.PROFICIENCY);
    }
  };
}
const ProficiencyModifier = Object.freeze({
  fromLevelAndRank: (level, rank) => {
    switch (rank || 0) {
      case 0:
        return UNTRAINED.atLevel(level);

      case 1:
        return TRAINED.atLevel(level);

      case 2:
        return EXPERT.atLevel(level);

      case 3:
        return MASTER.atLevel(level);

      case 4:
        return LEGENDARY.atLevel(level);

      default:
        throw new RangeError(`invalid proficiency rank: ${rank}`);
    }
  }
});
// CONCATENATED MODULE: ./src/libs/conditions.js
class ConditionManager {
  static getFlattenedConditions(items) {
    const conditions = new Map();
    items.sort((a, b) => ConditionManager.__sortCondition(a, b)).forEach(c => {
      // Sorted list of conditions.
      // First by active, then by base (lexicographically), then by value (descending).
      let name = `${c.data.base}`;
      let condition;

      if (c.data.value.isValued) {
        name = `${name} ${c.data.value.value}`;
      }

      if (conditions.has(name)) {
        // Have already seen condition
        condition = conditions.get(name);
      } else {
        // Have not seen condition
        condition = {
          id: c._id,
          active: c.data.active,
          name: name,
          // eslint-disable-line object-shorthand
          value: c.data.value.isValued ? c.data.value.value : undefined,
          description: c.data.description.value,
          img: c.img,
          references: false,
          parents: [],
          children: [],
          overrides: [],
          overriddenBy: [],
          immunityFrom: []
        };
        conditions.set(name, condition);
      } // Update any references


      if (c.data.references.parent) {
        const refCondition = items.find(i => i._id === c.data.references.parent.id);

        if (refCondition) {
          const ref = {
            id: c.data.references.parent,
            name: refCondition.name,
            base: refCondition.data.base,
            text: ""
          };

          if (refCondition.data.value.isValued) {
            ref.name = `${ref.name} ${refCondition.data.value.value}`;
          }

          ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;
          condition.references = true;
          condition.parents.push(ref);
        }
      }

      c.data.references.children.forEach(item => {
        const refCondition = items.find(i => i._id === item.id);

        if (refCondition) {
          const ref = {
            id: c.data.references.parent,
            name: refCondition.name,
            base: refCondition.data.base,
            text: ""
          };

          if (refCondition.data.value.isValued) {
            ref.name = `${ref.name} ${refCondition.data.value.value}`;
          }

          ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;
          condition.references = true;
          condition.children.push(ref);
        }
      });
      c.data.references.overrides.forEach(item => {
        const refCondition = items.find(i => i._id === item.id);

        if (refCondition) {
          const ref = {
            id: c.data.references.parent,
            name: refCondition.name,
            base: refCondition.data.base,
            text: ""
          };

          if (refCondition.data.value.isValued) {
            ref.name = `${ref.name} ${refCondition.data.value.value}`;
          }

          ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;
          condition.references = true;
          condition.overrides.push(ref);
        }
      });
      c.data.references.overriddenBy.forEach(item => {
        const refCondition = items.find(i => i._id === item.id);

        if (refCondition) {
          const ref = {
            id: c.data.references.parent,
            name: refCondition.name,
            base: refCondition.data.base,
            text: ""
          };

          if (refCondition.data.value.isValued) {
            ref.name = `${ref.name} ${refCondition.data.value.value}`;
          }

          ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;
          condition.references = true;
          condition.overriddenBy.push(ref);
        }
      });
      c.data.references.immunityFrom.forEach(item => {
        const refCondition = items.find(i => i._id === item.id);

        if (refCondition) {
          const ref = {
            id: c.data.references.parent,
            name: refCondition.name,
            base: refCondition.data.base,
            text: ""
          };

          if (refCondition.data.value.isValued) {
            ref.name = `${ref.name} ${refCondition.data.value.value}`;
          }

          ref.text = `@Compendium[pf2e.conditionitems.${refCondition.data.base}]{${ref.name}}`;
          condition.references = true;
          condition.immunityFrom.push(ref);
        }
      });
    });
    return Array.from(conditions.values());
  }

  static __sortCondition(a, b) {
    if (a.data.active === b.data.active) {
      // Both are active or both inactive.
      if (a.data.base === b.data.base) {
        // Both are same base
        if (a.data.value.isValued) {
          // Valued condition
          // Sort values by descending order.
          return b.data.value.value - a.data.value.value;
        } else {
          // Not valued condition
          return 0;
        }
      } else {
        // Different bases
        return a.data.base.localeCompare(b.data.base);
      }
    } else if (a.data.active && !b.data.active) {
      // A is active, B is not
      // A should be before B.
      return -1;
    } else if (!a.data.active && b.data.active) {
      // B is active, A is not
      // Be should be before A.
      return 1;
    }

    return 0;
  }

}
// EXTERNAL MODULE: ./src/libs/TextEditor.js
var TextEditor = __webpack_require__(61);

// CONCATENATED MODULE: ./src/libs/bulk.js
function bulk_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


class Bulk {
  constructor({
    normal = 0,
    light = 0
  } = {}) {
    bulk_defineProperty(this, "normal", void 0);

    bulk_defineProperty(this, "light", void 0);

    this.normal = normal + Math.floor(light / 10);
    this.light = light % 10;
  }

  get isNegligible() {
    return this.normal === 0 && this.light === 0;
  }

  get isLight() {
    return this.toLightBulk() < 10 && !this.isNegligible;
  }

  toLightBulk() {
    return this.normal * 10 + this.light;
  }

  plus(bulk) {
    return new Bulk({
      normal: this.normal + bulk.normal,
      light: this.light + bulk.light
    });
  }

  minus(bulk) {
    // 1 bulk is 10 light bulk
    const [thisBulk, otherBulk] = this._toSingleNumber(bulk);

    const result = thisBulk - otherBulk; // bulk can't get negative

    if (result < 0) {
      return new Bulk();
    }

    return new Bulk({
      normal: Math.floor(result / 10),
      light: result % 10
    });
  }

  _toSingleNumber(bulk) {
    return [this.normal * 10 + this.light, bulk.normal * 10 + bulk.light];
  }

  times(factor) {
    return new Bulk({
      normal: this.normal * factor,
      light: this.light * factor
    });
  }

  isSmallerThan(bulk) {
    const [thisBulk, otherBulk] = this._toSingleNumber(bulk);

    return thisBulk < otherBulk;
  }

  isBiggerThan(bulk) {
    const [thisBulk, otherBulk] = this._toSingleNumber(bulk);

    return thisBulk > otherBulk;
  }

  isEqualTo(bulk) {
    return this.normal === bulk.normal && this.light === bulk.light;
  }

  isPositive() {
    return this.normal > 0 || this.light > 0;
  }

  toString() {
    return `normal: ${this.normal}; light: ${this.light}`;
  }

}
const defaultBulkConfig = {
  ignoreCoinBulk: false,
  ignoreContainerOverflow: false
};
function calculateBulk(items, stackDefinitions, nestedExtraDimensionalContainer = false, bulkConfig = defaultBulkConfig) {
  const inventory = new BulkItem({
    holdsItems: items
  });
  return calculateCombinedBulk(inventory, stackDefinitions, nestedExtraDimensionalContainer, bulkConfig);
}
const lightBulkRegex = /^(\d*)l$/i;
const complexBulkRegex = /^(\d+);\s*(\d*)l$/i;
function weightToBulk(weight) {
  if (weight === undefined || weight === null) {
    return undefined;
  }

  const trimmed = weight.trim();

  if (/^\d+$/.test(trimmed)) {
    return new Bulk({
      normal: parseInt(trimmed, 10)
    });
  }

  const lightMatch = trimmed.match(lightBulkRegex);

  if (lightMatch) {
    return new Bulk({
      light: parseInt(lightMatch[1] || "1", 10)
    });
  }

  const complexMatch = trimmed.match(complexBulkRegex);

  if (complexMatch) {
    const [, normal, light] = complexMatch;
    return new Bulk({
      normal: parseInt(normal, 10),
      light: parseInt(light || "1", 10)
    });
  }

  return undefined;
}
function formatBulk(bulk) {
  if (bulk.normal === 0 && bulk.light === 0) {
    return "-";
  }

  if (bulk.normal > 0 && bulk.light === 0) {
    return `${bulk.normal}`;
  }

  if (bulk.light === 1 && bulk.normal === 0) {
    return `L`;
  }

  if (bulk.light > 0 && bulk.normal === 0) {
    return `${bulk.light}L`;
  }

  return `${bulk.normal}; ${bulk.light}L`;
}
class BulkItem {
  constructor({
    id = "",
    bulk = new Bulk(),
    quantity = 1,
    stackGroup = undefined,
    isEquipped = false,
    // value to overrides bulk field when unequipped
    unequippedBulk = undefined,
    // value to overrides bulk field when equipped
    equippedBulk = undefined,
    holdsItems = [],
    // some containers like a backpack or back of holding reduce total bulk if
    // items are put into it
    negateBulk = new Bulk(),
    // extra dimensional containers cease to work when nested inside each other
    extraDimensionalContainer = false
  } = {}) {
    bulk_defineProperty(this, "id", void 0);

    bulk_defineProperty(this, "bulk", void 0);

    bulk_defineProperty(this, "quantity", void 0);

    bulk_defineProperty(this, "stackGroup", void 0);

    bulk_defineProperty(this, "isEquipped", void 0);

    bulk_defineProperty(this, "unequippedBulk", void 0);

    bulk_defineProperty(this, "equippedBulk", void 0);

    bulk_defineProperty(this, "holdsItems", void 0);

    bulk_defineProperty(this, "negateBulk", void 0);

    bulk_defineProperty(this, "extraDimensionalContainer", void 0);

    this.id = id;
    this.bulk = bulk;
    this.quantity = quantity;
    this.stackGroup = stackGroup;
    this.holdsItems = holdsItems;
    this.negateBulk = negateBulk;
    this.unequippedBulk = unequippedBulk;
    this.equippedBulk = equippedBulk;
    this.isEquipped = isEquipped;
    this.extraDimensionalContainer = extraDimensionalContainer;
  }

  get reducesBulk() {
    return !this.negateBulk.isNegligible;
  }

}

function calculateCombinedBulk(item, stackDefinitions, nestedExtraDimensionalContainer = false, bulkConfig = defaultBulkConfig) {
  const [mainBulk, mainOverflow] = calculateItemBulk(item, stackDefinitions, bulkConfig);
  const [childBulk, childOverflow] = item.holdsItems.map(child => calculateCombinedBulk(child, stackDefinitions, item.extraDimensionalContainer, bulkConfig)).reduce(combineBulkAndOverflow, [new Bulk(), {}]); // combine item overflow and child overflow

  const combinedOverflow = combineObjects(mainOverflow, calculateChildOverflow(childOverflow, item, bulkConfig.ignoreContainerOverflow), add);
  const [overflowBulk, remainingOverflow] = calculateStackBulk(combinedOverflow, stackDefinitions, bulkConfig);
  return [mainBulk.plus(reduceNestedItemBulk(childBulk, item, nestedExtraDimensionalContainer)).plus(overflowBulk), remainingOverflow];
}

function calculateItemBulk(item, stackDefinitions, bulkConfig) {
  const stackName = item.stackGroup;

  if (isBlank(stackName)) {
    return [calculateNonStackBulk(item).times(item.quantity), {}];
  }

  return calculateStackBulk({
    [stackName]: item.quantity
  }, stackDefinitions, bulkConfig);
}

function combineObjects(first, second, mergeFunction) {
  const combinedKeys = new Set([...Object.keys(first), ...Object.keys(second)]);
  const combinedObject = {};

  for (const name of combinedKeys) {
    if (name in first && name in second) {
      combinedObject[name] = mergeFunction(first[name], second[name]);
    } else if (name in first) {
      combinedObject[name] = first[name];
    } else if (name in second) {
      combinedObject[name] = second[name];
    }
  }

  return combinedObject;
}

function calculateChildOverflow(overflow, item, ignoreContainerOverflow) {
  if (item.extraDimensionalContainer || ignoreContainerOverflow) {
    return {};
  }

  return overflow;
}

function calculateNonStackBulk(item) {
  if (item.unequippedBulk !== undefined && item.unequippedBulk !== null && !item.isEquipped) {
    return item.unequippedBulk;
  }

  if (item.equippedBulk !== undefined && item.equippedBulk !== null && item.isEquipped) {
    return item.equippedBulk;
  }

  return item.bulk;
}

function calculateStackBulk(itemStacks, stackDefinitions, bulkConfig = defaultBulkConfig) {
  return Object.entries(itemStacks).filter(([stackType]) => !(bulkConfig.ignoreCoinBulk && stackType === "coins")).map(([stackType, quantity]) => {
    if (!(stackType in stackDefinitions)) {
      throw new Error(`No stack definition found for stack ${stackType}`);
    }

    const {
      size,
      lightBulk
    } = stackDefinitions[stackType];
    const bulkRelevantQuantity = Math.floor(quantity / size);
    const itemBulk = new Bulk({
      light: bulkRelevantQuantity * lightBulk
    });
    const overflow = {
      [stackType]: quantity % size
    };
    const result = [itemBulk, overflow];
    return result;
  }).reduce(combineBulkAndOverflow, [new Bulk(), {}]);
}

function reduceNestedItemBulk(bulk, item, nestedExtraDimensionalContainer) {
  if (isExtraDimensionalOrWorn(item, nestedExtraDimensionalContainer)) {
    return bulk.minus(item.negateBulk);
  }

  return bulk;
}

function add(x, y) {
  return x + y;
}

function isBlank(string) {
  return string === null || string === undefined || string.trim() === "";
}

function combineBulkAndOverflow(first, second) {
  const [firstBulk, firstOverflow] = first;
  const [secondBulk, secondOverflow] = second;
  return [firstBulk.plus(secondBulk), combineObjects(firstOverflow, secondOverflow, add)];
}

function isExtraDimensionalOrWorn(item, nestedExtraDimensionalContainer) {
  return item.extraDimensionalContainer && !nestedExtraDimensionalContainer || item.reducesBulk && item.isEquipped;
}

function indexBulkItemsById(bulkItems = []) {
  const result = new Map();
  bulkItems.forEach(bulkItem => fillBulkIndex(bulkItem, result));
  return result;
}

function fillBulkIndex(bulkItem, resultMap) {
  resultMap.set(bulkItem.id, bulkItem);
  bulkItem.holdsItems.forEach(heldBulkItem => fillBulkIndex(heldBulkItem, resultMap));
}

function itemsFromActorData(actorData) {
  return toBulkItems(actorData.items.filter(isPhysicalItem));
}

function toBulkItems(items) {
  const allIds = new Set(items.map(item => item._id));
  const itemsInContainers = groupBy(items, item => {
    var _item$data$containerI, _item$data, _item$data$containerI2;

    // we want all items in the top level group that are in no container
    // or are never referenced because we don't want the items to
    // disappear if the container is being deleted or doesn't have a reference
    const ref = (_item$data$containerI = (_item$data = item.data) === null || _item$data === void 0 ? void 0 : (_item$data$containerI2 = _item$data.containerId) === null || _item$data$containerI2 === void 0 ? void 0 : _item$data$containerI2.value) !== null && _item$data$containerI !== void 0 ? _item$data$containerI : null;

    if (ref === null || !allIds.has(ref)) {
      return null;
    }

    return ref;
  });

  if (itemsInContainers.has(null)) {
    const topLevelItems = itemsInContainers.get(null);
    return buildContainerTree(topLevelItems, itemsInContainers);
  }

  return [];
}

function buildContainerTree(items, groupedItems) {
  return items.map(item => {
    const itemId = item._id;

    if (itemId !== null && itemId !== undefined && groupedItems.has(itemId)) {
      const itemsInContainer = buildContainerTree(groupedItems.get(itemId), groupedItems);
      return toBulkItem(item, itemsInContainer);
    }

    return toBulkItem(item);
  });
}

function toBulkItem(item, nestedItems = []) {
  var _item$data2, _item$data2$weight, _item$data$quantity$v, _item$data3, _item$data3$quantity, _item$data$equipped$v, _item$data4, _item$data4$equipped, _item$data5, _item$data5$equippedB, _item$data6, _item$data6$unequippe, _item$data7, _item$data7$stackGrou, _item$data8, _item$data8$negateBul, _item$data$traits$val, _item$data9, _item$data9$traits, _item$data9$traits$va, _weightToBulk, _weightToBulk2;

  const id = item._id;
  const weight = (_item$data2 = item.data) === null || _item$data2 === void 0 ? void 0 : (_item$data2$weight = _item$data2.weight) === null || _item$data2$weight === void 0 ? void 0 : _item$data2$weight.value;
  const quantity = (_item$data$quantity$v = (_item$data3 = item.data) === null || _item$data3 === void 0 ? void 0 : (_item$data3$quantity = _item$data3.quantity) === null || _item$data3$quantity === void 0 ? void 0 : _item$data3$quantity.value) !== null && _item$data$quantity$v !== void 0 ? _item$data$quantity$v : 0;
  const isEquipped = (_item$data$equipped$v = (_item$data4 = item.data) === null || _item$data4 === void 0 ? void 0 : (_item$data4$equipped = _item$data4.equipped) === null || _item$data4$equipped === void 0 ? void 0 : _item$data4$equipped.value) !== null && _item$data$equipped$v !== void 0 ? _item$data$equipped$v : false;
  const equippedBulk = (_item$data5 = item.data) === null || _item$data5 === void 0 ? void 0 : (_item$data5$equippedB = _item$data5.equippedBulk) === null || _item$data5$equippedB === void 0 ? void 0 : _item$data5$equippedB.value;
  const unequippedBulk = (_item$data6 = item.data) === null || _item$data6 === void 0 ? void 0 : (_item$data6$unequippe = _item$data6.unequippedBulk) === null || _item$data6$unequippe === void 0 ? void 0 : _item$data6$unequippe.value;
  const stackGroup = (_item$data7 = item.data) === null || _item$data7 === void 0 ? void 0 : (_item$data7$stackGrou = _item$data7.stackGroup) === null || _item$data7$stackGrou === void 0 ? void 0 : _item$data7$stackGrou.value;
  const negateBulk = (_item$data8 = item.data) === null || _item$data8 === void 0 ? void 0 : (_item$data8$negateBul = _item$data8.negateBulk) === null || _item$data8$negateBul === void 0 ? void 0 : _item$data8$negateBul.value;
  const extraDimensionalContainer = (_item$data$traits$val = (_item$data9 = item.data) === null || _item$data9 === void 0 ? void 0 : (_item$data9$traits = _item$data9.traits) === null || _item$data9$traits === void 0 ? void 0 : (_item$data9$traits$va = _item$data9$traits.value) === null || _item$data9$traits$va === void 0 ? void 0 : _item$data9$traits$va.includes("extradimensional")) !== null && _item$data$traits$val !== void 0 ? _item$data$traits$val : false;
  return new BulkItem({
    id,
    bulk: (_weightToBulk = weightToBulk(normalizeWeight(weight))) !== null && _weightToBulk !== void 0 ? _weightToBulk : new Bulk(),
    negateBulk: (_weightToBulk2 = weightToBulk(normalizeWeight(negateBulk))) !== null && _weightToBulk2 !== void 0 ? _weightToBulk2 : new Bulk(),
    // this stuff overrides bulk so we don't want to default to 0 bulk if undefined
    unequippedBulk: weightToBulk(normalizeWeight(unequippedBulk)),
    equippedBulk: weightToBulk(normalizeWeight(equippedBulk)),
    holdsItems: nestedItems,
    stackGroup,
    isEquipped,
    quantity,
    extraDimensionalContainer
  });
}

function normalizeWeight(weight) {
  if (weight === null || weight === undefined) {
    return undefined;
  } // turn numbers into strings


  const stringWeight = `${weight}`;
  return stringWeight.toLowerCase().trim();
}

function isPhysicalItem(item) {
  return "data" in item && "quantity" in item.data;
}

const stacks = {
  bolts: {
    size: 10,
    lightBulk: 1
  },
  arrows: {
    size: 10,
    lightBulk: 1
  },
  slingBullets: {
    size: 10,
    lightBulk: 1
  },
  blowgunDarts: {
    size: 10,
    lightBulk: 1
  },
  rations: {
    size: 7,
    lightBulk: 1
  },
  coins: {
    size: 1000,
    lightBulk: 10
  },
  gems: {
    size: 2000,
    lightBulk: 10
  }
};
const bulkConversions = {
  Tiny: {
    bulkLimitFactor: 0.5,
    treatsAsLight: "-",
    treatsAsNegligible: null
  },
  Small: {
    bulkLimitFactor: 1,
    treatsAsLight: "L",
    treatsAsNegligible: "-"
  },
  Medium: {
    bulkLimitFactor: 1,
    treatsAsLight: "L",
    treatsAsNegligible: "-"
  },
  Large: {
    bulkLimitFactor: 2,
    treatsAsLight: "1",
    treatsAsNegligible: "L"
  },
  Huge: {
    bulkLimitFactor: 4,
    treatsAsLight: "2",
    treatsAsNegligible: "1"
  },
  Gargantuan: {
    bulkLimitFactor: 8,
    treatsAsLight: "4",
    treatsAsNegligible: "2"
  }
};
// CONCATENATED MODULE: ./src/libs/container.js
function container_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class ContainerData {
  constructor({
    item,
    heldItems,
    negateBulk,
    capacity,
    heldItemBulk,
    isInContainer,
    formattedNegateBulk,
    formattedHeldItemBulk,
    formattedCapacity
  }) {
    container_defineProperty(this, "item", void 0);

    container_defineProperty(this, "heldItems", void 0);

    container_defineProperty(this, "negateBulk", void 0);

    container_defineProperty(this, "heldItemBulk", void 0);

    container_defineProperty(this, "isInContainer", void 0);

    container_defineProperty(this, "formattedHeldItemBulk", void 0);

    container_defineProperty(this, "formattedNegateBulk", void 0);

    container_defineProperty(this, "formattedCapacity", void 0);

    container_defineProperty(this, "capacity", void 0);

    this.item = item;
    this.heldItems = heldItems;
    this.negateBulk = negateBulk;
    this.heldItemBulk = heldItemBulk;
    this.isInContainer = isInContainer;
    this.formattedHeldItemBulk = formattedHeldItemBulk;
    this.formattedNegateBulk = formattedNegateBulk;
    this.formattedCapacity = formattedCapacity;
    this.capacity = capacity;
  }

  get isContainer() {
    return !this.capacity.isNegligible;
  }

  get isCollapsed() {
    var _this$item$data$colla, _this$item, _this$item$data, _this$item$data$colla2;

    return (_this$item$data$colla = (_this$item = this.item) === null || _this$item === void 0 ? void 0 : (_this$item$data = _this$item.data) === null || _this$item$data === void 0 ? void 0 : (_this$item$data$colla2 = _this$item$data.collapsed) === null || _this$item$data$colla2 === void 0 ? void 0 : _this$item$data$colla2.value) !== null && _this$item$data$colla !== void 0 ? _this$item$data$colla : false;
  }

  get isNotInContainer() {
    return !this.isInContainer;
  }

  _getLightBulkCapacityThreshold() {
    if (this.capacity.normal > 0) {
      // light bulk don't count towards bulk limit
      return this.capacity.toLightBulk() + 10;
    } // but do if the container only stores light bulk


    return this.capacity.light;
  }

  get fullPercentage() {
    const capacity = this._getLightBulkCapacityThreshold();

    if (capacity === 0) {
      return 0;
    }

    const heldLightBulk = this.heldItemBulk.toLightBulk();
    return Math.floor(heldLightBulk / capacity * 100);
  }

  get fullPercentageMax100() {
    const percentage = this.fullPercentage;

    if (percentage > 100) {
      return 100;
    }

    return percentage;
  }

  get isOverLoaded() {
    if (this.capacity.normal > 0) {
      return this.heldItemBulk.toLightBulk() >= this.capacity.toLightBulk() + 10;
    }

    return this.heldItemBulk.toLightBulk() > this.capacity.light;
  }

}

function getContainerMap(items = [], bulkItemsById = new Map(), stackDefinitions, bulkConfig = defaultBulkConfig) {
  const allIds = groupBy(items, item => item._id);
  const containerGroups = groupBy(items, item => {
    var _item$data, _item$data$containerI;

    const containerId = item === null || item === void 0 ? void 0 : (_item$data = item.data) === null || _item$data === void 0 ? void 0 : (_item$data$containerI = _item$data.containerId) === null || _item$data$containerI === void 0 ? void 0 : _item$data$containerI.value;

    if (allIds.has(containerId)) {
      return containerId;
    }

    return null;
  });
  const idIndexedContainerData = new Map();

  for (const item of items) {
    var _item$data2, _item$data2$container, _bulkItemsById$get$ho, _bulkItemsById$get;

    const isInContainer = containerGroups.has(item === null || item === void 0 ? void 0 : (_item$data2 = item.data) === null || _item$data2 === void 0 ? void 0 : (_item$data2$container = _item$data2.containerId) === null || _item$data2$container === void 0 ? void 0 : _item$data2$container.value);
    const heldItems = containerGroups.get(item._id) || [];
    idIndexedContainerData.set(item._id, toContainer(allIds.get(item._id)[0], heldItems, (_bulkItemsById$get$ho = (_bulkItemsById$get = bulkItemsById.get(item._id)) === null || _bulkItemsById$get === void 0 ? void 0 : _bulkItemsById$get.holdsItems) !== null && _bulkItemsById$get$ho !== void 0 ? _bulkItemsById$get$ho : [], isInContainer, stackDefinitions, bulkConfig));
  }

  return idIndexedContainerData;
}
/* -------------------------------------------- */

function groupBy(array, criterion) {
  const result = new Map();

  for (const elem of array) {
    const key = criterion(elem);

    if (result.get(key) === undefined) {
      result.set(key, [elem]);
    } else {
      result.get(key).push(elem);
    }
  }

  return result;
}
/* -------------------------------------------- */

function toContainer(item, heldItems = [], heldBulkItems = [], isInContainer, stackDefinitions, bulkConfig) {
  var _weightToBulk, _item$data3, _item$data3$negateBul, _weightToBulk2, _item$data4, _item$data4$bulkCapac;

  const negateBulk = (_weightToBulk = weightToBulk((_item$data3 = item.data) === null || _item$data3 === void 0 ? void 0 : (_item$data3$negateBul = _item$data3.negateBulk) === null || _item$data3$negateBul === void 0 ? void 0 : _item$data3$negateBul.value)) !== null && _weightToBulk !== void 0 ? _weightToBulk : new Bulk();
  const [heldItemBulk] = calculateBulk(heldBulkItems, stackDefinitions, false, bulkConfig);
  const capacity = (_weightToBulk2 = weightToBulk((_item$data4 = item.data) === null || _item$data4 === void 0 ? void 0 : (_item$data4$bulkCapac = _item$data4.bulkCapacity) === null || _item$data4$bulkCapac === void 0 ? void 0 : _item$data4$bulkCapac.value)) !== null && _weightToBulk2 !== void 0 ? _weightToBulk2 : new Bulk();
  return new ContainerData({
    item,
    heldItems,
    negateBulk,
    capacity,
    heldItemBulk,
    isInContainer,
    formattedNegateBulk: formatBulk(negateBulk),
    formattedHeldItemBulk: formatBulk(heldItemBulk),
    formattedCapacity: formatBulk(capacity)
  });
}
// CONCATENATED MODULE: ./src/libs/encumbrance.js
function encumbrance_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



class InventoryWeight {
  constructor(combinedBulk, encumberedAt, limit) {
    encumbrance_defineProperty(this, "combinedBulk", void 0);

    encumbrance_defineProperty(this, "encumberedAt", void 0);

    encumbrance_defineProperty(this, "limit", void 0);

    this.combinedBulk = combinedBulk;
    this.encumberedAt = encumberedAt;
    this.limit = limit;
  }

  get encumberedPercentage() {
    const totalTimes10 = this.combinedBulk.toLightBulk();
    const encumberedAtTimes10 = this.encumberedAt * 10 + 10;
    return Math.floor(totalTimes10 / encumberedAtTimes10 * 100);
  }

  get limitPercentage() {
    const totalTimes10 = this.combinedBulk.toLightBulk();
    const limitTimes10 = this.limit * 10 + 10;
    return Math.floor(totalTimes10 / limitTimes10 * 100);
  }

  get limitPercentageMax100() {
    if (this.limitPercentage > 100) {
      return 100;
    }

    return this.limitPercentage;
  }

  get isEncumbered() {
    return this.combinedBulk.normal > this.encumberedAt;
  }

  get isOverLimit() {
    return this.combinedBulk.normal > this.limit;
  }

  get bulk() {
    return this.combinedBulk.normal;
  }

}

function calculateEncumbrance(strengthModifier, bonusBulkEncumbrance, bonusBulkLimit, combinedBulk, actorSize = 'Medium') {
  const bulkFactor = bulkConversions[actorSize].bulkLimitFactor;
  const encumberedAt = Math.floor((strengthModifier + bonusBulkEncumbrance + 5) * bulkFactor);
  const limit = Math.floor((strengthModifier + bonusBulkLimit + 10) * bulkFactor);
  return new InventoryWeight(combinedBulk, encumberedAt, limit);
}
// CONCATENATED MODULE: ./src/libs/ChatData.js


const ChatData = {
  armorChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    const properties = [PF2E.armorTypes[data.armorType.value], PF2E.armorGroups[data.group.value], `${addSign(getArmorBonus(data))} ${stringify_default()("PF2E.ArmorArmorLabel")}`, `${data.dex.value || 0} ${stringify_default()("PF2E.ArmorDexLabel")}`, `${data.check.value || 0} ${stringify_default()("PF2E.ArmorCheckLabel")}`, `${data.speed.value || 0} ${stringify_default()("PF2E.ArmorSpeedLabel")}`, data.traits.value, data.equipped.value ? stringify_default()("PF2E.ArmorEquippedLabel") : null];
    data.properties = properties.filter(p => p !== null);
    data.traits = null;
    return data;
  },

  /* -------------------------------------------- */
  equipmentChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    const properties = [data.equipped.value ? stringify_default()("PF2E.EquipmentEquippedLabel") : null];
    data.properties = properties.filter(p => p !== null);
    return data;
  },

  /* -------------------------------------------- */
  weaponChatData(item, actorData) {
    var _actorData$abilities$, _actorData$abilities, _actorData$abilities$2;

    const data = JSON.parse(JSON.stringify(item.data));
    actorData = actorData.data;
    const traits = [];
    const itemTraits = data.traits.value;
    let twohandedTrait = false;
    const twohandedRegex = "(\\btwo-hand\\b)-(d\\d+)";

    if (item.type !== "weapon") {
      throw new Error("tried to create a weapon chat data for a non-weapon item");
    }

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.weaponTraits[data.traits.value[i]] || data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || ""
        };
        traits.push(traitsObject); // Check if two-handed trait is present

        if (itemTraits[i].match(twohandedRegex)) {
          twohandedTrait = true;
        }
      }
    } // calculate attackRoll modifier (for _onItemSummary)


    const isFinesse = (data.traits.value || []).includes("finesse");
    const abl = isFinesse && actorData.abilities.dex.mod > actorData.abilities.str.mod ? "dex" : data.ability.value || "str";
    const prof = data.weaponType.value || "simple"; // if a default martial proficiency then lookup the martial value, else find the martialSkill item and get the value from there.

    const proficiency = {
      type: "default",
      value: 0
    };

    if (Object.keys(PF2E.weaponTypes).includes(prof)) {
      var _actorData$martial, _actorData$martial$pr;

      proficiency.type = "martial";
      proficiency.value = ((_actorData$martial = actorData.martial) === null || _actorData$martial === void 0 ? void 0 : (_actorData$martial$pr = _actorData$martial[prof]) === null || _actorData$martial$pr === void 0 ? void 0 : _actorData$martial$pr.value) || 0;
    } else {
      try {
        const martialSkill = actorData.items.find(item => item._id === prof);

        if (martialSkill.type === "martial") {
          var _martialSkill$data$pr;

          proficiency.type = "skill";
          const rank = ((_martialSkill$data$pr = martialSkill.data.proficient) === null || _martialSkill$data$pr === void 0 ? void 0 : _martialSkill$data$pr.value) || 0;
          proficiency.value = ProficiencyModifier.fromLevelAndRank(actorData.details.level.value, rank).modifier;
        }
      } catch (err) {
        console.log(`PF2E | Could not find martial skill for ${prof}`);
      }
    }

    data.proficiency = proficiency;
    data.attackRoll = getAttackBonus(data) + ((_actorData$abilities$ = (_actorData$abilities = actorData.abilities) === null || _actorData$abilities === void 0 ? void 0 : (_actorData$abilities$2 = _actorData$abilities[abl]) === null || _actorData$abilities$2 === void 0 ? void 0 : _actorData$abilities$2.mod) !== null && _actorData$abilities$ !== void 0 ? _actorData$abilities$ : 0) + proficiency.value;
    const properties = [];

    if (data.group.value) {
      data.critSpecialization = {
        label: PF2E.weaponGroups[data.group.value],
        description: PF2E.weaponDescriptions[data.group.value]
      };
    }

    data.isTwohanded = !!twohandedTrait;
    data.wieldedTwoHands = !!data.hands.value;
    data.isFinesse = isFinesse;
    data.properties = properties.filter(p => !!p);
    data.traits = traits.filter(p => !!p);
    const map = calculateMap(item);
    data.map2 = map.map2;
    data.map3 = map.map3;
    return data;
  },

  /* -------------------------------------------- */
  meleeChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    const traits = [];

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.weaponTraits[data.traits.value[i]] || data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || ""
        };
        traits.push(traitsObject);
      }
    }

    const isAgile = (data.traits.value || []).includes("agile");
    data.map2 = isAgile ? "-4" : "-5";
    data.map3 = isAgile ? "-8" : "-10";
    data.traits = traits.filter(p => !!p);
    return data;
  },

  /* -------------------------------------------- */
  consumableChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.consumableType.str = PF2E.consumableTypes[data.consumableType.value];
    data.properties = [data.consumableType.str, `${data.charges.value}/${data.charges.max} ${stringify_default()("PF2E.ConsumableChargesLabel")}`];
    data.hasCharges = data.charges.value >= 0;
    return data;
  },

  /* -------------------------------------------- */
  treasureChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    return data;
  },

  /* -------------------------------------------- */
  toolChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));
    const abl = actorData.data.abilities[data.ability.value].label;
    const prof = data.proficient.value || 0;
    const properties = [abl, PF2E.proficiencyLevels[prof]];
    data.properties = properties.filter(p => p !== null);
    return data;
  },

  /* -------------------------------------------- */
  loreChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));

    if (actorData.type !== "npc") {
      const abl = actorData.data.abilities[data.ability.value].label;
      const prof = data.proficient.value || 0;
      const properties = [abl, PF2E.proficiencyLevels[prof]];
      data.properties = properties.filter(p => p !== null);
    }

    return data;
  },

  /* -------------------------------------------- */
  backpackChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.properties = [];
    return data;
  },

  /* -------------------------------------------- */
  spellChatData(item, actorData) {
    var _data$areasize;

    const data = JSON.parse(JSON.stringify(item.data));
    const spellcastingEntry = actorData.items.find(item => item._id === data.location.value);
    if (spellcastingEntry === null || spellcastingEntry.type !== "spellcastingEntry") return {};
    const spellDC = spellcastingEntry.data.spelldc.dc;
    const spellAttack = spellcastingEntry.data.spelldc.value; // Spell saving throw text and DC

    data.isSave = data.spellType.value === "save";

    if (data.isSave) {
      data.save.dc = spellDC;
    } else data.save.dc = spellAttack;

    data.save.str = data.save.value ? PF2E.saves[data.save.value.toLowerCase()] : ""; // Spell attack labels

    data.damageLabel = data.spellType.value === "heal" ? stringify_default()("PF2E.SpellTypeHeal") : stringify_default()("PF2E.DamageLabel");
    data.isAttack = data.spellType.value === "attack"; // Combine properties

    const props = [PF2E.spellLevels[data.level.value], `${stringify_default()("PF2E.SpellComponentsLabel")}: ${data.components.value}`, data.range.value ? `${stringify_default()("PF2E.SpellRangeLabel")}: ${data.range.value}` : null, data.target.value ? `${stringify_default()("PF2E.SpellTargetLabel")}: ${data.target.value}` : null, data.area.value ? `${stringify_default()("PF2E.SpellAreaLabel")}: ${PF2E.areaSizes[data.area.value]} ${PF2E.areaTypes[data.area.areaType]}` : null, (_data$areasize = data.areasize) !== null && _data$areasize !== void 0 && _data$areasize.value ? `${stringify_default()("PF2E.SpellAreaLabel")}: ${data.areasize.value}` : null, data.time.value ? `${stringify_default()("PF2E.SpellTimeLabel")}: ${data.time.value}` : null, data.duration.value ? `${stringify_default()("PF2E.SpellDurationLabel")}: ${data.duration.value}` : null];
    data.spellLvl = {}.spellLvl;

    if (data.level.value < parseInt(data.spellLvl, 10)) {
      props.push(`Heightened: +${parseInt(data.spellLvl, 10) - data.level.value}`);
    }

    data.properties = props.filter(p => p !== null);
    const traits = [];

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].substr(1),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || ""
        };
        traits.push(traitsObject);
      }
    }

    data.traits = traits.filter(p => p);
    return data;
  },

  /* -------------------------------------------- */
  featChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data)); // Feat properties

    const props = [`Level ${data.level.value || 0}`, data.actionType.value ? PF2E.actionTypes[data.actionType.value] : null]; // if (traits.length != 0) props = props.concat(traits);

    data.properties = props.filter(p => p);
    const traits = [];

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.featTraits[data.traits.value[i]] || data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || ""
        };
        traits.push(traitsObject);
      }
    }

    data.traits = traits.filter(p => p);
    return data;
  },

  /* -------------------------------------------- */
  actionChatData(item, actorData) {
    const data = JSON.parse(JSON.stringify(item.data));
    let associatedWeapon = null;
    if (data.weapon.value) associatedWeapon = actorData.items.find(item => item._id === data.weapon.value); // Feat properties

    const props = [PF2E.actionTypes[data.actionType.value], associatedWeapon ? associatedWeapon.name : null]; // if (traits.length != 0) props = props.concat(traits);

    data.properties = props.filter(p => p);
    const traits = [];

    if ((data.traits.value || []).length !== 0) {
      for (let i = 0; i < data.traits.value.length; i++) {
        const traitsObject = {
          label: PF2E.featTraits[data.traits.value[i]] || data.traits.value[i].charAt(0).toUpperCase() + data.traits.value[i].slice(1),
          description: PF2E.traitsDescriptions[data.traits.value[i]] || ""
        };
        traits.push(traitsObject);
      }
    }

    data.traits = traits.filter(p => p);
    return data;
  },

  /* -------------------------------------------- */
  conditionChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.properties = [];
    return data;
  },

  /* -------------------------------------------- */
  effectChatData(item) {
    const data = JSON.parse(JSON.stringify(item.data));
    data.properties = [];
    return data;
  }

};
/* -------------------------------------------- */

function getArmorBonus(itemData) {
  var _toNumber, _itemData$potencyRune, _toNumber2;

  const potencyRune = (_toNumber = toNumber(itemData === null || itemData === void 0 ? void 0 : (_itemData$potencyRune = itemData.potencyRune) === null || _itemData$potencyRune === void 0 ? void 0 : _itemData$potencyRune.value)) !== null && _toNumber !== void 0 ? _toNumber : 0;
  const baseArmor = (_toNumber2 = toNumber(itemData.armor.value)) !== null && _toNumber2 !== void 0 ? _toNumber2 : 0;
  return baseArmor + potencyRune;
}
/* -------------------------------------------- */


function getAttackBonus(itemData) {
  var _itemData$group, _toNumber4, _itemData$potencyRune2;

  if (((_itemData$group = itemData.group) === null || _itemData$group === void 0 ? void 0 : _itemData$group.value) === "bomb") {
    var _toNumber3, _itemData$bonus;

    return (_toNumber3 = toNumber(itemData === null || itemData === void 0 ? void 0 : (_itemData$bonus = itemData.bonus) === null || _itemData$bonus === void 0 ? void 0 : _itemData$bonus.value)) !== null && _toNumber3 !== void 0 ? _toNumber3 : 0;
  }

  return (_toNumber4 = toNumber(itemData === null || itemData === void 0 ? void 0 : (_itemData$potencyRune2 = itemData.potencyRune) === null || _itemData$potencyRune2 === void 0 ? void 0 : _itemData$potencyRune2.value)) !== null && _toNumber4 !== void 0 ? _toNumber4 : 0;
}
/* -------------------------------------------- */


function calculateMap(item) {
  if (item.type === "weapon") {
    // calculate multiple attack penalty tiers
    const agile = (item.data.traits.value || []).includes("agile");
    const alternateMAP = (item.data.MAP || {}).value;

    switch (alternateMAP) {
      case "1":
        return {
          map2: -1,
          map3: -2
        };

      case "2":
        return {
          map2: -2,
          map3: -4
        };

      case "3":
        return {
          map2: -3,
          map3: -6
        };

      case "4":
        return {
          map2: -4,
          map3: -8
        };

      case "5":
        return {
          map2: -5,
          map3: -10
        };

      default:
        {
          if (agile) return {
            map2: -4,
            map3: -8
          };else return {
            map2: -5,
            map3: -10
          };
        }
    }
  }

  return {
    map2: -5,
    map3: -10
  };
}
/* -------------------------------------------- */


function addSign(number) {
  if (number < 0) {
    return `${number}`;
  }

  if (number > 0) {
    return `+${number}`;
  }

  return "0";
}
/* -------------------------------------------- */


function toNumber(value) {
  if (value === null || value === undefined || typeof value === "number") {
    return value;
  }

  const result = parseInt(value, 10);

  if (Number.isNaN(result)) {
    return undefined;
  }

  return result;
}
// CONCATENATED MODULE: ./src/populatesheet.js









TextEditor["default"]._decoder = document.createElement("textarea");
const tabs = [{
  navSelector: ".sheet-navigation",
  contentSelector: ".sheet-content",
  initial: "character"
}];

const _tabs = createTabHandlers();
/**
 * @param  {HandlebarsTemplatable} sheetTemplate
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */


function populateSheet(sheetTemplate, actorData, baseUrl) {
  var _data$actorData$flags, _data$actorData$flags2;

  initModifiers(actorData);
  const data = getData(actorData, baseUrl);
  const templateObject = {
    actor: data.actorData,
    data: data.actorData.data,
    items: data.actorData.items,
    isCharacter: data.actorData.data.type === "character",
    isNPC: data.actorData.data.type === "npc",
    hasStamina: ((_data$actorData$flags = data.actorData.flags) === null || _data$actorData$flags === void 0 ? void 0 : (_data$actorData$flags2 = _data$actorData$flags.externalactor) === null || _data$actorData$flags2 === void 0 ? void 0 : _data$actorData$flags2.hasStamina) || false,
    totalTreasure: data.actorData.totalTreasure,
    pfsFactions: PF2E.pfsFactions,
    owner: true,
    baseUrl: baseUrl
  };
  console.log(templateObject);
  $(".window-content")[0].innerHTML = sheetTemplate(templateObject, {
    allowedProtoProperties: {
      size: true,
      isCollapsed: true,
      isOverLoaded: true,
      fullPercentageMax100: true,
      isEncumbered: true,
      isOverLimit: true,
      limitPercentageMax100: true,
      bulk: true
    }
  });
  activateListeners(actorData);
}
/* -------------------------------------------- */

/**
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */


function getData(actorData, baseUrl) {
  var _actorData$data$detai, _actorData$data$detai2, _actorData$data$trait, _actorData$data$trait2, _actorData$data$detai3, _actorData$data$detai4, _actorData$data$attri, _actorData$data$attri2, _actorData$data$attri3, _actorData$data$attri4, _actorData$data, _actorData$data2;

  let items = actorData.items;
  items.sort((a, b) => (a.sort || 0) - (b.sort || 0)); // alignment translate

  if ((_actorData$data$detai = actorData.data.details) !== null && _actorData$data$detai !== void 0 && (_actorData$data$detai2 = _actorData$data$detai.alignment) !== null && _actorData$data$detai2 !== void 0 && _actorData$data$detai2.value) {
    actorData.data.details.alignment.value = PF2E.alignment[actorData.data.details.alignment.value];
  } // size translate


  if ((_actorData$data$trait = actorData.data.traits) !== null && _actorData$data$trait !== void 0 && (_actorData$data$trait2 = _actorData$data$trait.size) !== null && _actorData$data$trait2 !== void 0 && _actorData$data$trait2.value) {
    actorData.data.traits.size.value = PF2E.actorSizes[actorData.data.traits.size.value];
  } // key ability translate


  if ((_actorData$data$detai3 = actorData.data.details) !== null && _actorData$data$detai3 !== void 0 && (_actorData$data$detai4 = _actorData$data$detai3.keyability) !== null && _actorData$data$detai4 !== void 0 && _actorData$data$detai4.value) {
    actorData.data.details.keyability.value = PF2E.abilities[actorData.data.details.keyability.value];
  } // ability labels


  Object.keys(actorData.data.abilities).forEach(key => {
    actorData.data.abilities[key].label = PF2E.abilities[key];
  }); // saves

  Object.keys(actorData.data.saves).forEach(key => {
    actorData.data.saves[key].label = PF2E.saves[key];
    actorData.data.saves[key].rankName = PF2E.proficiencyLevels[actorData.data.saves[key].rank];
  }); // heroPoints

  if (actorData.data.attributes.heroPoints) {
    actorData.data.attributes.heroPoints.icon = getHeroPointsIcon(actorData.data.attributes.heroPoints.rank);
    actorData.data.attributes.heroPoints.hover = PF2E.heroPointLevels[actorData.data.attributes.heroPoints.rank];
  } // dying


  if (actorData.data.attributes.dying) {
    actorData.data.attributes.dying.containerWidth = `width: ${actorData.data.attributes.dying.max * 13}px;`;
    actorData.data.attributes.dying.icon = getDyingIcon(actorData.data.attributes.dying.value, actorData);
  } // wounded


  if (actorData.data.attributes.wounded) {
    actorData.data.attributes.wounded.icon = getWoundedIcon(actorData.data.attributes.wounded.value, actorData);
    actorData.data.attributes.wounded.max = actorData.data.attributes.dying.max - 1;
  } // doomed


  if (actorData.data.attributes.doomed) {
    actorData.data.attributes.doomed.icon = getDoomedIcon(actorData.data.attributes.doomed.value, actorData);
    actorData.data.attributes.doomed.max = actorData.data.attributes.dying.max - 1;
  } // perception text


  if ((_actorData$data$attri = actorData.data.attributes) !== null && _actorData$data$attri !== void 0 && (_actorData$data$attri2 = _actorData$data$attri.perception) !== null && _actorData$data$attri2 !== void 0 && _actorData$data$attri2.rank) {
    actorData.data.attributes.perception.rankName = PF2E.proficiencyLevels[actorData.data.attributes.perception.rank];
  } // class dc text


  if ((_actorData$data$attri3 = actorData.data.attributes) !== null && _actorData$data$attri3 !== void 0 && (_actorData$data$attri4 = _actorData$data$attri3.classDC) !== null && _actorData$data$attri4 !== void 0 && _actorData$data$attri4.rank) {
    actorData.data.attributes.classDC.rankName = PF2E.proficiencyLevels[actorData.data.attributes.classDC.rank];
  } // martial skills


  if ((_actorData$data = actorData.data) !== null && _actorData$data !== void 0 && _actorData$data.martial) {
    for (const [s, skl] of Object.entries(actorData.data.martial)) {
      skl.icon = getProficiencyIcon(skl.rank);
      skl.hover = PF2E.proficiencyLevels[skl.rank];
      skl.label = PF2E.martialSkills[s];
      skl.value = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, skl.rank || 0).modifier;
    }
  } // skill labels


  if ((_actorData$data2 = actorData.data) !== null && _actorData$data2 !== void 0 && _actorData$data2.skills) {
    for (const [s, skl] of Object.entries(actorData.data.skills)) {
      var _skl$label;

      skl.icon = getProficiencyIcon(skl.rank);
      skl.hover = PF2E.proficiencyLevels[skl.rank];
      skl.label = (_skl$label = skl.label) !== null && _skl$label !== void 0 ? _skl$label : PF2E.skills[s];
    }
  }

  prepareItems(actorData); // currency based on items

  if (actorData.items) {
    const treasure = calculateWealth(actorData.items);
    actorData.totalTreasure = {};

    for (const [denomination, value] of Object.entries(treasure)) {
      actorData.totalTreasure[denomination] = {
        value,
        label: PF2E.currencies[denomination]
      };
    }
  } // traits


  prepareTraits(actorData.data.traits);
  actorData.data.effects = {};
  actorData.data.effects.conditions = ConditionManager.getFlattenedConditions(actorData.items.filter(i => {
    var _i$flags$pf2e;

    return ((_i$flags$pf2e = i.flags.pf2e) === null || _i$flags$pf2e === void 0 ? void 0 : _i$flags$pf2e.condition) && i.type === "condition";
  }));
  return {
    actorData,
    items
  };
}
/* -------------------------------------------- */


function activateListeners(actorData) {
  // sheet object
  const html = $(".window-content").first(); // bind tabs to pages

  _tabs.forEach(t => t.bind(html[0]));

  {
    // ensure correct tab name is displayed after actor update
    const title = $(".sheet-navigation .active").data("tabTitle");

    if (title) {
      html.find(".navigation-title").text(title);
    }
  }
  html.find(".sheet-navigation").on("mouseover", ".item", event => {
    const title = event.currentTarget.dataset.tabTitle;

    if (title) {
      $(event.currentTarget).parents(".sheet-navigation").find(".navigation-title").text(title);
    }
  });
  html.find(".sheet-navigation").on("mouseout", ".item", event => {
    const parent = $(event.currentTarget).parents(".sheet-navigation");
    const title = parent.find(".item.active").data("tabTitle");

    if (title) {
      parent.find(".navigation-title").text(title);
    }
  }); // item summary

  html.find(".item .item-name h4").click(event => {
    onItemSummary(event, actorData);
  }); // strike summary

  html.find(".strikes-list [data-action-index]").on("click", ".action-name", event => {
    $(event.currentTarget).parents(".expandable").toggleClass("expanded");
  }); // handle sub-tab navigation on the actions tab

  html.find(".actions-nav").on("click", ".tab:not(.tab-active)", event => {
    const target = $(event.currentTarget);
    const nav = target.parents(".actions-nav"); // deselect current tab and panel

    nav.children(".tab-active").removeClass("tab-active");
    nav.siblings(".actions-panels").children(".actions-panel.active").removeClass("active"); // select new tab and panel

    target.addClass("tab-active");
    nav.siblings(".actions-panels").children(`#${target.data("panel")}`).addClass("active");
  }); // Pad field width

  html.find("[data-wpad]").each((i, e) => {
    const text = e.tagName === "INPUT" ? e.value : e.innerText;
    const w = text.length * parseInt(e.getAttribute("data-wpad"), 10) / 2;
    e.setAttribute("style", `flex: 0 0 ${w}px`);
  }); // modifier tooltip

  html.find(".hover").tooltipster({
    animation: "fade",
    delay: 200,
    trigger: "click",
    arrow: false,
    contentAsHTML: true,
    debug: true,
    interactive: true,
    side: ["right", "bottom"],
    theme: "crb-hover",
    minWidth: 120
  });
}
/* -------------------------------------------- */

/*   Helper Functions                           */

/* -------------------------------------------- */


function createTabHandlers() {
  return tabs.map(t => {
    return new Tabs(t);
  });
}
/* -------------------------------------------- */


function prepareTraits(traits) {
  if (traits === undefined) return;
  const map = {
    languages: PF2E.languages,
    dr: PF2E.resistanceTypes,
    di: PF2E.immunityTypes,
    dv: PF2E.weaknessTypes,
    ci: PF2E.immunityTypes,
    traits: PF2E.monsterTraits
  };

  for (const [t, choices] of Object.entries(map)) {
    const trait = traits[t] || {
      value: [],
      selected: []
    };

    if (Array.isArray(trait)) {
      trait.selected = {};

      for (const entry of trait) {
        if (typeof entry === "object") {
          if ("exceptions" in entry && entry.exceptions !== "") {
            trait.selected[entry.type] = `${choices[entry.type]} (${entry.value}) [${entry.exceptions}]`;
          } else {
            let text = `${choices[entry.type]}`;
            if (entry.value !== "") text = `${text} (${entry.value})`;
            trait.selected[entry.type] = text;
          }
        } else {
          trait.selected[entry] = choices[entry] || `${entry}`;
        }
      }
    } else if (trait.value) {
      trait.selected = Object.fromEntries(trait.value.map(name => [name, name]));
    } // Add custom entry


    if (trait.custom) trait.selected.custom = trait.custom;
  }
}
/* -------------------------------------------- */


function prepareItems(actorData) {
  var _actorData$flags, _actorData$flags$exte, _actorData$flags2, _actorData$flags2$ext, _actorData$data$attri5, _actorData$data$attri6, _actorData$data$trait3, _actorData$data3, _actorData$data3$trai, _actorData$data3$trai2;

  // Inventory
  const inventory = {
    weapon: {
      label: stringify_default()("PF2E.InventoryWeaponsHeader"),
      items: []
    },
    armor: {
      label: stringify_default()("PF2E.InventoryArmorHeader"),
      items: []
    },
    equipment: {
      label: stringify_default()("PF2E.InventoryEquipmentHeader"),
      items: [],
      investedItemCount: 0
    },
    consumable: {
      label: stringify_default()("PF2E.InventoryConsumablesHeader"),
      items: []
    },
    treasure: {
      label: stringify_default()("PF2E.InventoryTreasureHeader"),
      items: []
    },
    backpack: {
      label: stringify_default()("PF2E.InventoryBackpackHeader"),
      items: []
    }
  }; // Spellbook

  const tempSpellbook = [];
  const spellcastingEntriesList = [];
  const spellbooks = [];
  spellbooks.unassigned = {}; // Spellcasting Entries

  const spellcastingEntries = []; // Feats

  const feats = {
    ancestry: {
      label: "PF2E.FeatAncestryHeader",
      feats: []
    },
    ancestryfeature: {
      label: "PF2E.FeaturesAncestryHeader",
      feats: []
    },
    archetype: {
      label: "PF2E.FeatArchetypeHeader",
      feats: []
    },
    bonus: {
      label: "PF2E.FeatBonusHeader",
      feats: []
    },
    class: {
      label: "PF2E.FeatClassHeader",
      feats: []
    },
    classfeature: {
      label: "PF2E.FeaturesClassHeader",
      feats: []
    },
    skill: {
      label: "PF2E.FeatSkillHeader",
      feats: []
    },
    general: {
      label: "PF2E.FeatGeneralHeader",
      feats: []
    },
    pfsboon: {
      label: "PF2E.FeatPFSBoonHeader",
      feats: []
    },
    deityboon: {
      label: "PF2E.FeatDeityBoonHeader",
      feats: []
    },
    curse: {
      label: "PF2E.FeatCurseHeader",
      feats: []
    }
  }; // Actions

  const actions = {
    action: {
      label: stringify_default()("PF2E.ActionsActionsHeader"),
      actions: []
    },
    reaction: {
      label: stringify_default()("PF2E.ActionsReactionsHeader"),
      actions: []
    },
    free: {
      label: stringify_default()("PF2E.ActionsFreeActionsHeader"),
      actions: []
    }
  }; // Read-Only Actions

  const readonlyActions = {
    interaction: {
      label: "Interaction Actions",
      actions: []
    },
    defensive: {
      label: "Defensive Actions",
      actions: []
    },
    offensive: {
      label: "Offensive Actions",
      actions: []
    }
  };
  const readonlyEquipment = [];
  const attacks = {
    weapon: {
      label: "Compendium Weapon",
      items: [],
      type: "weapon"
    }
  }; // Skills

  const lores = [];
  const martialSkills = []; // Iterate through items, allocating to containers

  const bulkConfig = {
    ignoreCoinBulk: ((_actorData$flags = actorData.flags) === null || _actorData$flags === void 0 ? void 0 : (_actorData$flags$exte = _actorData$flags.externalactor) === null || _actorData$flags$exte === void 0 ? void 0 : _actorData$flags$exte.ignoreCoinBulk) || defaultBulkConfig.ignoreCoinBulk,
    ignoreContainerOverflow: ((_actorData$flags2 = actorData.flags) === null || _actorData$flags2 === void 0 ? void 0 : (_actorData$flags2$ext = _actorData$flags2.externalactor) === null || _actorData$flags2$ext === void 0 ? void 0 : _actorData$flags2$ext.ignoreContainerOverflow) || defaultBulkConfig.ignoreContainerOverflow
  };
  const bulkItems = itemsFromActorData(actorData);
  const indexedBulkItems = indexBulkItemsById(bulkItems);
  const containers = getContainerMap(actorData.items, indexedBulkItems, stacks, bulkConfig);
  let investedCount = 0; // Tracking invested items

  for (const i of actorData.items) {
    var _i$data$equipped$valu, _i$data, _i$data$equipped, _i$data2, _i$data2$stackGroup, _i$data$traits$value$, _i$data3, _i$data3$traits, _i$data3$traits$value, _i$data$invested$valu, _i$data4, _i$data4$invested;

    i.img = i.img || "icons/svg/mystery-man.svg";
    i.containerData = containers.get(i._id);
    i.isContainer = i.containerData.isContainer;
    i.isNotInContainer = i.containerData.isNotInContainer; // Read-Only Equipment

    if (i.type === "armor" || i.type === "equipment" || i.type === "consumable" || i.type === "backpack") {
      readonlyEquipment.push(i);
      actorData.hasEquipment = true;
    }

    i.canBeEquipped = i.isNotInContainer;
    i.isEquipped = (_i$data$equipped$valu = (_i$data = i.data) === null || _i$data === void 0 ? void 0 : (_i$data$equipped = _i$data.equipped) === null || _i$data$equipped === void 0 ? void 0 : _i$data$equipped.value) !== null && _i$data$equipped$valu !== void 0 ? _i$data$equipped$valu : false;
    i.isSellableTreasure = i.type === "treasure" && ((_i$data2 = i.data) === null || _i$data2 === void 0 ? void 0 : (_i$data2$stackGroup = _i$data2.stackGroup) === null || _i$data2$stackGroup === void 0 ? void 0 : _i$data2$stackGroup.value) !== "coins";
    i.hasInvestedTrait = (_i$data$traits$value$ = (_i$data3 = i.data) === null || _i$data3 === void 0 ? void 0 : (_i$data3$traits = _i$data3.traits) === null || _i$data3$traits === void 0 ? void 0 : (_i$data3$traits$value = _i$data3$traits.value) === null || _i$data3$traits$value === void 0 ? void 0 : _i$data3$traits$value.includes("invested")) !== null && _i$data$traits$value$ !== void 0 ? _i$data$traits$value$ : false;
    i.isInvested = (_i$data$invested$valu = (_i$data4 = i.data) === null || _i$data4 === void 0 ? void 0 : (_i$data4$invested = _i$data4.invested) === null || _i$data4$invested === void 0 ? void 0 : _i$data4$invested.value) !== null && _i$data$invested$valu !== void 0 ? _i$data$invested$valu : false;

    if (i.isInvested) {
      investedCount += 1;
    } // Inventory


    if (Object.keys(inventory).includes(i.type)) {
      i.data.quantity.value = i.data.quantity.value || 0;
      i.data.weight.value = i.data.weight.value || 0;
      const [approximatedBulk] = calculateBulk([indexedBulkItems.get(i._id)], stacks, false, bulkConfig);
      i.totalWeight = formatBulk(approximatedBulk);
      i.hasCharges = i.type === "consumable" && i.data.charges.max > 0;
      i.isTwoHanded = i.type === "weapon" && !!(i.data.traits.value || []).find(x => x.startsWith("two-hand"));
      i.wieldedTwoHanded = i.type === "weapon" && (i.data.hands || {}).value;

      if (i.type === "weapon") {
        attacks.weapon.items.push(i);
      }

      inventory[i.type].items.push(i);
    } // Spells
    else if (i.type === "spell") {
        let item;

        try {
          item = actorData.items.find(item => item._id === i._id);
          i.spellInfo = getSpellInfo(item, actorData);
        } catch (err) {
          console.log(`PF2e System | Character Sheet | Could not load item ${i.name}`);
        }

        tempSpellbook.push(i);
      } // Spellcasting Entries
      else if (i.type === "spellcastingEntry") {
          var _i$data$proficiency;

          // collect list of entries to use later to match spells against.
          spellcastingEntriesList.push(i._id);
          const spellRank = ((_i$data$proficiency = i.data.proficiency) === null || _i$data$proficiency === void 0 ? void 0 : _i$data$proficiency.value) || 0;
          const spellProficiency = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, spellRank).modifier;
          const spellAbl = i.data.ability.value || "int";
          i.data.spelldc.mod = actorData.data.abilities[spellAbl].mod;
          i.data.spelldc.breakdown = `10 + ${spellAbl} modifier(${actorData.data.abilities[spellAbl].mod}) + proficiency(${spellProficiency}) + item bonus(${i.data.item.value})`;
          i.data.spelldc.icon = getProficiencyIcon(i.data.proficiency.value);
          i.data.spelldc.hover = PF2E.proficiencyLevels[i.data.proficiency.value];
          i.data.tradition.title = PF2E.magicTraditions[i.data.tradition.value];
          i.data.prepared.title = PF2E.preparationType[i.data.prepared.value]; // Check if prepared spellcasting type and set Boolean

          if ((i.data.prepared || {}).value === "prepared") i.data.prepared.preparedSpells = true;else i.data.prepared.preparedSpells = false; // Check if Ritual spellcasting tradition and set Boolean

          if ((i.data.tradition || {}).value === "ritual") i.data.tradition.ritual = true;else i.data.tradition.ritual = false;

          if ((i.data.tradition || {}).value === "focus") {
            i.data.tradition.focus = true;
            if (i.data.focus === undefined) i.data.focus = {
              points: 1,
              pool: 1
            };
            i.data.focus.icon = getFocusIcon(i.data.focus);
          } else i.data.tradition.focus = false;

          spellcastingEntries.push(i);
        } // Feats
        else if (i.type === "feat") {
            const featType = i.data.featType.value || "bonus";
            const actionType = i.data.actionType.value || "passive";
            feats[featType].feats.push(i);

            if (Object.keys(actions).includes(actionType)) {
              i.feat = true;
              let actionImg = 0;
              if (actionType === "action") actionImg = parseInt((i.data.actions || {}).value, 10) || 1;else if (actionType === "reaction") actionImg = "reaction";else if (actionType === "free") actionImg = "free";
              i.img = getActionImg(actionImg);
              actions[actionType].actions.push(i); // Read-Only Actions

              if (i.data.actionCategory && i.data.actionCategory.value) {
                switch (i.data.actionCategory.value) {
                  case "interaction":
                    readonlyActions.interaction.actions.push(i);
                    actorData.hasInteractionActions = true;
                    break;

                  case "defensive":
                    readonlyActions.defensive.actions.push(i);
                    actorData.hasDefensiveActions = true;
                    break;
                  // Should be offensive but throw anything else in there too

                  default:
                    readonlyActions.offensive.actions.push(i);
                    actorData.hasOffensiveActions = true;
                }
              } else {
                readonlyActions.offensive.actions.push(i);
                actorData.hasOffensiveActions = true;
              }
            }
          } // Lore Skills
          else if (i.type === "lore") {
              var _i$data$proficient;

              i.data.icon = getProficiencyIcon((i.data.proficient || {}).value);
              i.data.hover = PF2E.proficiencyLevels[(i.data.proficient || {}).value];
              const rank = ((_i$data$proficient = i.data.proficient) === null || _i$data$proficient === void 0 ? void 0 : _i$data$proficient.value) || 0;
              const proficiency = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, rank).modifier;
              const modifier = actorData.data.abilities.int.mod;
              const itemBonus = Number((i.data.item || {}).value || 0);
              i.data.itemBonus = itemBonus;
              i.data.value = modifier + proficiency + itemBonus;
              i.data.breakdown = `int modifier(${modifier}) + proficiency(${proficiency}) + item bonus(${itemBonus})`;
              lores.push(i);
            } // Martial Skills
            else if (i.type === "martial") {
                var _i$data$proficient2;

                i.data.icon = getProficiencyIcon((i.data.proficient || {}).value);
                i.data.hover = PF2E.proficiencyLevels[(i.data.proficient || {}).value];
                const rank = ((_i$data$proficient2 = i.data.proficient) === null || _i$data$proficient2 === void 0 ? void 0 : _i$data$proficient2.value) || 0;
                const proficiency = ProficiencyModifier.fromLevelAndRank(actorData.data.details.level.value, rank).modifier;
                i.data.value = proficiency;
                i.data.breakdown = `proficiency(${proficiency})`;
                martialSkills.push(i);
              } // Actions


    if (i.type === "action") {
      const actionType = i.data.actionType.value || "action";
      let actionImg = 0;
      if (actionType === "action") actionImg = parseInt(i.data.actions.value, 10) || 1;else if (actionType === "reaction") actionImg = "reaction";else if (actionType === "free") actionImg = "free";else if (actionType === "passive") actionImg = "passive";
      i.img = getActionImg(actionImg);
      if (actionType === "passive") actions.free.actions.push(i);else actions[actionType].actions.push(i); // Read-Only Actions

      if (i.data.actionCategory && i.data.actionCategory.value) {
        switch (i.data.actionCategory.value) {
          case "interaction":
            readonlyActions.interaction.actions.push(i);
            actorData.hasInteractionActions = true;
            break;

          case "defensive":
            readonlyActions.defensive.actions.push(i);
            actorData.hasDefensiveActions = true;
            break;

          case "offensive":
            readonlyActions.offensive.actions.push(i);
            actorData.hasOffensiveActions = true;
            break;
          // Should be offensive but throw anything else in there too

          default:
            readonlyActions.offensive.actions.push(i);
            actorData.hasOffensiveActions = true;
        }
      } else {
        readonlyActions.offensive.actions.push(i);
        actorData.hasOffensiveActions = true;
      }
    }
  }

  inventory.equipment.investedItemCount = investedCount; // Tracking invested items

  const embeddedEntityUpdate = []; // Iterate through all spells in the temp spellbook and check that they are assigned to a valid spellcasting entry. If not place in unassigned.

  for (const i of tempSpellbook) {
    // check if the spell has a valid spellcasting entry assigned to the location value.
    if (spellcastingEntriesList.includes(i.data.location.value)) {
      const location = i.data.location.value;
      spellbooks[location] = spellbooks[location] || {};
      prepareSpell(actorData, spellbooks[location], i);
    } else if (spellcastingEntriesList.length === 1) {
      // if not BUT their is only one spellcasting entry then assign the spell to this entry.
      const location = spellcastingEntriesList[0];
      spellbooks[location] = spellbooks[location] || {}; // Update spell to perminantly have the correct ID now

      embeddedEntityUpdate.push({
        _id: i._id,
        "data.location.value": spellcastingEntriesList[0]
      });
      prepareSpell(actorData, spellbooks[location], i);
    } else {
      // else throw it in the orphaned list.
      prepareSpell(actorData, spellbooks.unassigned, i);
    }
  } // assign mode to actions


  Object.values(actions).flatMap(section => section.actions).forEach(action => {
    action.downtime = action.data.traits.value.includes("downtime");
    action.exploration = action.data.traits.value.includes("exploration");
    action.encounter = !(action.downtime || action.exploration);
  }); // Assign and return

  actorData.inventory = inventory; // Any spells found that don't belong to a spellcasting entry are added to a "orphaned spells" spell book (allowing the player to fix where they should go)

  if (Object.keys(spellbooks.unassigned).length) {
    actorData.orphanedSpells = true;
    actorData.orphanedSpellbook = spellbooks.unassigned;
  }

  actorData.feats = feats;
  actorData.attacks = attacks;
  actorData.actions = actions;
  actorData.readonlyActions = readonlyActions;
  actorData.readonlyEquipment = readonlyEquipment;
  actorData.lores = lores;
  actorData.martialSkills = martialSkills;

  for (const entry of spellcastingEntries) {
    if (entry.data.prepared.preparedSpells && spellbooks[entry._id]) {
      preparedSpellSlots(entry, spellbooks[entry._id], actorData);
    }

    entry.spellbook = spellbooks[entry._id];
  }

  actorData.spellcastingEntries = spellcastingEntries; // shield

  const equippedShield = getEquippedShield(actorData.items);

  if (equippedShield === undefined) {
    actorData.data.attributes.shield = {
      hp: {
        value: 0
      },
      maxHp: {
        value: 0
      },
      armor: {
        value: 0
      },
      hardness: {
        value: 0
      },
      brokenThreshold: {
        value: 0
      }
    };
    actorData.data.attributes.shieldBroken = false;
  } else {
    var _equippedShield$data, _equippedShield$data$, _equippedShield$data2, _equippedShield$data3;

    actorData.data.attributes.shield = JSON.parse(JSON.stringify(equippedShield.data));
    actorData.data.attributes.shieldBroken = (equippedShield === null || equippedShield === void 0 ? void 0 : (_equippedShield$data = equippedShield.data) === null || _equippedShield$data === void 0 ? void 0 : (_equippedShield$data$ = _equippedShield$data.hp) === null || _equippedShield$data$ === void 0 ? void 0 : _equippedShield$data$.value) <= (equippedShield === null || equippedShield === void 0 ? void 0 : (_equippedShield$data2 = equippedShield.data) === null || _equippedShield$data2 === void 0 ? void 0 : (_equippedShield$data3 = _equippedShield$data2.brokenThreshold) === null || _equippedShield$data3 === void 0 ? void 0 : _equippedShield$data3.value);
  } // Inventory encumbrance
  // FIXME: this is hard coded for now


  const featNames = new Set(actorData.items.filter(item => item.type === "feat").map(item => item.name));
  let bonusEncumbranceBulk = (_actorData$data$attri5 = actorData.data.attributes.bonusEncumbranceBulk) !== null && _actorData$data$attri5 !== void 0 ? _actorData$data$attri5 : 0;
  let bonusLimitBulk = (_actorData$data$attri6 = actorData.data.attributes.bonusLimitBulk) !== null && _actorData$data$attri6 !== void 0 ? _actorData$data$attri6 : 0;

  if (featNames.has("Hefty Hauler")) {
    bonusEncumbranceBulk += 2;
    bonusLimitBulk += 2;
  }

  const equippedLiftingBelt = actorData.items.find(item => item.name === "Lifting Belt" && item.data.equipped.value) !== undefined;

  if (equippedLiftingBelt) {
    bonusEncumbranceBulk += 1;
    bonusLimitBulk += 1;
  }

  const [bulk] = calculateBulk(bulkItems, stacks, false, bulkConfig);
  actorData.data.attributes.encumbrance = calculateEncumbrance(actorData.data.abilities.str.mod, bonusEncumbranceBulk, bonusLimitBulk, bulk, (_actorData$data$trait3 = (_actorData$data3 = actorData.data) === null || _actorData$data3 === void 0 ? void 0 : (_actorData$data3$trai = _actorData$data3.traits) === null || _actorData$data3$trai === void 0 ? void 0 : (_actorData$data3$trai2 = _actorData$data3$trai.size) === null || _actorData$data3$trai2 === void 0 ? void 0 : _actorData$data3$trai2.value) !== null && _actorData$data$trait3 !== void 0 ? _actorData$data$trait3 : "Medium");
}
/* -------------------------------------------- */


function getActionImg(action) {
  const img = {
    0: "icons/svg/mystery-man.svg",
    1: "systems/pf2e/icons/actions/OneAction.png",
    2: "systems/pf2e/icons/actions/TwoActions.png",
    3: "systems/pf2e/icons/actions/ThreeActions.png",
    free: "systems/pf2e/icons/actions/FreeAction.png",
    reaction: "systems/pf2e/icons/actions/Reaction.png",
    passive: "systems/pf2e/icons/actions/Passive.png"
  };
  return img[action];
}
/* -------------------------------------------- */


function getProficiencyIcon(level) {
  const icons = {
    0: "",
    1: '<i class="fas fa-check-circle"></i>',
    2: '<i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i>',
    3: '<i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i>',
    4: '<i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i><i class="fas fa-check-circle"></i>'
  };
  return icons[level];
}
/* -------------------------------------------- */


function getEquippedShield(items) {
  return items.find(item => item.type === "armor" && item.data.equipped.value && item.data.armorType.value === "shield");
}
/* -------------------------------------------- */


function getHeroPointsIcon(level) {
  const icons = {
    0: '<i class="far fa-circle"></i><i class="far fa-circle"></i><i class="far fa-circle"></i>',
    1: '<i class="fas fa-hospital-symbol"></i><i class="far fa-circle"></i><i class="far fa-circle"></i>',
    2: '<i class="fas fa-hospital-symbol"></i><i class="fas fa-hospital-symbol"></i><i class="far fa-circle"></i>',
    3: '<i class="fas fa-hospital-symbol"></i><i class="fas fa-hospital-symbol"></i><i class="fas fa-hospital-symbol"></i>'
  };
  return icons[level];
}
/* -------------------------------------------- */


function getDyingIcon(level, actorData) {
  const maxDying = actorData.data.attributes.dying.max || 4;
  const doomed = actorData.data.attributes.doomed.value || 0;
  const circle = '<i class="far fa-circle"></i>';
  const cross = '<i class="fas fa-times-circle"></i>';
  const skull = '<i class="fas fa-skull"></i>';
  const redOpen = "<span>";
  const redClose = "</span>";
  const icons = {};

  for (let dyingLevel = 0; dyingLevel <= maxDying; dyingLevel++) {
    icons[dyingLevel] = dyingLevel === maxDying ? redOpen : "";

    for (let column = 1; column <= maxDying; column++) {
      if (column >= maxDying - doomed || dyingLevel === maxDying) {
        icons[dyingLevel] += skull;
      } else if (dyingLevel < column) {
        icons[dyingLevel] += circle;
      } else {
        icons[dyingLevel] += cross;
      }
    }

    icons[dyingLevel] += dyingLevel === maxDying ? redClose : "";
  }

  return icons[level];
}
/* -------------------------------------------- */


function getWoundedIcon(level, actorData) {
  const maxDying = actorData.data.attributes.dying.max || 4;
  const icons = {};
  const usedPoint = '<i class="fas fa-dot-circle"></i>';
  const unUsedPoint = '<i class="far fa-circle"></i>';

  for (let i = 0; i < maxDying; i++) {
    let iconHtml = "";

    for (let iconColumn = 1; iconColumn < maxDying; iconColumn++) {
      iconHtml += iconColumn <= i ? usedPoint : unUsedPoint;
    }

    icons[i] = iconHtml;
  }

  return icons[level];
}
/* -------------------------------------------- */


function getDoomedIcon(level, actorData) {
  const maxDying = actorData.data.attributes.dying.max || 4;
  const icons = {};
  const usedPoint = '<i class="fas fa-skull"></i>';
  const unUsedPoint = '<i class="far fa-circle"></i>';

  for (let i = 0; i < maxDying; i++) {
    let iconHtml = "";

    for (let iconColumn = 1; iconColumn < maxDying; iconColumn++) {
      iconHtml += iconColumn <= i ? usedPoint : unUsedPoint;
    }

    icons[i] = iconHtml;
  }

  return icons[level];
}
/* -------------------------------------------- */


function calculateWealth(items) {
  return items.filter(item => {
    var _item$data, _item$data$denominati, _item$data2, _item$data2$denominat;

    return item.type === "treasure" && (item === null || item === void 0 ? void 0 : (_item$data = item.data) === null || _item$data === void 0 ? void 0 : (_item$data$denominati = _item$data.denomination) === null || _item$data$denominati === void 0 ? void 0 : _item$data$denominati.value) !== undefined && (item === null || item === void 0 ? void 0 : (_item$data2 = item.data) === null || _item$data2 === void 0 ? void 0 : (_item$data2$denominat = _item$data2.denomination) === null || _item$data2$denominat === void 0 ? void 0 : _item$data2$denominat.value) !== null;
  }).map(item => {
    var _item$data$value$valu, _item$data3, _item$data3$value, _item$data$quantity$v, _item$data4, _item$data4$quantity;

    const value = ((_item$data$value$valu = (_item$data3 = item.data) === null || _item$data3 === void 0 ? void 0 : (_item$data3$value = _item$data3.value) === null || _item$data3$value === void 0 ? void 0 : _item$data3$value.value) !== null && _item$data$value$valu !== void 0 ? _item$data$value$valu : 1) * ((_item$data$quantity$v = (_item$data4 = item.data) === null || _item$data4 === void 0 ? void 0 : (_item$data4$quantity = _item$data4.quantity) === null || _item$data4$quantity === void 0 ? void 0 : _item$data4$quantity.value) !== null && _item$data$quantity$v !== void 0 ? _item$data$quantity$v : 1);
    return toCoins(item.data.denomination.value, value);
  }).reduce(combineCoins, noCoins());
}
/* -------------------------------------------- */


function toCoins(denomination, value) {
  return {
    pp: denomination === "pp" ? value : 0,
    gp: denomination === "gp" ? value : 0,
    sp: denomination === "sp" ? value : 0,
    cp: denomination === "cp" ? value : 0
  };
}
/* -------------------------------------------- */


function combineCoins(first, second) {
  return {
    pp: first.pp + second.pp,
    gp: first.gp + second.gp,
    sp: first.sp + second.sp,
    cp: first.cp + second.cp
  };
}
/* -------------------------------------------- */


function noCoins() {
  return {
    pp: 0,
    gp: 0,
    sp: 0,
    cp: 0
  };
}
/* -------------------------------------------- */


const getSpellInfo = ChatData.spellChatData;
/* -------------------------------------------- */

function getFocusIcon(focus) {
  const icons = {};
  const usedPoint = '<i class="fas fa-dot-circle"></i>';
  const unUsedPoint = '<i class="far fa-circle"></i>';

  for (let i = 0; i <= focus.pool; i++) {
    // creates focus.pool amount of icon options to be selected in the icons object
    let iconHtml = "";

    for (let iconColumn = 1; iconColumn <= focus.pool; iconColumn++) {
      // creating focus.pool amount of icons
      iconHtml += iconColumn <= i ? usedPoint : unUsedPoint;
    }

    icons[i] = iconHtml;
  }

  return icons[focus.points];
}
/* -------------------------------------------- */


function prepareSpell(actorData, spellbook, spell) {
  var _spellcastingEntry$da, _spellcastingEntry$da2, _spellcastingEntry$da3, _spellcastingEntry$da4, _spellcastingEntry$da5, _spellcastingEntry$da6, _spellcastingEntry$da7, _spellcastingEntry$da8, _Object$entries, _spellcastingEntry$da9, _spellsSlotsWhereThis;

  const spellLvl = Number(spell.data.level.value) < 11 ? Number(spell.data.level.value) : 10;
  let spellcastingEntry = null;

  if ((spell.data.location || {}).value) {
    spellcastingEntry = actorData.items.find(item => item._id === spell.data.location.value) || {};
  } // if the spellcaster entry cannot be found (maybe it was deleted?)


  if (!spellcastingEntry) {
    console.log(`PF2e System | Prepare Spell | Spellcasting entry not found for spell ${spell.name}`);
    return;
  } // This is needed only if we want to prepare the data model only for the levels that a spell is already prepared in setup spellbook levels for all of those to catch case where sheet only has spells of lower level prepared in higher level slot


  const isNotLevelBasedSpellcasting = ((_spellcastingEntry$da = spellcastingEntry.data) === null || _spellcastingEntry$da === void 0 ? void 0 : (_spellcastingEntry$da2 = _spellcastingEntry$da.tradition) === null || _spellcastingEntry$da2 === void 0 ? void 0 : _spellcastingEntry$da2.value) === "wand" || ((_spellcastingEntry$da3 = spellcastingEntry.data) === null || _spellcastingEntry$da3 === void 0 ? void 0 : (_spellcastingEntry$da4 = _spellcastingEntry$da3.tradition) === null || _spellcastingEntry$da4 === void 0 ? void 0 : _spellcastingEntry$da4.value) === "scroll" || ((_spellcastingEntry$da5 = spellcastingEntry.data) === null || _spellcastingEntry$da5 === void 0 ? void 0 : (_spellcastingEntry$da6 = _spellcastingEntry$da5.tradition) === null || _spellcastingEntry$da6 === void 0 ? void 0 : _spellcastingEntry$da6.value) === "ritual" || ((_spellcastingEntry$da7 = spellcastingEntry.data) === null || _spellcastingEntry$da7 === void 0 ? void 0 : (_spellcastingEntry$da8 = _spellcastingEntry$da7.tradition) === null || _spellcastingEntry$da8 === void 0 ? void 0 : _spellcastingEntry$da8.value) === "focus";
  const spellsSlotsWhereThisIsPrepared = (_Object$entries = Object.entries(((_spellcastingEntry$da9 = spellcastingEntry.data) === null || _spellcastingEntry$da9 === void 0 ? void 0 : _spellcastingEntry$da9.slots) || {})) === null || _Object$entries === void 0 ? void 0 : _Object$entries.filter(slotArr => !!Object.values(slotArr[1].prepared).find(slotSpell => (slotSpell === null || slotSpell === void 0 ? void 0 : slotSpell.id) === spell._id));
  const highestSlotPrepared = (_spellsSlotsWhereThis = spellsSlotsWhereThisIsPrepared === null || spellsSlotsWhereThisIsPrepared === void 0 ? void 0 : spellsSlotsWhereThisIsPrepared.map(slot => parseInt(slot[0].match(/slot(\d+)/)[1], 10)).reduce((acc, cur) => cur > acc ? cur : acc, 0)) !== null && _spellsSlotsWhereThis !== void 0 ? _spellsSlotsWhereThis : spellLvl;
  const normalHighestSpellLevel = Math.ceil(actorData.data.details.level.value / 2);
  const maxSpellLevelToShow = Math.min(10, Math.max(spellLvl, highestSlotPrepared, normalHighestSpellLevel)); // Extend the Spellbook level

  for (let i = maxSpellLevelToShow; i >= 0; i--) {
    if (!isNotLevelBasedSpellcasting || i === spellLvl) {
      var _spellcastingEntry$da10, _spellcastingEntry$da11;

      spellbook[i] = spellbook[i] || {
        isCantrip: i === 0,
        isFocus: i === 11,
        label: PF2E.spellLevels[i],
        spells: [],
        prepared: [],
        uses: spellcastingEntry ? parseInt((_spellcastingEntry$da10 = spellcastingEntry.data) === null || _spellcastingEntry$da10 === void 0 ? void 0 : _spellcastingEntry$da10.slots[`slot${i}`].value, 10) || 0 : 0,
        slots: spellcastingEntry ? parseInt((_spellcastingEntry$da11 = spellcastingEntry.data) === null || _spellcastingEntry$da11 === void 0 ? void 0 : _spellcastingEntry$da11.slots[`slot${i}`].max, 10) || 0 : 0,
        displayPrepared: spellcastingEntry && spellcastingEntry.data.displayLevels && spellcastingEntry.data.displayLevels[i] !== undefined ? spellcastingEntry.data.displayLevels[i] : true,
        unpreparedSpellsLabel: spellcastingEntry && spellcastingEntry.data.tradition.value === "arcane" && spellcastingEntry.data.prepared.value === "prepared" ? stringify_default()("PF2E.UnpreparedSpellsLabelArcanePrepared") : stringify_default()("PF2E.UnpreparedSpellsLabel")
      };
    }
  } // Add the spell to the spellbook at the appropriate level


  spell.data.school.str = PF2E.spellSchools[spell.data.school.value]; // Add chat data

  try {
    const item = actorData.items.find(item => item._id === spell._id);

    if (item) {
      spell.spellInfo = getSpellInfo(item, actorData);
    }
  } catch (err) {
    console.log(`PF2e System | Character Sheet | Could not load chat data for spell ${spell.id}`, spell);
  }

  spellbook[spellLvl].spells.push(spell);
}
/* -------------------------------------------- */


function preparedSpellSlots(spellcastingEntry, spellbook, actorData) {
  for (const [key, spl] of Object.entries(spellbook)) {
    if (spl.slots > 0) {
      for (let i = 0; i < spl.slots; i++) {
        const entrySlot = ((spellcastingEntry.data.slots[`slot${key}`] || {}).prepared || {})[i] || null;

        if (entrySlot && entrySlot.id) {
          const item = actorData.items.find(item => item._id === entrySlot.id);

          if (item) {
            const itemCopy = JSON.parse(JSON.stringify(item));

            if (entrySlot.expended) {
              itemCopy.expended = true;
            } else {
              itemCopy.expended = false;
            }

            spl.prepared[i] = itemCopy;

            if (spl.prepared[i]) {
              // enrich data with spell school formatted string
              if (spl.prepared[i].data && spl.prepared[i].data.school && spl.prepared[i].data.school.str) {
                spl.prepared[i].data.school.str = CONFIG.PF2E.spellSchools[spl.prepared[i].data.school.value];
              } // Add chat data


              try {
                spl.prepared[i].spellInfo = getSpellInfo(item, actorData);
              } catch (err) {
                console.log(`PF2e System | Character Sheet | Could not load prepared spell ${entrySlot.id}`, item);
              }

              spl.prepared[i].prepared = true;
            } // prepared spell not found
            else {
                spl.prepared[i] = {
                  name: "Empty Slot (drag spell here)",
                  id: null,
                  prepared: false
                };
              }
          } else {
            // Could not find an item for ID: ${entrySlot.id}. Marking the slot as empty so it can be overwritten.
            spl.prepared[i] = {
              name: "Empty Slot (drag spell here)",
              id: null,
              prepared: false
            };
          }
        } else {
          // if there is no prepared spell for this slot then make it empty.
          spl.prepared[i] = {
            name: "Empty Slot (drag spell here)",
            id: null,
            prepared: false
          };
        }
      }
    }
  }
}
/* -------------------------------------------- */


function onItemSummary(event, actorData) {
  event.preventDefault();
  const li = $(event.currentTarget).parent().parent();
  const itemId = li.attr("data-item-id");
  const itemType = li.attr("data-item-type");
  let item;
  if (itemType === "spellSlot") return;

  try {
    item = actorData.items.find(item => item._id === itemId);
    if (!item.type) return;
  } catch (err) {
    return;
  }

  if (item.type === "spellcastingEntry" || item.type === "condition") return;
  const chatData = getChatData(item, actorData, {
    secrets: actorData.owner
  });
  renderItemSummary(li, chatData);
}
/* -------------------------------------------- */

/**
 * @param {JQuery} li
 */


function renderItemSummary(li, chatData) {
  // Toggle summary
  if (li.hasClass("expanded")) {
    const summary = li.children(".item-summary");
    summary.slideUp(200, () => summary.remove());
  } else {
    const div = $(`<div class="item-summary"><div class="item-description">${chatData.description.value}</div></div>`);
    const props = $('<div class="item-properties tags"></div>');

    if (chatData.properties) {
      chatData.properties.filter(p => typeof p === "string").forEach(p => {
        props.append(`<span class="tag tag_secondary">${stringify_default()(p)}</span>`);
      });
    }

    if (chatData.critSpecialization) props.append(`<span class="tag" title="${stringify_default()(chatData.critSpecialization.description)}" style="background: rgb(69,74,124); color: white;">${stringify_default()(chatData.critSpecialization.label)}</span>`); // append traits (only style the tags if they contain description data)

    if (chatData.traits && chatData.traits.length) {
      chatData.traits.forEach(p => {
        if (p.description) props.append(`<span class="tag tag_alt" title="${stringify_default()(p.description)}">${stringify_default()(p.label)}</span>`);else props.append(`<span class="tag">${stringify_default()(p.label)}</span>`);
      });
    }

    div.append(props);
    li.append(div.hide());
    div.slideDown(200);
  }

  li.toggleClass("expanded");
}
/* -------------------------------------------- */


function getChatData(item, actorData, htmlOptions) {
  const itemType = item.type;
  const data = ChatData[`${itemType}ChatData`](item, actorData);

  if (data) {
    data.description.value = TextEditor["default"].enrichHTML(data.description.value, htmlOptions);
  }

  return data;
}
/* -------------------------------------------- */


Array.fromRange = function (n) {
  return Array.from(new Array(parseInt(n)).keys());
};
/**
 * listens to the hook that tells it to start the population
 */


Hooks.on("showSheet", populateSheet);

/***/ }),

/***/ 61:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TextEditor; });
class TextEditor {
  static decodeHTML(html) {
    const txt = this._decoder;
    txt.innerHTML = html;
    return txt.value;
  }

  static enrichHTML(content, {
    secrets = false,
    entities = true,
    links = true,
    rolls = true,
    rollData = null
  } = {}) {
    const html = document.createElement("div");
    html.innerHTML = String(content);

    if (!secrets) {
      let elements = html.querySelectorAll("section.secret");
      elements.forEach(e => e.parentNode.removeChild(e));
    }

    let updateTextArray = true;
    let text = [];

    if (entities) {
      if (updateTextArray) text = this._getTextNodes(html);
      const entityTypes = CONST.ENTITY_LINK_TYPES.concat("Compendium");
      const rgx = new RegExp(`@(${entityTypes.join("|")})\\[([^\\]]+)\\](?:{([^}]+)})?`, "g");
      updateTextArray = this._replaceTextContent(text, rgx, this._createEntityLink);
    }

    if (links) {
      if (updateTextArray) text = this._getTextNodes(html);
      const rgx = /(https?:\/\/)(www\.)?([^\s<]+)/gi;
      updateTextArray = this._replaceTextContent(text, rgx, this._createHyperlink);
    }

    if (rolls) {
      if (updateTextArray) text = this._getTextNodes(html);
      const rgx = /\[\[(\/[a-zA-Z]+\s)?(.*?)([\]]{2,3})/gi;
      updateTextArray = this._replaceTextContent(text, rgx, (...args) => this._createInlineRoll(...args, rollData));
    }

    return html.innerHTML;
  }

  static _getTextNodes(parent) {
    const text = [];
    const walk = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);

    while (walk.nextNode()) text.push(walk.currentNode);

    return text;
  }

  static _replaceTextContent(text, rgx, func) {
    let replaced = false;

    for (let t of text) {
      const matches = t.textContent.matchAll(rgx);

      for (let match of Array.from(matches).reverse()) {
        const replacement = func(...match);

        if (replacement) {
          this._replaceTextNode(t, match, replacement);

          replaced = true;
        }
      }
    }

    return replaced;
  }

  static _replaceTextNode(text, match, replacement) {
    let target = text;

    if (match.index > 0) {
      target = text.splitText(match.index);
    }

    if (match[0].length < target.length) {
      target.splitText(match[0].length);
    }

    target.replaceWith(replacement);
  }

  static _createEntityLink(match, type, target, name) {
    const data = {
      cls: ["entity-link"],
      icon: null,
      dataset: {},
      name: name || target.replace(/.*\./g, "")
    };
    const a = document.createElement("a");
    a.classList.add(...data.cls);
    a.draggable = true;

    for (let [k, v] of Object.entries(data.dataset)) {
      a.dataset[k] = v;
    }

    a.innerHTML = `<i class="${data.icon}"></i> ${data.name}`;
    return a;
  }

  static _createHyperlink(match) {
    const a = document.createElement("a");
    a.classList.add("hyperlink");
    a.href = match;
    a.target = "_blank";
    a.rel = "nofollow noopener";
    a.textContent = match;
    return a;
  }

  static _createInlineRoll(match, command, formula, closing) {
    const data = {
      cls: ["inline-roll"]
    };
    if (closing.length === 3) formula += "]";
    const a = document.createElement("a");
    a.classList.add(...data.cls);
    a.innerHTML = `<i class="fas fa-dice-d20"></i> ${formula}`;
    return a;
  }

}

/***/ })

/******/ });