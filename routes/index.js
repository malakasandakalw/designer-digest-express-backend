const express = require("express");
const router = express.Router();

const userRoutes = require("./user-routes");
const designerRoutes = require("./designer-routes")
const categoryRoutes = require("./category-routes")
const designerCategoryRoutes = require("./designer-category-routes")
const personalRoutes = require("./personal-routes")

router.use("/users", userRoutes);
router.use("/designers", designerRoutes);
router.use("/personal", personalRoutes);
router.use("/category", categoryRoutes);
router.use("/designer-category", designerCategoryRoutes);

module.exports = router;