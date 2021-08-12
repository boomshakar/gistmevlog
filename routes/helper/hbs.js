const moment = require("moment");

module.exports = {
  isnt: (val, str, option) => {
    if (val != str) {
      return option;
    }
    return options.inverse();
  },
};
