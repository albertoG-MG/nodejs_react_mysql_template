const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');
const authMiddleware = require('../middleware/authMiddleware');

router.get("/getdepartamentosxrolxusuarios", authMiddleware, departamentoController.getDepartamentoxRolxUsuarios);

module.exports = router;