import Tabs from "./libs/tabs.js";

/**
 * might be different for different systems, but this initializes the sheet tabs
 */
const tabs = [
  {
    navSelector: ".sheet-navigation",
    contentSelector: ".sheet-content",
    initial: "character",
  },
];

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
  const templateObject = {
    actor: data.actorData,
    data: data.actorData.data,
    items: data.actorData.items,
    isCharacter: data.actorData.data.type === "character",
    isNPC: data.actorData.data.type === "npc",
    owner: true,
    baseUrl: baseUrl,
  };
  console.log(templateObject);
  $(".window-content")[0].innerHTML = sheetTemplate(templateObject, {
    allowedProtoProperties: {
      size: true,
    },
  });

  activateListeners();
}

/* -------------------------------------------- */

/**
 * @param  {Object} actorData
 * @param  {String} baseUrl
 */
function getData(actorData, baseUrl) {
  let items = actorData.items;

  items.sort((a, b) => (a.sort || 0) - (b.sort || 0));

  /**
   * any other parsing that needs to be done
   */

  return {
    actorData,
    items,
  };
}

/* -------------------------------------------- */

function activateListeners() {
  // sheet object
  const html = $(".window-content").first();

  // bind tabs to pages
  _tabs.forEach((t) => t.bind(html[0]));

  {
    // ensure correct tab name is displayed after actor update
    const title = $(".sheet-navigation .active").data("tabTitle");
    if (title) {
      html.find(".navigation-title").text(title);
    }
  }

  html.find(".sheet-navigation").on("mouseover", ".item", (event) => {
    const title = event.currentTarget.dataset.tabTitle;
    if (title) {
      $(event.currentTarget).parents(".sheet-navigation").find(".navigation-title").text(title);
    }
  });

  html.find(".sheet-navigation").on("mouseout", ".item", (event) => {
    const parent = $(event.currentTarget).parents(".sheet-navigation");
    const title = parent.find(".item.active").data("tabTitle");
    if (title) {
      parent.find(".navigation-title").text(title);
    }
  });

  // handle sub-tab navigation on the actions tab
  html.find(".actions-nav").on("click", ".tab:not(.tab-active)", (event) => {
    const target = $(event.currentTarget);
    const nav = target.parents(".actions-nav");
    // deselect current tab and panel
    nav.children(".tab-active").removeClass("tab-active");
    nav.siblings(".actions-panels").children(".actions-panel.active").removeClass("active");
    // select new tab and panel
    target.addClass("tab-active");
    nav
      .siblings(".actions-panels")
      .children(`#${target.data("panel")}`)
      .addClass("active");
  });

  // Pad field width
  html.find("[data-wpad]").each((i, e) => {
    const text = e.tagName === "INPUT" ? e.value : e.innerText;
    const w = (text.length * parseInt(e.getAttribute("data-wpad"), 10)) / 2;
    e.setAttribute("style", `flex: 0 0 ${w}px`);
  });
}

/* -------------------------------------------- */
/*   Helper Functions                           */
/* -------------------------------------------- */

/**
 * put any other helper functions here
 */

/* -------------------------------------------- */

function createTabHandlers() {
  return tabs.map((t) => {
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
