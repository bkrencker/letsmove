sap.ui.define([
  "com/emmi/letsmove/controller/BaseController",
  "sap/ui/core/ws/WebSocket"
], function (Controller, WebSocket) {
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
        type_code: null,
        distance: null,
        uom_code: null,
        nickname: null,
        company_code: null
      });
      //Activate form validation
      sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
      this.updateBulletChart();


      /**
       * Create Websocket Connection for realtime updates
       */
      //var oWS = new WebSocket("wss://businessappstudio-workspaces-ws-dk5pr-app1.eu10.applicationstudio.cloud.sap/wss");
      var oWS = new WebSocket("/wss");

			oWS.attachMessage(function (oEvent) {
				// update list
        this.updateBulletChart();
      }.bind(this));
    },

    onAfterRendering: function () {

    },

    send: function () {
      var formData = this.getModel("validation").getData();
      //Convert Float to string
      formData.distance = formData.distance.toString();

      this.createActivity(formData).then(function () {
        this.getModel("validation").setData({});
      }.bind(this));
    },

    createActivity: function (formData) {
      var oListBinding = this.getModel().bindList("/Activities");
      var oContext = oListBinding.create(formData, true);
      var promise = new Promise(function (resolved) {
        oContext.created().then(function () {
          // Activity successfully created, delete form Data
          resolved(oContext.getObject());
        }.bind(this).bind(oContext));
      }.bind(this));

      return promise;
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
    },

    updateBulletChart: function () {
      //Load Totals
      var oListTotalActivity = this.getView().getModel().bindList("/TotalActivity");
      new Promise(function (resolved, rejected) {
        oListTotalActivity.requestContexts().then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            var total = 0;
            var target = 0;

            var unit = null;
            if (oContext.getObject().totalKm <= 0) {
              rejected();
            } else {
              //Use Miles when browser has one of the specified Locales
              for (var i in navigator.languages) {
                var loc = navigator.languages[i];

                if (loc.includes("-US") || loc.includes("-GB") || loc.includes("-MM") || loc.includes("-LR")) {
                  total = Math.round(oContext.getObject().totalMi);
                  target = Math.round(oContext.getObject().TargetActivitiesMi);
                  unit = 'mi';
                  break;
                } else {
                  total = Math.round(oContext.getObject().totalKm);
                  target = Math.round(oContext.getObject().TargetActivitiesKm);
                  unit = 'km';
                  break;
                }
              }
              //Set SmartBullet Values
              this.getView().byId("microBulletChart").setTargetValue(target);
              this.getView().byId("microBulletChart").setTargetValueLabel(target + " " + unit);
              this.getView().byId("microBulletChartActualData").setValue(total);
              this.getView().byId("microBulletChart").setForecastValue((target * 1.5));
              resolved(true);
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }
  });
});
