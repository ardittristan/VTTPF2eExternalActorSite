export default class TextEditor {
  static decodeHTML(html) {
    const txt = this._decoder;
    txt.innerHTML = html;
    return txt.value;
  }

  static enrichHTML(content, { secrets = false, entities = true, links = true, rolls = true, rollData = null } = {}) {
    const html = document.createElement("div");
    html.innerHTML = String(content);

    if (!secrets) {
      let elements = html.querySelectorAll("section.secret");
      elements.forEach((e) => e.parentNode.removeChild(e));
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

  //!
  static _getTextNodes(parent) {
    const text = [];
    const walk = document.createTreeWalker(parent, NodeFilter.SHOW_TEXT, null, false);
    while (walk.nextNode()) text.push(walk.currentNode);
    return text;
  }

  //!
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

  //?
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

  //!
  static _createEntityLink(match, type, target, name) {
    const data = {
      cls: ["entity-link"],
      icon: null,
      dataset: {},
      name: name,
    };
    let broken = false;

    if (CONST.ENTITY_TYPES.includes(type)) {
      const config = CONFIG[type];

      const collection = config.entityClass.collection;
      const entity = /^[a-zA-Z0-9]{16}$/.test(target) ? collection.get(target) : collection.getName(target);
      if (!entity) broken = true;

      data.name = data.name || (broken ? target : entity.name);
      data.icon = config.sidebarIcon;
      data.dataset = { entity: type, id: broken ? null : entity.id };
    }

    else if (type === "Compendium") {
      let [scope, packName, id] = target.split(".");
      const pack = game.packs.get(`${scope}.${packName}`);
      if (pack) {
        if (pack.index.length) {
          const entry = pack.index.find((i) => i._id === id || i.name === id);
          if (!entry) broken = true;
          else id = entry._id;
          data.name = data?.name || entry?.name || id;
        }

        const config = CONFIG[pack.metadata.entity];
        data.icon = config.sidebarIcon;
        data.dataset = { pack: pack.collection, id: id };
      } else broken = true;
    }

    if (broken) {
      data.icon = "fas fa-unlink";
      data.cls.push("broken");
    }

    const a = document.createElement("a");
    a.classList.add(...data.cls);
    a.draggable = true;
    for (let [k, v] of Object.entries(data.dataset)) {
      a.dataset[k] = v;
    }
    a.innerHTML = `<i class="${data.icon}"></i> ${data.name}`;
    return a;
  }

  //!
  static _createHyperlink(match) {
    const a = document.createElement("a");
    a.classList.add("hyperlink");
    a.href = match;
    a.target = "_blank";
    a.rel = "nofollow noopener";
    a.textContent = match;
    return a;
  }

  //!
  static _createInlineRoll(match, command, formula, closing, ...args) {
    const isDeferred = !!command;
    const rollData = args.pop();
    let roll;

    const data = {
      cls: ["inline-roll"],
      dataset: {},
    };

    if (closing.length === 3) formula += "]";

    if (isDeferred) {
      const chatCommand = `${command}${formula}`;
      let parsedCommand = null;
      try {
        parsedCommand = ChatLog.parse(chatCommand);
      } catch (err) {
        return null;
      }
      const flavor = parsedCommand[1][3];

      data.cls.push(parsedCommand[0]);
      data.dataset.mode = parsedCommand[0];
      data.dataset.flavor = flavor ? flavor.trim() : "";
      data.dataset.formula = parsedCommand[1][2].trim();
      data.result = parsedCommand[1][2].trim();
      data.title = data.dataset.flavor || data.dataset.formula;
    }

    else {
      try {
        roll = Roll.create(formula, rollData).roll();
        data.cls.push("inline-result");
        data.result = roll.total;
        data.title = formula;
        data.dataset.roll = escape(JSON.stringify(roll));
      } catch (err) {
        return null;
      }
    }

    const a = document.createElement("a");
    a.classList.add(...data.cls);
    a.title = data.title;
    for (let [k, v] of Object.entries(data.dataset)) {
      a.dataset[k] = v;
    }
    a.innerHTML = `<i class="fas fa-dice-d20"></i> ${data.result}`;
    return a;
  }
}
