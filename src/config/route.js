import BaseConfig from "./Base";

/**
 * router config
 */
export default class RouterConfig extends BaseConfig { 

    constructor() {
        super();
        this.router = this.express.Router();
    }

}