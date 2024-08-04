const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsPersonalValidator = require('../middlewares/IsPersonalValidator')
const router = express.Router();

const personalController = require("../controllers/personal-controller");

router.post("/convert-to-designer", TokenAuthenticator, IsPersonalValidator, personalController.convertToDesigner)

module.exports = router;