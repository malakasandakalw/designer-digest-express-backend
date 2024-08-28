const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const router = express.Router();
const designerController = require("../controllers/designer-controller");

router.get("/get-data-by-designer", designerController.getDataByDesigner);
router.get("/get-all-designers", designerController.getAllDesigners);
router.get("/get-filtered-designers", designerController.getFilteredDesigners);
router.post("/follow", TokenAuthenticator, designerController.follow);

module.exports = router;