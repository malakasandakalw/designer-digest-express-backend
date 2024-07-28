const express = require('express');
const router = express.Router();

const userController = require("../controllers/user-controller");
const UserSignUpRequestValidate = require("../middlewares/UserSignUpRequestValidate");
const CheckUserAlreadyExists = require("../middlewares/CheckUserAlreadyExists");

router.get("/", userController.getUserByEmail);
router.post("/signup", UserSignUpRequestValidate, CheckUserAlreadyExists, userController.createUser);

module.exports = router;