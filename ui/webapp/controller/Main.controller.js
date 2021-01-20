sap.ui.define([
  "com/emmi/letsmove/controller/BaseController"
], function (Controller) {
  "use strict";

  return Controller.extend("com.emmi.letsmove.controller.Main", {
    onInit: function () {
      // eslint-disable-next-line no-undef
      $("#splashScreen").remove();

      // Get Random number between 1 and 11
      var rand = Math.ceil(Math.random() * Math.floor(11));
      //Set Random background image
      this.byId("idAppControl").setBackgroundImage("resources/img/img_" + rand + ".jpg");

      var oModel = new sap.ui.model.json.JSONModel();

      /*
        Initialize form Data for validation
      */
      this.getView().setModel(oModel, "validation");
      this.getModel("validation").setData({
        type_code: 'bike',
        distance: null,
        uom_code: this.getUnitFromLocale(),
        nickname: null,
        company_code: null
      });
      //Activate form validation
      sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
      this.updateBulletChart();

      /**
       * Create Websocket Connection for realtime updates

      //var oWS = new WebSocket("wss://businessappstudio-workspaces-ws-dk5pr-app1.eu10.applicationstudio.cloud.sap/wss");
      var oWS = new WebSocket("/wss");

			oWS.attachMessage(function (oEvent) {
				// update list
        this.updateBulletChart();
      }.bind(this));
       */
    },

    sleep: function (milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    },

    send: function () {
      var formData = this.getModel("validation").getData();
      //Convert Float to string
      formData.distance = formData.distance.toString();

      //Create Activity Entry
      this.createActivity(formData).then(function () {
        this.getModel("validation").setData({});
        this.updateBulletChart();
        /*
          Reset form after submit
        */
        this.byId("inputDistance").setValueState(sap.ui.core.ValueState.None);
        this.byId("inputNickname").setValueState(sap.ui.core.ValueState.None);
        this.byId("comboCompany").setValueState(sap.ui.core.ValueState.None);
        this.byId("segmentBtnActivity").setSelectedKey("bike");
        this.byId("segmentBtnUnit").setSelectedKey(this.getUnitFromLocale());
        this.byId("btnSend").setType(sap.m.ButtonType.Default);
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
    checkIfFieldNotEmpty: function (oEvent) {
      if (oEvent.getSource().getValue() == "") {
        oEvent.getSource().setValueState("Error");
        this.setButtonSendEnabled(false);
      }
    },
    companyValidation: function (oEvent) {
      if (oEvent.getSource().getSelectedKey() == "" || oEvent.getSource().getSelectedKey() == null || oEvent.getSource().getSelectedKey() == null) {
        oEvent.getSource().setValueState("Error");
        this.setButtonSendEnabled(false);
      } else {
        oEvent.getSource().setValueState("Success");
        this.validationSucess(oEvent);
      }
    },

    validationSucess: function (oEvent) {
      oEvent.getSource().setValueState("Success");
      if (this.allFieldsFilled() == true) {
        this.setButtonSendEnabled(true);
      } else {
        this.setButtonSendEnabled(false);
      }
    },
    allFieldsFilled: function () {
      var inputNickname = this.byId("inputNickname");
      var inputDistance = this.byId("inputDistance");
      var comboCompany = this.byId("comboCompany");
      if (inputNickname.getValue() !== "" && inputDistance.getValue() !== "" && comboCompany.getSelectedKey() !== "") {
        return true;
      } else {
        return false;
      }
    },
    validationError: function () {
      this.setButtonSendEnabled(false);
    },

    setButtonSendEnabled: function (bool) {
      this.byId("btnSend").setEnabled(bool);
      if (bool === true) {
        this.byId("btnSend").setType(sap.m.ButtonType.Accept);
      } else {
        this.byId("btnSend").setType(sap.m.ButtonType.Reject);
      }
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
    getUnitFromLocale: function () {
      for (var i in navigator.languages) {
        var loc = navigator.languages[i];
        if (loc.includes("-US") || loc.includes("-GB") || loc.includes("-MM") || loc.includes("-LR")) {
          return "mi";
        } else {
          return "km";
        }
      }
    },

    segmentUnitChanged: function (oEvent) {
      this.updateBulletChart(oEvent.getSource().getSelectedKey());
    },
    updateBulletChart: function (unit) {
      //Load Totals
      var oListTotalActivity = this.getView().getModel().bindList("/TotalActivity");
      new Promise(function (resolved, rejected) {
        oListTotalActivity.requestContexts().then(function (aContexts) {
          aContexts.forEach(function (oContext) {
            var total = 0;
            var target = 0;

            //var unit = null;
            if (oContext.getObject().totalKm <= 0) {
              rejected();
            } else {
              //Use Miles when browser has one of the specified Locales
              if (unit == null) {
                unit = this.getUnitFromLocale();
              }
              if (unit == "mi") {
                total = Math.round(oContext.getObject().totalMi);
                target = Math.round(oContext.getObject().TargetActivitiesMi);
              } else {
                total = Math.round(oContext.getObject().totalKm);
                target = Math.round(oContext.getObject().TargetActivitiesKm);
              }
              //Set SmartBullet Values
              this.getView().byId("microBulletChart").setTargetValue(target);
              this.getView().byId("microBulletChart").setTargetValueLabel(target + " " + unit);
              this.getView().byId("microBulletChartActualData").setValue(total);
              this.getView().byId("microBulletChart").setForecastValue(total);
              resolved(true);
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));
    }
  });
});
