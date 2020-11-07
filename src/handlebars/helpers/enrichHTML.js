const TextEditor = require("../../libs/TextEditor").default;

module.exports = function (html) {
  return TextEditor.enrichHTML(html);
};
