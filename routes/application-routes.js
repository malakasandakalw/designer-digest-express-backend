const express = require('express');
const router = express.Router();
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsDesignerValidator = require('../middlewares/IsDesignerValidator');
const applicationController = require("../controllers/application-controller");

router.post("/create", TokenAuthenticator, IsDesignerValidator, applicationController.createApplication)
router.post("/update", TokenAuthenticator, IsDesignerValidator, applicationController.updateApplication)


module.exports = router;