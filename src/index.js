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

  $(document.body).find("form#siteUrlForm input#siteUrl").val(windowData);

  let [dataUrl, , actorId] = windowData.split(/(\.json)(.+)/);
  dataUrl += ".json";

  try {
    const dataJSON = await getJSON(dataUrl);

    if (dataJSON[actorId] === undefined) {
      notFoundError("Actor Not Found");
      return;
    }

    const baseUrl = dataUrl.replace(/(\/)(?!.*\1).*\b\.json\b/, "").replace("actorAPI", "");

    let styleElement = document.createElement("style");
    styleElement.id = "styleVariables";
    let styleString = "";

    styleArray.forEach((entry) => {
      styleString = styleString.concat(`--${entry[0]}: url('${baseUrl}${entry[1]}');\n`);
    });
    styleElement.innerHTML = ":root {\n" + styleString + "}";
    document.head.append(styleElement);

    let actorData = dataJSON[actorId];

    Hooks.emit("showSheet", sheetTemplate, actorData, baseUrl);
  } catch (e) {
    console.log(e);
    notFoundError("URL not found");
  }

  loadElement.remove();
});

$(document.body)
  .find("form#siteUrlForm")
  .on("submit", function (e) {
    window.location = window.location.origin + window.location.pathname + "?" + $(e.target).find("input#siteUrl").val();
  });

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

function notFoundError(textContent) {
  let divElement = document.createElement("div");
  divElement.className = "errorDiv";
  $("body").append(`<div class="errorDiv"><div><p>${textContent}</p></div></div>`);
}
