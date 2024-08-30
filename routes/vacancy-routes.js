const express = require('express');
const router = express.Router();
const TokenAuthenticator = require('../middlewares/TokenAuthenticator');
const IsEmployerValidator = require("../middlewares/IsEmployerValidator");

const vacancyController = require("../controllers/vacancy-controller");
const IsDesignerValidator = require('../middlewares/IsDesignerValidator');

router.post("/create", TokenAuthenticator, IsEmployerValidator, vacancyController.createVacancy)
router.post("/update", TokenAuthenticator, IsEmployerValidator, vacancyController.updateVacancy)
router.get("/get-vacancies-by-employer", TokenAuthenticator, IsEmployerValidator, vacancyController.getByEmployer)
router.get("/get-by-id",  vacancyController.getById)
router.get("/get-full-by-id",  vacancyController.getFullById)
router.get("/get-filtered-vacancies",  vacancyController.getFilteredVacancies)

module.exports = router;