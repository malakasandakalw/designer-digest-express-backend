const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller");
const UserSignUpRequestValidate = require("../middlewares/UserSignUpRequestValidate");
const UserSignUpAlreadyExists = require("../middlewares/UserSignUpAlreadyExists");
const UserLoginExists = require("../middlewares/UserLoginExists");
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');

router.get("/", userController.getUserByEmail);
router.post("/verify", TokenAuthenticator, userController.verify);
router.post("/signup", UserSignUpRequestValidate, UserSignUpAlreadyExists, userController.createUser);
router.post("/login", UserLoginExists, userController.login)

module.exports = router;