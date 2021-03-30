sap.ui.define([
  "com/emmi/letsmove/controller/BaseController",
  "sap/ui/core/format/NumberFormat"
], function (Controller, NumberFormat) {
  "use strict";

  return Controller.extend("com.emmi.letsmove.controller.Main", {
    onInit: function () {
      // eslint-disable-next-line no-undef
      $("#splashScreen").remove();

      // Get Random number between 1 and 11
      var rand = Math.ceil(Math.random() * Math.floor(11));
      //Set Random background image
      this.byId("idAppControl").setBackgroundImage("resources/img/background.png");

      var oModel = new sap.ui.model.json.JSONModel();
      var oViewModel = new sap.ui.model.json.JSONModel();

      /*
        Initialize form Data for validation
      */
      this.getView().setModel(oModel, "validation");
      this.getModel("validation").setData({
        type_code: 'walk',
        distance: null,
        uom_code: this.getUnitFromLocale(),
        nickname: null,
        company_code: null
      });

      this.byId("textTitle").setHtmlText("<h1>Let's move " + new Date( ).getFullYear() +"</h1>");
      this.getView().setModel(oViewModel, "viewModel");
      this.getModel("viewModel").setData({
        shapeAnimationValue: 0
      });

      this.loadValuesFromLocalStorage();

      //Activate form validation
      sap.ui.getCore().getMessageManager().registerObject(this.getView(), true);
      this.updateBulletChart();

      //Deactivate Form after 01.04.2021
      var endTime = new Date('2021','03','01','12','00','00').getTime();
      var now = new Date().getTime();

      if (endTime <= now) {
        this.byId("vBoxForm").setVisible(false);
        this.byId("textCampainEnded").setHtmlText("<h3>Kampagne beendet.</h3><br />Vielen Dank für eure Teilnahme!<br /><br /><h3>Campaign ended.</h3><br />Vielen Dank für eure Teilnahme!");
        this.byId("vBoxCampainEnded").setVisible(true);
      }
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
      var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
      //Set data into local storage
      oStorage.put("nickname", formData.nickname);
      oStorage.put("company_code", formData.company_code);

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
        var vBoxConfirmation = this.byId("vBoxConfirmation");
        var vBoxForm = this.byId("vBoxForm");

        vBoxForm.setVisible(false);
        vBoxConfirmation.setVisible(true);

        this.startAnimationCounter();

        setTimeout(function () {
          vBoxConfirmation.setVisible(false);
          vBoxForm.setVisible(true);
          this.loadValuesFromLocalStorage();
        }.bind(this), 20000);
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
      if (oEvent.getParameters().id == this.byId("inputDistance").getId()) {
        var value = oEvent.getSource().getValue();
        oEvent.getSource().setValue(value);
      }

      if (oEvent.getSource().getValue() == "" ) {
        oEvent.getSource().setValueState("Error");
        this.setButtonSendEnabled(false);
      }
    },
    companyValidation: function (oEvent) {
      this.checkIfFieldNotEmpty(oEvent);

      if (oEvent.getSource().getSelectedKey() == "" || oEvent.getSource().getSelectedKey() == null || oEvent.getSource().getSelectedKey() == null) {
        oEvent.getSource().setValueState("Error");
        this.setButtonSendEnabled(false);
      } else {
        oEvent.getSource().setValueState("Success");
        this.validationSucess(oEvent);
      }
    },

    validationSucess: function (oEvent) {
      debugger;
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
        this.byId("btnSend").setType(sap.m.ButtonType.Negative);
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
      var unit = null;
      var loc = this.getView().getModel("i18n").getResourceBundle().sLocale;
      if (loc.includes("_US") || loc.includes("_GB") || loc.includes("_MM") || loc.includes("_LR")) {
        unit = "mi";
      } else {
        unit = "km";
      }
      return unit;
    },

    segmentUnitChanged: function (oEvent) {
      this.updateBulletChart(oEvent.getSource().getSelectedKey());
    },

    startAnimationCounter: function () {
      var oModel = this.getModel("viewModel");
      for (var i = 0; i <= 100; i++) {
        oModel.setProperty("/shapeAnimationValue", i);
      }
    },
    loadValuesFromLocalStorage: function() {
      // Local Storage
      var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
      //Load last inout values
      this.byId("inputNickname").setValue(oStorage.get("nickname"));
      this.byId("comboCompany").setSelectedKey(oStorage.get("company_code"));

      if (oStorage.get("company_code") != null) {
        this.byId("comboCompany").setValueState(sap.ui.core.ValueState.Success);
      }
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
              //Workaround, set de-de locale to de-CH to format correctly
              if (navigator.language == "de-de") {
                sap.ui.getCore().getConfiguration().setLanguage("de-CH");
              }
              //Add thousand separator according to locale
              var oFloatNumberFormat = NumberFormat.getFloatInstance({
                    groupingEnabled: true
                } , sap.ui.getCore().getConfiguration().getLocale());
              var targetFormated = target;
              targetFormated = oFloatNumberFormat.format(parseInt(target));

              this.getView().byId("microBulletChartThresholdStart").setValue(0);
              this.getView().byId("microBulletChartThresholdEnd").setValue(target * 1.5);
              this.getView().byId("microBulletChart").setTargetValue(target);
              this.getView().byId("microBulletChart").setTargetValueLabel(targetFormated + " " + unit);
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
