sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/m/MessageToast',
    'sap/ui/integration/Host',
    "sap/ui/core/ws/WebSocket"
	], function(Controller, MessageToast, Host, WebSocket) {
	"use strict";

	//var aMobileCards = [];

	return Controller.extend("letsmove.dashboard.Main", {

		onInit: function () {
      /**
       * Dynamically load manifest path from resource root because when loading
       * via Launchpad there is an other root folder than loading index.html
       */
      var sPath = jQuery.sap.getModulePath("letsmove.dashboard");

      var oImageModel = new sap.ui.model.json.JSONModel({ path: sPath });
      this.getView().setModel(oImageModel, "imageModel");

      this.getView().byId("idTimelineCard").setManifest(sPath + "/timeline-card.json");
      this.getView().byId("idDonutActivityCard").setManifest(sPath + "/donut-activitytype-km-card.json");
      this.getView().byId("idDonutCompanyCard").setManifest(sPath + "/donut-company-km-card.json");
      this.getView().byId("idDonutCountryCard").setManifest(sPath + "/donut-country-km-card.json");
      this.getView().byId("idQRCodeCard").setManifest(sPath + "/qrcode/manifest.json");
      this.getView().byId("idChartColumnMonthTypeCard").setManifest(sPath + "/chart-column-month-type-card.json");

      /**
       * Create Websocket Connection for realtime updates
       */
      //var oWS = new WebSocket("wss://businessappstudio-workspaces-ws-dk5pr-app1.eu10.applicationstudio.cloud.sap/wss");
      //var oWS = new WebSocket("/wss");
      //var oWS = new WebSocket("wss://businessappstudio-workspaces-ws-dk5pr-app1.eu10.applicationstudio.cloud.sap");
      var oWS = new WebSocket("/catalog/");

			oWS.attachMessage(function (oEvent) {
				// update list
        this.getView().byId("idTimelineCard").refresh();
        this.getView().byId("idDonutActivityCard").refresh();
        this.getView().byId("idDonutCompanyCard").refresh();
        this.getView().byId("idDonutCountryCard").refresh();
        this.getView().byId("idChartColumnMonthTypeCard").refresh();
      }.bind(this));

      /*
			var oHost = new Host({
				actions: [
					{
						type: 'Navigation',
						text: 'Open SAP website',
						icon: 'sap-icon://globe',
						url: "http://www.sap.com",
						target: "_blank",
						enabled: function (oCard) {
							return oCard.getId().indexOf('card1') > -1;
						}
					},
					{
						type: 'Custom',
						text: 'Add to Mobile',
						icon: 'sap-icon://add',
						visible: function (oCard) {
							return new Promise(function (resolve) {
								resolve(aMobileCards.indexOf(oCard) === -1);
							});
						},
						action: function (oCard, oButton) {
							if (aMobileCards.indexOf(oCard) === -1) {
								aMobileCards.push(oCard);

								MessageToast.show("Card successfully added to Mobile.");
							}
						}
					},
					{
						type: 'Custom',
						text: 'Remove from Mobile',
						icon: 'sap-icon://decline',
						visible: function (oCard) {
							return new Promise(function (resolve) {
								resolve(aMobileCards.indexOf(oCard) > -1);
							});
						},
						action: function (oCard, oButton) {
							var iIndex = aMobileCards.indexOf(oCard);
							if (iIndex > -1) {
								aMobileCards.splice(iIndex, 1);

								MessageToast.show("Card successfully removed from Mobile.");
							}
						}
					}
				]
			});

			this.getView().byId('card1').setHost(oHost);
			this.getView().byId('card2').setHost(oHost);
      this.getView().byId('card3').setHost(oHost);
      */
    },

    onRefresh: function (oEvent) {
      debugger;

      this.getView().byId("idTimelineCard").refresh();
      this.getView().byId("idDonutActivityCard").refresh();
      this.getView().byId("idDonutCompanyCard").refresh();
      this.getView().byId("idDonutCountryCard").refresh();
    }

	});
});
