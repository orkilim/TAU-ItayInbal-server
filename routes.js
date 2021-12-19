const express = require("express");
const router = express.Router()
const controller = require('./controller');

//routes for each API request type
router.post('/create-form', controller.createForm);
router.get('/get-form', controller.getForm);
router.post('/save-results', controller.saveAnswers);
router.get('/get-results', controller.getAnswers);
router.get('/get-forms-names',controller.getNames)
router.get('/test',controller.test)

module.exports = router;