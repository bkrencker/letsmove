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

            var oModel = new sap.ui.model.json.JSONModel();

            this.getView().setModel(oModel, "validation");
            this.getModel("validation").setData({
              type: null,
              distance: null,
              uom: null,
              nickname: null,
              company: null
            });

        },

        createActivity: function () {
          var formData = this.getModel("validation").getData();
          var oListBinding = this.getModel().bindList("/Activities");
          var oContext = oListBinding.create(formData, true);
            oContext.created().then(function () {
              // Visitor successfully created, delete form Data
              this.getModel("validation").setData({});
            }.bind(this).bind(oContext));
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
