const express = require('express');
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsDesignerValidator = require("../middlewares/IsDesignerValidator");
const multer = require('multer')

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB file size limit
});

const postsController = require("../controllers/posts-controller");

router.post("/create", TokenAuthenticator, IsDesignerValidator, upload.array('files'), postsController.createPost)

module.exports = router;