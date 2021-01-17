sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/m/MessageToast',
    'sap/ui/integration/Host',
    "sap/ui/core/ws/WebSocket"
	], function(Controller, MessageToast, Host, WebSocket) {
	"use strict";

	var aMobileCards = [];

	return Controller.extend("letsmove.dashboard.Main", {

		onInit: function () {
      var oWS = new WebSocket("wss://businessappstudio-workspaces-ws-dk5pr-app1.eu10.applicationstudio.cloud.sap/wss");
			oWS.attachMessage(function (oEvent) {
				// update list
        this.getView().byId("idTimelineCard").refresh();
        this.getView().byId("idDonutActivityCard").refresh();
        this.getView().byId("idDonutCompanyCard").refresh();
        this.getView().byId("idDonutCountryCard").refresh();
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
