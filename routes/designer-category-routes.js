const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();

const designerCategoryController = require("../controllers/designer-category-controller");

router.get("/all", designerCategoryController.getAll);

module.exports = router;