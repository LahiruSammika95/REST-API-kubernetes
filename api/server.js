let express = require('express');
var cors=require("cors");
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();
app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
let databaseName = "my-db";


app.post('/add-user', function (req, res) {
  let userObj = req.body;

  MongoClient.connect(`mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_URL}`, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);
    userObj['userName'] = req.body.userName;

    let myquery = { userName: req.body.userName };
    let newvalues = { $set: userObj };

    db.collection("users").updateOne(myquery, newvalues, {upsert: true}, function(err, res) {
      if (err) throw err;
      client.close();
    });

  });

  res.send(userObj);
});

app.get('/get-user/:userName', function (req, res) {
  let response = {};

  MongoClient.connect(`mongodb://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_URL}`, mongoClientOptions, function (err, client) {
    if (err) throw err;

    let db = client.db(databaseName);

    let myquery = { userName: req.params.userName };

    db.collection("users").findOne(myquery, function (err, result) {
      if (err) throw err;
      response = result;
      client.close();

      res.send(response ? response : {});
    });
  });
});

app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
