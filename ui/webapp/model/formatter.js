sap.ui.define([], function () {
  "use strict";
  return {
    /*
    * Show white icon when segment has been selected
    */
    setIcon: function (typeCode, code) {
      if (typeCode === code) {
        return `resources/img/icons/${code}_white.png`;
      } else {
        return `resources/img/icons/${code}.png`;
      }
    }
  };
});
