const express = require("express");
const app = express();
const session = require("express-session");
const fetch = require("node-fetch");
const axios = require("axios");
const cheerio = require("cheerio");

const bodyParser = require("appbody-parser");

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
async function get_uprn(address) {
  // we can take their entire address and the OS api can process that and return json
  if (address && typeof(address) == "string") {
    const response = await fetch("https://api.ordnancesurvey.co.uk/places/v1/addresses/find?query=" + address + "&key=" + OS_KEY);
    if (response && response.ok) {
      data = await response.json()
      console.log(data.results[0].DPA.UPRN)
      return(data.results[0].DPA.UPRN);
    }
  }
}

// web scraping time!

app.get("/test", function(req,res) {
  return "uwu"
});

app.get("/bins/:address", function(req, res) {
  urpn = get_urpn(req.params.address);
  axios.get("http://mydurham.durham.gov.uk/article/12690?uprn=" + uprn) .then((response) => {
      if(response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      let page = $("#page_PageContentHolder_template_pnlArticleBody").html();
      console.log(page);
  }
  }, (error) => console.log(err) );
});


module.exports = app;
