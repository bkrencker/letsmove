sap.ui.define([
  "com/emmi/letsmove/controller/BaseController"
], function(Controller) {
  "use strict";

  return Controller.extend("com.emmi.letsmove.controller.Main", {
    onInit : function () {
			// Get Random number between 1 and 11
			var rand = Math.ceil(Math.random() * Math.floor(11));
			//Set Random background image
			this.byId("idAppControl").setBackgroundImage("resources/img/img_" + rand + ".jpg");
		}
  });
});
