const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsPersonalValidator = require('../middlewares/IsPersonalValidator')
const router = express.Router();

const personalController = require("../controllers/personal-controller");

router.post("/update-profile-data", TokenAuthenticator, IsPersonalValidator, personalController.updateProfile)
router.post("/convert-to-designer", TokenAuthenticator, IsPersonalValidator, personalController.convertToDesigner)
router.post("/convert-to-employer", TokenAuthenticator, IsPersonalValidator, personalController.convertToEmployer)

module.exports = router;