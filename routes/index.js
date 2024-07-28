const express = require("express");
const router = express.Router();

const userRoutes = require("./user-routes");
const designerRoutes = require("./designer-routes")

router.use("/users", userRoutes);
router.use("/designers", designerRoutes);

module.exports = router;