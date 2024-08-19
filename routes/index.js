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
const chatsRoutes = require("./chats-routes")

router.use("/users", userRoutes);
router.use("/designers", designerRoutes);
router.use("/personal", personalRoutes);
router.use("/category", categoryRoutes);
router.use("/designer-category", designerCategoryRoutes);
router.use("/locations", locationsRoutes);
router.use("/posts", postsRoutes);
router.use("/file-manager", fileManagerRoutes)
router.use("/chats", chatsRoutes)

module.exports = router;