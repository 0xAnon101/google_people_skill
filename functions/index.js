const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const cors = require("cors")({ origin: true });
const serviceAccount = require("./serviceAccountKey.json");
const logRouter = require("./routes/logRoute");
const policyRouter = require("./routes/policyRoute");

const app = express();
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG);
adminConfig.credential = admin.credential.cert(serviceAccount);
admin.initializeApp(adminConfig);

/**view engine set */
app.set("views", "./views");
app.set("view engine", "hbs");
const hbs = exphbs.create({
  defaultLayout: "main.hbs",
  partialsDir: ["views/partials/"]
});
app.engine("hbs", hbs.engine);

/**middlewares  */
app.use(cors);

app.get("/auth/handler", (req, res) => {
  console.log(req, "////");
  res.send("hahahhah");
});

app.get("/__/auth/handler", (req, res) => {
  console.log(req, "////");
  res.send("hahahhah");
});
app.use("/", logRouter);
app.use("/privacyPolicy", policyRouter);
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "/assets/404.png"));
});

/**export the instance on each cloud function request */
exports.app = functions.https.onRequest(app);
