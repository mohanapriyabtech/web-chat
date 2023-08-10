import BaseConfig from './base';
import dbBackup from './dbBackup';
import Mongoose from './mongoose';


//basic env and express config
const config = new BaseConfig();
//base mongoose config
const mongoose = new Mongoose();
//db backup config
const backup = new dbBackup();



module.exports = { config, mongoose, backup };