const express = require('express');
const router = express.Router();
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsDesignerValidator = require("../middlewares/IsDesignerValidator");

const postsController = require("../controllers/posts-controller");

router.post("/create", TokenAuthenticator, IsDesignerValidator, postsController.createPost)
router.post("/upvote", TokenAuthenticator, postsController.upvote)
router.get("/get-posts", postsController.getPosts)
router.get("/get-by-designer", TokenAuthenticator, IsDesignerValidator, postsController.getByDesigner)
router.get("/get-by-id", TokenAuthenticator, IsDesignerValidator, postsController.getById)
router.get("/get-full-by-id", postsController.getFullById)

module.exports = router;