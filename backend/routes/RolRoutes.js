const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/getrolesxusuarios", authMiddleware, rolController.getRolesxUsuarios);

module.exports = router;