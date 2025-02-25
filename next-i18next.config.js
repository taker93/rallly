const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "de",
    locales: ["en", "de"],
    localePath: path.resolve("./public/locales"),
    reloadOnPrerender: process.env.NODE_ENV === "development",
  },
};
