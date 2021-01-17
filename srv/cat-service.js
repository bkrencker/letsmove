const cds = require('@sap/cds');
const WebSocket = require('ws');

const {
  Activities
} = cds.entities;

module.exports = srv => {

  srv.after('INSERT', 'Activities', (req) => {
    console.log("After insert");

    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("refresh");
      }
    });
  });

};
