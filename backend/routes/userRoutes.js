const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get("/getusers", userController.getUsers);

module.exports = router;