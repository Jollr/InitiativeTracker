var http = require('http');
var rq = require('./requestContext.js');

http.createServer(rq.processRequest).listen(80);

console.log('Server running');