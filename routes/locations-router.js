const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();

const locationsController = require("../controllers/locations");

router.get("/all", locationsController.getAll);

module.exports = router;