// package imports 
import http from 'http';
import https from 'https';
import chalk from 'chalk';
import fs from 'fs'

// local imports
import { config, mongoose, backup, sql } from './config/index';
import RouteServiceProvider from './providers/route-service-provider';
import SocketConfig from './config/socket';
//route service provider
const routeServiceProvider = new RouteServiceProvider();
let server

//mongoDB connection
mongoose.connectDB();

//sql db's connection
// sql.connectSqlDB()

backup.dataBackup();

if (process.env.HTTPS == 'true') {
    const options = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
        ca: fs.readFileSync(process.env.SSL_FULLCHAIN),
        secure: true,
        reconnect: true,
        rejectUnauthorized: false,
    };
    server = https.createServer(options, routeServiceProvider.app);
} else {
    server = http.createServer(routeServiceProvider.app);
}
// serve http request

//init socket connection
const socketConnecton = new SocketConfig(server);
//on connection function
socketConnecton.socket.on('connection', socketConnecton.onConnection)

// start server
server.listen(config.ENV.PORT, () => {
    if (process.send) {
        process.send('ready');
    }
    console.log(chalk.green.bold.italic(`app running on port ${config.ENV.PORT}`));
});
