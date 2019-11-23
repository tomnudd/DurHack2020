const express = require("express");
const app = express();
const session = require("express-session");

const fetch = require("node-fetch");
const querystring = require("querystring");
const axios = require("axios");
const cheerio = require("cheerio");

const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_ID = process.env.AUTH0_ID;
const AUTH0_SECRET = process.env.AUTH0_SECRET;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const CONNECTION_URL = "mongodb+srv://durhack:" + process.env.mongo + "@cluster0-7p6nu.gcp.mongodb.net/test?retryWrites=true&w=majority"
const DB_NAME = "DHDM"
const OS_KEY = process.env.OS_KEY;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) {
    throw err;
  };
  database = client.db(DB_NAME);
  collection = database.collection("User");
  console.log("Connected to " + DB_NAME + "!");
})

const strategy = new Auth0Strategy({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_ID,
  clientSecret: AUTH0_SECRET,
  callbackURL: "http://127.0.0.1:8090/callback"
}, function (accessToken, refreshToken, extraParams, profile, done) {
  collection.findOne({_id: profile.id}, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      if (res == null) {
        collection.insertOne({_id: profile.id, first_name: profile.name.givenName.replace(/\s+$/g, "") || null, last_name: profile.name.familyName.replace(/\s+$/g, "") || null});
      } else {
        console.log(res);
      }
    }
  })
  return done(null, profile);
})

passport.use(strategy);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(session({
  name: "DurHack2019",
  secret: "f2*&HJS87238eaS8*tyJISdaKSOSD42HDAhuYAHGSFYA*@SD&*sddfDS521kSj*AdsjMssAd*%A4",
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, "/public")));

// RETRIEVING UPRN
async function get_uprn(address) {
  // we can take their entire address and the OS api can process that and return json
  if (address && typeof(address) == "string") {
    const response = await fetch("https://api.ordnancesurvey.co.uk/places/v1/addresses/find?query=" + address + "&key=" + OS_KEY);
    if (response && response.ok) {
      data = await response.json()
      return(data.results[0].DPA.UPRN);
    }
  }
}

app.get("/", (req, res) => {
  if (req.user) {
    //console.log(req.user);
  }
  res.render("index");
});

app.get("/login", passport.authenticate("auth0", {
  scope: "openid email profile"
}), function(req, res) {
  res.redirect("/");
});

app.get("/callback", passport.authenticate("auth0", {
	failureRedirect: "/whoops"
}),
async function (req, res) {
	res.redirect("/");
});
// web scraping time!

app.get("/bins/:address", async function(req, res) {
  uprn = await get_uprn(req.params.address);
  console.log(uprn)
  axios.get("http://mydurham.durham.gov.uk/article/12690?uprn=" + uprn).then((response) => {
      if (response.status === 200) {
        const html = response.data;
        let $ = cheerio.load(html);
        let page = $("#page_PageContentHolder_template_pnlArticleBody").html();
        $ = cheerio.load(page);
        let rubbish_date = $("p:nth-of-type(2)").html();
        let recycling_date = $("p:nth-of-type(3)").html();
        console.log([rubbish_date, recycling_date])
        return ([rubbish_date, recycling_date]);
      }
  }, (error) => console.log(err) );
});

app.get("/user/data", async function(req, res) {
  if (req.user && req.user.id) {

  }
})

// 'ME' PAGE
// hobbies
app.get("/hobbies/list/:id", async function(req, res){
  user_id = req.params.id

  console.log(req);

  // query the db to get all the favourites of a particular person
  let list = ['hobby 1', 'hobby 2'];

  let res_data = JSON.stringify(list);
  res.setHeader('Content-Type', 'application/json');
  res.send(res_data);
});

app.post('/hobbies/edit', function (req, res) {
  user_id = req.body.id;
  new_favourites = req.body.new_favourites
  res.setHeader('Content-Type', 'application/json');

  try {
      // update the db with the new favourites
      resp.status(204).send();
  } catch(error) {
    console.log(error)
    resp.status(500).send();
  }

});

// favourites
app.get("/favourites/list", async function(req, res){
  let user_id = req.user.id;
  console.log(user_id);

  // query the db to get all the favourites of a particular person
  let list = ['something', 'something else'];

  let resp_data = JSON.stringify(list);
  res.setHeader('Content-Type', 'application/json');
  res.send(resp_data);
});

app.post('/favourites/edit', function (req, res) {
  user_id = req.body.id;
  new_favourites = req.body.new_favourites
  resp.setHeader('Content-Type', 'application/json');

  try {
      // update the db with the new favourites
      resp.status(204).send();
  } catch(error) {
    console.log("error");
    resp.status(500).send();
  }

});



module.exports = app;
