const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();
const designerController = require("../controllers/designer-controller");

router.get("/get-all-designers", designerController.getAllDesigners);

module.exports = router;