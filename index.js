const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const url = process.env.MONGODB_URI || "mongodb://localhost:27017/hass_clip1";
const dbName = url.substr(url.lastIndexOf('/') + 1);

const app = express();
let collection;

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// middlewares
app.use(express.static('assets'));
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/:name', (req, res) => {
    const name = req.params.name;
    collection.findOne( {name}, (err, clip) => {
        if (err) {
            res.status(400).end();
            return;
        }

        // Remove clip after reading
        if (clip) {
            collection.deleteOne(clip);
        }

        if (req.accepts('html')) {
            if (clip) clip.showInfo = true;
            res.render('home', clip || { name });
        } else if (req.accepts('json')) {
            if (!clip) {
                res.status(404).end();
            } else {
                res.send(clip).end();
            }
        }
    });
});

app.post('/:name', (req, res) => {
    const { name, clip } =  req.body;
    collection.insertOne({ name, clip}, function(err) {
        if (err) res.status(400).send(err.errmsg).end();
        res.status(200).end();
      });
});

MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    const dbo = db.db(dbName);
    dbo.createCollection('clips', (err, res) => {
      if (err) throw err;
      collection = res;
      collection.createIndex({name: 1}, {unique: true});
      console.log(`Listening on ${PORT}...`);
      app.listen(PORT);
    });
  });
