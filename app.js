const express = require("express");
const app = express();
const session = require("express-session");
const fetch = require("node-fetch");

const bodyParser = require("body-parser");

const passport = require("passport");

const OS_KEY = "hkABo11OhSUjmTRvKi2AysevY8n2LmI7";

app.use(session({
  name: "DurHack2019",
  secret: "f2*&HJS87238eaS8*tyJISdaKSOSD42HDAhuYAHGSFYA*@SD&*sddfDS521kSj*AdsjMssAd*%A4",
  resave: false,
  saveUninitialized: true
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// RETRIEVING UPRN
async function uprn(postcode) {
  if (postcode && typeof(postcode) == "string") {
    const response = await fetch("https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?postcode=" + postcode + "&key=" + OS_KEY);
    if (response && response.ok) {
      data = await response.json()
      // this assumes all houses with the same postcode have the same collection date
      return(data.results[0].DPA.UPRN);
    }
  }
}

module.exports = app;
