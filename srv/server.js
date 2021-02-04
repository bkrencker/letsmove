const cds = require('@sap/cds');
const helmet = require('helmet');
const WebSocket = require('ws');

//const url = require('url');

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', function connection(ws) {
  console.log("WebSocket Connection");
});

global.wss = wss;

var aWsKeys = [];

/**
 * handle bootstrapping events...
 */
cds.on('bootstrap', (app) => {
    // add your own middleware before any by cds are added

    app.use(helmet());

    app.use(
        helmet.contentSecurityPolicy({
            directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "default-src": ["'self'", 'sapui5.hana.ondemand.com', 'https://ui5.sap.com'],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'sapui5.hana.ondemand.com', 'https://ui5.sap.com'],
            "img-src": ["'self'", 'sapui5.hana.ondemand.com', 'https://ui5.sap.com']
            }
        })
    );
});

cds.on('served', () => {
    // add more middleware after all CDS servies
});


cds.on('listening', (cdsserver) => {
  //console.log("Hello World");

  cdsserver.server.on('upgrade', function upgrade(request, socket, head) {
    console.log("OnUpgrade url: " + request.url + " upgrade: " + request.headers["upgrade"] + " connection: " + request.headers["connection"]);
    console.log("websocket key: " + request.headers["sec-websocket-key"]);
    console.log("Host: " + request.headers["host"]);
    console.log("Origin: " + request.headers["origin"]);
    //const pathname = url.parse(request.url).pathname;


    if (
        request.headers["connection"] && request.headers["connection"] === "Upgrade"
        && request.headers["upgrade"] && request.headers["upgrade"] === "websocket"
        && request.headers["sec-websocket-key"]
      )
    {
      console.log("Check if Key exists");
      if (!aWsKeys.includes(request.headers["sec-websocket-key"])) {
        console.log("New Key -> store and handleUpgrade");
        aWsKeys.push(request.headers["sec-websocket-key"]);

        wss.handleUpgrade(request, socket, head, function done(ws) {
          console.log("WSS HandleUpgrade ");
          wss.emit('connection', ws, request);
        });
      } else {
        console.log("Key does already exist -> skip");
      }

    }

    //if (pathname === '/wss') {
      /*wss.handleUpgrade(request, socket, head, function done(ws) {
        console.log("WSS HandleUpgrade ");
        wss.emit('connection', ws, request);
      });*/
    /*} else {
      socket.destroy();
    }*/
  });

  /*const wss = new WebSocket.Server({ server: cdsserver.server });
  global.wss = wss;

  wss.on('connection', function connection(ws) {
    console.log("WebSocket Connection");
  });*/

});

// delegate to default server.js:
module.exports = cds.server;
