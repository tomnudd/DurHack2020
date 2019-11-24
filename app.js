const express = require("express");
const app = express();
const session = require("express-session");
const cors = require("cors");

const fetch = require("node-fetch");
const querystring = require("querystring");
const axios = require("axios");
const cheerio = require("cheerio");

const bodyParser = require("body-parser");
const path = require("path");
const {google} = require('googleapis');
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_KEY // specify your API key here
});
require("dotenv").config();

const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_ID = process.env.AUTH0_ID;
const AUTH0_SECRET = process.env.AUTH0_SECRET;

const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const CONNECTION_URL = "mongodb+srv://durhack:" + process.env.mongo + "@cluster0-7p6nu.gcp.mongodb.net/test?retryWrites=true&w=majority";
const DB_NAME = "DHDM";
const OS_KEY = process.env.OS_KEY;

MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
  if (err) {
    throw err;
  };
  database = client.db(DB_NAME);
  collection = database.collection("User");
  console.log("Connected to " + DB_NAME + "!");
})

//auth0 strategy
const strategy = new Auth0Strategy({
  domain: AUTH0_DOMAIN,
  clientID: AUTH0_ID,
  clientSecret: AUTH0_SECRET,
  callbackURL: "http://127.0.0.1:8090/callback"
}, async function (accessToken, refreshToken, extraParams, profile, done) {
  await collection.findOne({_id: profile.id}, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      if (res == null) {
        // insert a new document into db for the user if they do not exist
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

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", __dirname + "/views");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "/public")));

// RETRIEVING UPRN
async function get_uprn(address) {
  // we can take their entire address and the OS api can process that and return json
  if (address && typeof(address) == "string") {
    const response = await fetch("https://api.ordnancesurvey.co.uk/places/v1/addresses/find?query=" + address + "&key=" + OS_KEY);
    if (response && response.ok) {
      data = await response.json();
      return(data.results[0].DPA.UPRN);
    }
  }
}

// render frontend via pug
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
	failureRedirect: "/"
}),
async function (req, res) {
	res.redirect("/");
});

app.get("/isLoggedIn", async function(req, res) {
  if (req.user && req.user.id) {
    console.log(req);
    res.json({loggedIn: true});
  } else {
    res.json({loggedIn: false});
  }
});

app.get("/logout", async function (req, res) {
	await req.logout();
	res.redirect("/");
});

// web scraping time!

// returns an array containing info about bin collection - returns two strings in this arr
app.get("/bins/:address", async function(req, res) {
  uprn = await get_uprn(req.params.address);
  console.log(uprn);
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

// grabs all the data we have on a user in the db
app.get("/user/data", async function(req, res) {
  if (req.user && req.user.id) {
    collection.findOne({_id: req.user.id}, function(err, resp) {
      if (err) {
        throw err;
      } else {
        res.status(200);
        res.send(resp);
      }
    })
  }
})

// 'ME' PAGE
// hobbies

// return arr of hobbies of the user
app.get("/hobbies/list", async function(req, res){
  if (req.user && req.user.id) {
    let user_id = req.user.id;

    collection.findOne({_id: user_id}, function(err, resp) {
      if (err) {
        throw err;
      } else {
        if (resp.hobbies) {
          res.status(200);
          res.send(resp.hobbies);
        } else {
          collection.updateOne({_id: user_id}, {$set: {hobbies:[]}})
          res.status(200);
          res.send([]);
        }
      }
    });
  }
});

// send arr to replace the current arr of hobbies
app.post("/hobbies/edit", function (req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    let new_hobbies = req.body;
    collection.updateOne({_id: user_id}, {"$set": {hobbies: new_hobbies}}, {upsert:true})
    res.status(200).send("Woop");
  } else {
    res.status(400).send("Oh no");
  }
});

// favourites
// return list of current favourites, or create
app.get("/favourites/list", async function(req, res){
  if (req.user && req.user.id) {
    let user_id = req.user.id;

    collection.findOne({_id: user_id}, function(err, resp) {
      if (err) {
        throw err;
      } else {
        if (resp.favourites) {
          res.status(200);
          res.send(resp.favourites);
        } else {
          let obj = {food:"", music:"", animal:"", tv_programme:"", radio_programme:"", book:"", place:""};
          collection.updateOne({_id: user_id}, {$set: {favourites:obj}})
          res.status(200);
          res.send(obj);
        }
      }
    });
  }
});

// send object of favourites to replace the current object with
app.post("/favourites/edit", function (req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    let new_favourites = req.body;
    console.log(new_favourites);
    collection.updateOne({_id: user_id}, {"$set": {favourites: new_favourites}}, {upsert:true});
    res.status(200).send("Woop");
  }
});

// CALENDAR/TWILIO things

const params = {
  calendarID: "jist1h5klvj0181h8qan2gmrik@group.calendar.google.com"
};

// async function main(params) {
//   const res = await blogger.blogs.get({blogId: params.blogId});
//   console.log(`${res.data.name} has ${res.data.posts.totalItems} posts! The blog url is ${res.data.url}`)
// };

// main().catch(console.error);


app.get("/events/list", async function(req, res) {
  // need to get a list of events
  // but i think i'm gonna get nae-naed

  events_json = await calendar.calendars.get({calendarId: params.calendarID});
  console.log(events_json);

});

// return a list of people the user knows!
app.get("/people/list", function(req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    collection.findOne({_id: user_id}, function(err, resp) {
      if (err) {
        throw err;
      } else {
        if (resp.people) {
          res.send(resp.people);
        } else {
          collection.updateOne({_id: user_id}, {"$set": {people:[]}})
          res.status(200);
          res.send([]);
        }
      }
    });
  }
});

// adding a new person, send body params: name, img (url), description, memories
app.get("/people/add", function(req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    let new_person = {name: req.body.name, img: req.body.img, description: req.body.description, memories: req.body.memories};
    collection.updateOne({_id: user_id}, {"$push": {people: new_person}});
    res.status(200).send("Woop");
  }
});

app.get("/address", function(req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    collection.findOne({_id: user_id}, function(err, resp) {
      if (err) {
        throw err;
      } else {
        if (resp.address) {
          res.send(resp.address);
        } else {
          collection.updateOne({_id: user_id}, {"$set": {address:""}})
          res.status(200);
          res.send("");
        }
      }
    });
  }
});

app.get("/number", function(req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    collection.findOne({_id: user_id}, function(err, resp) {
      if (err) {
        throw err;
      } else {
        if (resp.number) {
          res.send(resp.number);
        } else {
          collection.updateOne({_id: user_id}, {"$set": {number:""}})
          res.status(200);
          res.send("");
        }
      }
    });
  }
});

app.post("/number/edit", function (req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    let new_number = req.body;
    collection.updateOne({_id: user_id}, {"$set": {number: new_number}}, {upsert:true});
    res.status(200).send("Woop");
  }
});

app.post("/address/edit", function (req, res) {
  if (req.user && req.user.id) {
    let user_id = req.user.id;
    let new_address = req.body;
    collection.updateOne({_id: user_id}, {"$set": {address: new_address}}, {upsert:true});
    res.status(200).send("Woop");
  }
});

module.exports = app;
