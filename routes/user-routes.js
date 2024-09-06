const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller");
const UserSignUpRequestValidate = require("../middlewares/UserSignUpRequestValidate");
const UserSignUpAlreadyExists = require("../middlewares/UserSignUpAlreadyExists");
const UserLoginExists = require("../middlewares/UserLoginExists");
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');

router.get("/get-by-id", userController.getById);
router.get("/get-all-users", userController.getAllUsers);
router.get("/", userController.getUserByEmail);
router.post("/verify", TokenAuthenticator, userController.verify);
router.post("/signup", UserSignUpRequestValidate, UserSignUpAlreadyExists, userController.createUser);
router.post("/login", UserLoginExists, userController.login)
router.post("/reset-password", TokenAuthenticator, userController.resetPassword)
router.post("/update", TokenAuthenticator, userController.update)


module.exports = router;