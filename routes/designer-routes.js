const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();

router.get("/", TokenAuthenticator);

module.exports = router;