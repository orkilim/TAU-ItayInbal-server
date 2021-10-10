const express = require("express");
const router = express.Router()
const controller = require('./controller');

router.get('/getForms', controller.getForms);
router.post('/addForm', controller.addForm);
//router.put('/editForm', controller.editForm);

//router.post('/signup', womanController.signup);
//router.post('/login', womanController.login);


module.exports = router;