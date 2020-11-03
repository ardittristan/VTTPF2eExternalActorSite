import Tabs from "./libs/tabs.js";

/**
 * might be different for different systems, but this initializes the sheet tabs
 */
const tabs = [
  {
    navSelector: ".tabs",
    contentSelector: ".sheet-body",
    initial: "description",
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
  $(".window-content")[0].innerHTML = sheetTemplate(
    {
      actor: data.actorData,
      data: data.actorData.data,
      items: data.actorData.items,
      isCharacter: data.actorData.data.type === "character",
      isNPC: data.actorData.data.type === "npc",
      owner: true,
      baseUrl: baseUrl,
    },
    {
      allowedProtoProperties: {
        size: true,
      },
    }
  );

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
    items,
  };
}

/* -------------------------------------------- */

function activateListeners() {
  // sheet object
  const html = $(".window-content").first();

  // bind tabs to pages
  _tabs.forEach((t) => t.bind(html[0]));
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
