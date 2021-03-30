const cds = require('@sap/cds');
//const WebSocket = require('ws');

/*const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({
    port: process.env.PORT || 8080
});

wss.on('connection', function connection(ws) {
  console.log("WebSocket Connection");
});*/

const {
  Activities
} = cds.entities;

module.exports = srv => {
  /*
  srv.on('INSERT', 'Activities', async (req) => {
    const result = await cds.run(req.query);
    var row = result['req'].query.INSERT['entries'][0];

    var endTime = new Date('2021','03','01','12','00','00').getTime();
    var now = new Date().getTime();

    if (endTime <= now) {
      row = { };
    }
    return row;
  });
*/
  srv.after('INSERT', 'Activities', (req) => {
    console.log("After insert");

    for (const client of wss.clients) {
      client.send("refresh");
    }

    /*wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send("refresh");
      }
    });*/
  });

  srv.after('READ', 'RecentActivities', (each) => {
    if (each.type && each.type.code) {
      each.imageUrl = 'activities/webapp/icons/' + each.type.code + '.png';
    } else if (each.type_code) {
      each.imageUrl = 'activities/webapp/icons/' + each.type_code + '.png';
    }
  });

};
