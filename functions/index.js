const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors")({ origin: true });
const serviceAccount = require("./serviceAccountKey.json");
const engines = require("consolidate");
const Handlebars = require("handlebars");
const path = require("path");
const fs = require("fs");

const app = express();
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");
Handlebars.registerPartial(
  "partial",
  fs.readFileSync(path.join(__dirname, "/views/partials/partial.hbs"), "utf8")
);

app.use(cors);
app.get("/", (request, response) => {
  console.log.log(request);
  response.render("index", {
    data: {
      author: "RAJU GAUTAM"
    }
  });
});

app.get("/cached", (request, response) => {
  console.log(request);
  response.set("Cache-Control", "public, max-age=300, s-maxage=600");
  response.render("index", {
    data: {
      author: "RAJU GAUTAM"
    }
  });
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  console.log("req", request);
  response.send("Hello from Ray!");
});
