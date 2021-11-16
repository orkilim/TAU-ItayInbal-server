const express = require("express");
const router = express.Router()
const controller = require('./controller');
const controller1=require('./controller1')

router.post('/create-form', controller1.createForm);
router.get('/get-form', controller1.getForm);
router.post('/save-answers', controller1.saveAnswers);
router.get('/get-answers', controller1.getAnswers);

//router.get('/getForms', controller.getForms);
//router.post('/handleData',controller1.handleData)
//router.get('/getJSONS',controller1.getJSONS)
//router.put('/editForm', controller.editForm);
//router.post('/signup', womanController.signup);
//router.post('/login', womanController.login);


module.exports = router;