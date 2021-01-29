const cds = require('@sap/cds');
const WebSocket = require('ws');

const {
  Activities
} = cds.entities;

module.exports = srv => {

  srv.after('READ', 'Activities', (each) => {
    if (each.type && each.type.code) {
      each.imageUrl = 'activities/webapp/icons/' + each.type.code + '.png';
    } else if (each.type_code) {
      each.imageUrl = 'activities/webapp/icons/' + each.type_code + '.png';
    }
  });

  srv.after('INSERT', 'Activities', (req) => {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("refresh");
      }
    });
  });

};
