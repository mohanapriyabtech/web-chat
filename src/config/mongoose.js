import BaseConfig from "./base";
import chalk from 'chalk';


/**
 * Mongoose configuration class to connect mongodb using Mongoose
 */
export default class Mongoose extends BaseConfig {
    constructor() {
        super();
    }
    /**
     * connection to mongoDB
     */
    connectDB() {

        // this.mongoose.connect(this.ENV.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

        if (this.ENV.MONGODB_PASSWORD == undefined || this.ENV.MONGODB_PASSWORD == '') {
            console.log('Mongodb Connecting without password');
            console.log(`mongodb://${this.ENV.HOST}/${this.ENV.MONGODB_DB_NAME}`)
            this.mongoose.connect(`mongodb://${this.ENV.HOST}/${this.ENV.MONGODB_DB_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });
        } else {
            console.log('Mongodb Connecting with password');
            const URI = `mongodb://${this.ENV.MONGODB_USERNAME}:${this.ENV.MONGODB_PASSWORD}@${this.ENV.MONGODB_HOST}:${this.ENV.MONGODB_PORT}/${this.ENV.MONGODB_DB_NAME}?authMechanism=DEFAULT&authSource=admin`
            console.log("connecting....")
            this.mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
        }
        // when successfully connected
        this.mongoose.connection.on('connected', () => {
            console.log(chalk.yellowBright.bold.italic('Mongodb successfully connected'));
        });
        // if the connection throws an error
        this.mongoose.connection.on("error", (err) => {
            // if you get error for the first time when this gets started make sure to run mongodb
            console.log('Mongodb connection failed', err);
        });
        // when the connection is disconnected
        this.mongoose.connection.on("disconnected", () => {
            console.log(chalk.red.bold.italic('Mongodb disconnected'));
        });
    }
}