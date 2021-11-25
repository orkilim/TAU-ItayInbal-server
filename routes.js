const express = require("express");
const router = express.Router()
const controller = require('./controller');
const controller1=require('./controller1')

router.post('/create-form', controller1.createForm);
router.get('/get-form', controller1.getForm);
router.post('/save-results', controller1.saveAnswers);
router.get('/get-results', controller1.getAnswers);


module.exports = router;