import BaseConfig from "./base";
const path = require('path');
const cron = require('node-cron');
const fs = require("fs");
const fsPromises = require("fs").promises;
const {
  spawn
} = require("child_process");


export default class dbBackup extends BaseConfig {

    constructor() {
        super();
    }

    async dataBackup() {

        const dbName = this.ENV.MONGODB_DB_NAME ;
        const archivePath = path.join('dbBackUp');

        // if Directory Not exist make Directory 
        if (!fs.existsSync(path.join(process.cwd(), "dbBackUp"))) {
            await fsPromises.mkdir(path.join(process.cwd(), "dbBackUp"));
          }

        // Scheduling the backup  (using node-cron)
        cron.schedule('0 0 * * *', () => {
            console.log("start")
            // var cmd = 'mongodump --host ' + this.ENV.MONGODB_HOST + ' --port ' + this.ENV.MONGODB_PORT + ' --db ' + this.ENV.MONGODB_DB_NAME + ' --username ' + this.ENV.MONGODB_USERNAME + ' --password ' + this.ENV.MONGODB_PASSWORD + ' --out ' + '--archive=' + archivePath; // Command for mongodb dump process
            console.log('mongodump --host ' + this.ENV.MONGODB_HOST + ' --port ' + this.ENV.MONGODB_PORT + ' --db ' + this.ENV.MONGODB_DB_NAME + ' --username ' + this.ENV.MONGODB_USERNAME + ' --password ' + this.ENV.MONGODB_PASSWORD + ' --out ' + '--archive=' + archivePath)
            const child = spawn('mongodump', [
                `--host=${this.ENV.MONGODB_HOST}`,
                `--port=${this.ENV.MONGODB_PORT}`,
                `--db=${this.ENV.MONGODB_DB_NAME}`,
                `--username=${this.ENV.MONGODB_USERNAME}`,
                `--password=${this.ENV.MONGODB_PASSWORD}`,
                // '--out' ,
                `--archive=${archivePath}`,
                '--gzip',
            ]);
            
            child.stdout.on('data', (data) => {
                console.log('stdout:\n', data);
            });
            child.stderr.on('data', (data) => {
                console.log('stderr:\n', Buffer.from(data).toString());
            });
            child.on('error', (error) => {
                console.log('error:\n', error);
            });
            child.on('exit', (code, signal) => {
                if (code) console.log('Process exit with code:', code);
                else if (signal) console.log('Process killed with signal:', signal);
                else console.log('Database Backup successfully...');
            });
        });
        
    }
}
