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
    Prevent insert after 01.04.2021 12:00 (End of campain)
  */
  srv.on('INSERT', 'Activities', async (req) => {
    var endTime = new Date('2021','03','01','10','00','00').getTime();
    var now = new Date().getTime();

    //Get request data
    var resquest = req.query.INSERT.entries[0];
    var row = null;

    if (endTime <= now) {
      //Campain ended, don't execute INSERT
      row = resquest;
      return row;
    } else {
      //Execute INSERT Query
      const result = await cds.run(req.query);
      row = result['req'].query.INSERT['entries'][0];
      return row;
    }
  });

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
