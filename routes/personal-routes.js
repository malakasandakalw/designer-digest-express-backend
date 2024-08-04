const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();

const personalController = require("../controllers/personal-controller");

router.post("/convert-to-designer", TokenAuthenticator, personalController.convertToDesigner)

module.exports = router;