const express = require("express");
const router = express.Router();
const controller = require('../controller');

router.post('/addNewFormSchema', controller.addForm);
router.put('/editForm', controller.editForm);
router.get('/getForm', controller.getForm);

//router.post('/signup', womanController.signup);
//router.post('/login', womanController.login);


module.exports = router;