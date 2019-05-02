const express = require("express");
const apiCaller = require("../files/apiCaller");
const fs = require("fs");
const router = express.Router();

router.use(
  (timeLog = (req, res, next) => {
    console.log("Time: ", Date.now());
    next();
  })
);



router.get("/", (req, res) => {
  console.log("////");
  res.redirect(301, "/phoneskill/log");
});

router.get("/phoneskill/log", (req, res) => {
  console.log("////ophone/skill");
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    apiCaller.authorize(
      JSON.parse(content),
      apiCaller.listConnectionNames,
      res
    );
    return 1;
  });
});

router.get("/auth/handler", (req, res) => {
  console.log(req,"////");
  res.send("hahahhah");
});



router.get("/phoneskill/log/googleeb8767d58e4eb427.html", (req, res) => {
  const data = fs.readFileSync(
    "webmaster/googleeb8767d58e4eb427.html",
    "utf-8"
  );
  res.status(200).send(data);
});

module.exports = router;
