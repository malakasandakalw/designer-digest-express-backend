const express = require('express');
const router = express.Router();
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsEmployerValidator = require("../middlewares/IsEmployerValidator");

const vacancyController = require("../controllers/vacancy-controller");

router.post("/create", TokenAuthenticator, IsEmployerValidator, vacancyController.createVacancy)
router.get("/get-vacancies-by-employer", TokenAuthenticator, IsEmployerValidator, vacancyController.getByEmployer)
router.get("/get-by-id",  vacancyController.getById)
router.get("/get-full-by-id",  vacancyController.getFullById)



module.exports = router;