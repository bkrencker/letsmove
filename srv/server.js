const cds = require('@sap/cds');
const helmet = require('helmet');

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
            "default-src": ["'self'", 'sapui5.hana.ondemand.com'],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'sapui5.hana.ondemand.com'],
            "img-src": ["'self'", 'sapui5.hana.ondemand.com']
            }
        })
    );
});

cds.on('served', () => {
    // add more middleware after all CDS servies
});

// delegate to default server.js:
module.exports = cds.server;
