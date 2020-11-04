/**
 * imports the css for usage, order matters
 */
import "./css/foundry.css";
import "./css/style.css";
import "./css/pf2e.scss";

import sheetTemplate from "./handlebars/actor-sheet.handlebars";

import styleArray from "./css/variables";

Hooks.emit("start");

// when document is loaded, add sheet
document.addEventListener("DOMContentLoaded", async function () {
  document.body.style.setProperty("--headerHeight", $("body > div.header").height() + "px");

  if (window.location.href.split(/\?(.+)/)[1] == undefined) {
    notFoundError("No Link Entered");
    return;
  }

  let loadElement = $(`<div class="errorDiv"><div><p>Retrieving Data</p></div></div>`);
  $("body").append(loadElement);

  const windowData = window.location.href.split(/\?(.+)/)[1];

  /**
   * enters url data into textbox if there is any
   */
  $(document.body).find("form#siteUrlForm input#siteUrl").val(windowData);

  /**
   * read actor id and json url from url data
   */
  let [dataUrl, , actorId] = windowData.split(/(\.json)(.+)/);
  dataUrl += ".json";

  try {
    const dataJSON = await getJSON(dataUrl);

    /**
     * double check if actor id exists
     */
    if (dataJSON[actorId] === undefined) {
      notFoundError("Actor Not Found");
      return;
    }

    /**
     * get base url of foundry server
     */
    const baseUrl = dataUrl.replace(/(\/)(?!.*\1).*\b\.json\b/, "").replace("actorAPI", "");

    /**
     * dynamic url for getting background from server
     */
    let styleElement = document.createElement("style");
    styleElement.id = "styleVariables";
    let styleString = "";

    styleArray.forEach((entry) => {
      styleString = styleString.concat(`--${entry[0]}: url('${baseUrl}${entry[1]}');\n`);
    });
    styleElement.innerHTML = ":root {\n" + styleString + "}";
    document.head.append(styleElement);

    /**
     * get data of actor that's in the url
     */
    let actorData = dataJSON[actorId];

    /**
     * emit hook that populatesheet.js listens to
     */
    Hooks.emit("showSheet", sheetTemplate, actorData, baseUrl);
  } catch (e) {
    console.log(e);
    notFoundError("URL not found");
  }

  /**
   * remove the loading text when done
   */
  loadElement.remove();
});

/**
 * add link to url and reload page when link gets submitted
 */
$(document.body)
  .find("form#siteUrlForm")
  .on("submit", function (e) {
    window.location = window.location.origin + window.location.pathname + "?" + $(e.target).find("input#siteUrl").val();
  });

/**
 * gets json data from url, uses cors-anywhere proxy to get around cors not being setup on foundry
 *
 * @param  {String} url
 */
function getJSON(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      dataType: "json",
      url: proxyUrl + url,
      success: (data) => resolve(data),
      error: () => reject(),
    });
  });
}

/**
 * shows submitted text in the middle of screen
 *
 * @param  {String} textContent
 */
function notFoundError(textContent) {
  let divElement = document.createElement("div");
  divElement.className = "errorDiv";
  $("body").append(`<div class="errorDiv"><div><p>${textContent}</p></div></div>`);
}
