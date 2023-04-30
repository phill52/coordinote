import {MongoClient} from 'mongodb';
const settings = {
  "mongoConfig": {
    "serverUrl": "mongodb://localhost:27017/",
    "database": "Coordinote"
  }
}
import dotenv from 'dotenv';
dotenv.config({path:'../.env'})
const uri = process.env.DB_URL

let _connection = undefined;
let _db = undefined;

export default {
  dbConnection: async () => {
    if (!_connection) {
      _connection = await MongoClient.connect(uri);
      _db = await _connection.db(settings.mongoConfig.database);
    }

    return _db;
  },
  closeConnection: () => {
    _connection.close();
  },
};
