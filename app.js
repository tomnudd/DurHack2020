const express = require("express");
const app = express();
const session = require("express-session");
const fetch = require("node-fetch");
const axios = require("axios");
const cheerio = require("cheerio");

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

// web scraping time!

app.get("/bins/:address", async function(req, res) {
  uprn = await get_uprn(req.params.address);
  axios.get("http://mydurham.durham.gov.uk/article/12690?uprn=" + uprn) .then((response) => {
      if(response.status === 200) {
      const html = response.data;
      let $ = cheerio.load(html);
      let page = $("#page_PageContentHolder_template_pnlArticleBody").html();
      $ = cheerio.load(page);
      let rubbish_date = $("p:nth-of-type(2)").html();
      let recycling_date = $("p:nth-of-type(3)").html();
      return ([rubbish_date, recycling_date]);
  }
  }, (error) => console.log(err) );
});


module.exports = app;
