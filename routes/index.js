const express = require("express");
const router = express.Router();

const userRoutes = require("./user-routes");
const designerRoutes = require("./designer-routes")
const categoryRoutes = require("./category-routes")
const designerCategoryRoutes = require("./designer-category-routes")
const personalRoutes = require("./personal-routes")
const locationsRoutes = require("./locations-router")
const postsRoutes = require("./posts-routes")
const fileManagerRoutes = require("./file-manager-routes")
const BodyParser = require("../middlewares/BodyParser")

router.use("/users", BodyParser, userRoutes);
router.use("/designers", BodyParser, designerRoutes);
router.use("/personal", BodyParser, personalRoutes);
router.use("/category", BodyParser, categoryRoutes);
router.use("/designer-category", BodyParser, designerCategoryRoutes);
router.use("/locations", BodyParser, locationsRoutes);
router.use("/posts", BodyParser, postsRoutes);
router.use("/file-manager", BodyParser, fileManagerRoutes)

module.exports = router;