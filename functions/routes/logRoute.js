const express = require("express");
const fs = require("fs");
const router = express.Router();

router.use(
  (timeLog = (req, res, next) => {
    console.log("Time: ", Date.now());
    next();
  })
);

router.get("/", (re, res) => {
  res.redirect(301, "/phoneskill/log");
});

router.get("/phoneskill/log", (req, res) => {
  res.render("index", {
    data: {
      author: "RAJU GAUTAM"
    }
  });
});

router.get("/phoneskill/log/googleeb8767d58e4eb427.html", (req, res) => {
  const data = fs.readFileSync(
    "webmaster/googleeb8767d58e4eb427.html",
    "utf-8"
  );
  res.status(200).send(data);
});

module.exports = router;
