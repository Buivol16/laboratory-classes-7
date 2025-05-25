const { MongoClient } = require('mongodb');
const { DB_USER, DB_PASS } = require('./config');

let database = null;

async function mongoConnect(callback) {
  const url = 'localhost';
  const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@${url}`;

  const client = new MongoClient(uri);

  try {
    await client.connect();
    database = client.db('shop');
    console.log('Connection to the database has been established.');
    if (callback) callback();
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
}

function getDatabase() {
  if (!database) {
    throw new Error('No database found.');
  }
  return database;
}

module.exports = {
  mongoConnect,
  getDatabase,
};