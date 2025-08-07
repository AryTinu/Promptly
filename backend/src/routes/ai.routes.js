const express = require("express");
const router = express.Router();
const { getResponse } = require("../controllers/ai.controller");

router.get("/get-response", getResponse);

module.exports = router;