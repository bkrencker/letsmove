sap.ui.define([
    "com/emmi/letsmove/controller/BaseController"
], function (Controller) {
    "use strict";

    return Controller.extend("com.emmi.letsmove.controller.Main", {
        onInit: function () {
          $("#splashScreen").remove();

          // Get Random number between 1 and 11
            var rand = Math.ceil(Math.random() * Math.floor(11));
            //Set Random background image
            this.byId("idAppControl").setBackgroundImage("resources/img/img_" + rand + ".jpg");
        },

        setNewIcon: function (oEvent) {
            var currentSelectedButtonId = oEvent.getSource().oButton.getId();

            if (this._lastActiveButton !== currentSelectedButtonId) {  //Prevent icon change when the same button has been pressed
                this._lastActiveButton = currentSelectedButtonId;
                var buttons = oEvent.getSource().getParent().getButtons();

                //Set new icon
                for (var i in buttons) {
                    var icon = buttons[i].getIcon();
                    if (buttons[i].getId().toString() === currentSelectedButtonId.toString()) {
                        icon = icon.replace(".png", "_white.png");
                        buttons[i].setIcon(icon);
                    } else {
                        icon = icon.replace("_white.png", ".png");
                        buttons[i].setIcon(icon);
                    }
                }
            }
        }
    });
});
