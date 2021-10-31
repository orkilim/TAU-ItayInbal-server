const express = require("express");
const router = express.Router()
const controller = require('./controller');
const controller1=require('./controller1')

//router.get('/getForms', controller.getForms);
router.post('/createForm', controller1.createForm);
//router.post('/handleData',controller1.handleData)
router.get('/getForm', controller1.getForm);
router.get('/getJSONS',controller1.getJSONS)
//router.put('/editForm', controller.editForm);
//router.post('/signup', womanController.signup);
//router.post('/login', womanController.login);


module.exports = router;