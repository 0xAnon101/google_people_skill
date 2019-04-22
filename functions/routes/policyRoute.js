const express = require("express");
const router = express.Router();

router.use(
  (timeLog = (req, res, next) => {
    console.log("Time: ", Date.now());
    next();
  })
);

router.get("/", (re, res) => {
  res.render("privacy");
});

module.exports = router;
