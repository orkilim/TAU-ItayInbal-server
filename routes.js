const express = require("express");
const router = express.Router()
const controller = require('./controller');
const controller1=require('./controller1')

router.get('/getForms', controller.getForms);
router.post('/createForm', controller1.createForm);

//router.get('/getForms', controller1.getForms);

//router.put('/editForm', controller.editForm);
//router.post('/signup', womanController.signup);
//router.post('/login', womanController.login);


module.exports = router;