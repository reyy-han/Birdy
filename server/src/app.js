const path = require('path');
const api = require('./api.js');
const apimessages = require('./apimessages.js');
const apifriends = require('./apifriends.js');

const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
    
// ajout pour messages mongodb
var Datastore = require('nedb')
var mongodb = new Datastore();

// Détermine le répertoire de base
const basedir = path.normalize(path.dirname(__dirname));
console.debug(`Base directory: ${basedir}`);

express = require('express');
const app = express()
api_1 = require("./api.js");
const session = require("express-session");

app.use(session({
    secret: "technoweb rocks"
}));

app.use('/api', api.default(db, mongodb));
app.use('/apifriends', apifriends.default(db));
app.use('/apimessages', apimessages.default(db, mongodb));

// Démarre le serveur
app.on('close', () => {
});
exports.default = app;

