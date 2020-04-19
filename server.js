'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const fccTesting  = require('./freeCodeCamp/fcctesting.js');
const session     = require('express-session');
const mongo       = require('mongodb').MongoClient;

const auth   = require('./auth.js');
const routes = require('./routes.js');

const app = express();

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug')

/* Database connection */
mongo.connect(process.env.DATABASE, (err, client) => {
    let db = client.db('yourproject');
    if(err) {
        console.log('Database error: ' + err);
    } else {
      console.log('Successful database connection');
      
      /* Call auth & routes*/
      auth(app, db);
      routes(app,db);
        
      /* Running server */
      app.listen(process.env.PORT || 3000, () => {
        console.log("Listening on port " + process.env.PORT);
      });  
    }
});
