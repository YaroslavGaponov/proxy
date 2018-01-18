'use strict';

const events = require('events');
const http = require('http');
const url = require('url');

class ProxyServer extends events.EventEmitter {
    constructor(port) {
        super();
        this.port = port;
        this.server = http.createServer((server_req, server_res)=> {
            const from = server_req.headers['x-forward-for'] || server_req.connection.remoteAddress;
            this.emit('log', `request from ${from} to ${server_req.url}`);
            const options = url.parse(server_req.url);
            const client = http.request(options, client_res => {
                server_res.writeHead(client_res.statusCode, client_res.headers);
                client_res.pipe(server_res);
            }).on('error', error => {
                this.emit('error', error);
            });
            server_req.pipe(client);
        });
    }
    start() {
        this.server.listen(this.port, '0.0.0.0', () => {
            const addr = this.server.address();
            this.emit('log', `server is started on ${addr.address}:${addr.port}`)
        })
        
    }
    stop() {
        this.emit('log', 'server is stopping');
        this.server.close();
    }
}

module.exports = ProxyServer;