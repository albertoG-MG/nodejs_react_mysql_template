const express = require('express');
const router = express.Router();
const subrolController = require('../controllers/subrolController');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/getsubrolesxrolxusuarios", authMiddleware, subrolController.getSubrolesxRolxUsuarios);

module.exports = router;