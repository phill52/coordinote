const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;
const dotenv=require('dotenv').config({path:'../.env'})
const uri = dotenv.parsed.DB_URL

let _connection = undefined;
let _db = undefined;

module.exports = {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(uri);
      _db = await _connection.db(mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
