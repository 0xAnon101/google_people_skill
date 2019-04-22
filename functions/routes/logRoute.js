const express = require("express");
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

module.exports = router;
