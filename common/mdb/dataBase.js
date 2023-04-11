/*global require, exports*/



// Logger
const MongoClient = require("mongodb").MongoClient;

var dataBaseURL = require("./../../ackuaria_config").ackuaria.dataBaseURL;

const databaseName = require("./../../ackuaria_config").ackuaria.databaseName;

const client = new MongoClient(dataBaseURL);
client.connect();

exports.db = client.db(databaseName);

