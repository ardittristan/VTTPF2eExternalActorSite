/** @type {import('../../../node_modules/dot-prop/index')} */
const dotProp = require("dot-prop");

module.exports = function (value) {
  let local = dotProp.get(i18n, value);
  return local || value;
};
