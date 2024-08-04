const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();

const categoryController = require("../controllers/category-controller");

router.get("/all", categoryController.getAll);

module.exports = router;