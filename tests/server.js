const finalhandler = require('finalhandler');
const http = require('http');
const serveStatic = require('serve-static');

const serve = serveStatic('test', { index: ['index.html', 'index.htm'] });

const server = http.createServer(function onRequest(req, res) {
    serve(req, res, finalhandler(req, res));
});

module.exports = {
    start: (port) => server.listen(port || 8888),
    stop: () => server.close(),
};
