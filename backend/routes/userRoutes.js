const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserData } = require('../middleware/usuarios/crearUsuariosMiddleware');
const multer = require('multer');
const upload = multer(); 

router.post("/login", userController.login);
router.get("/getusers", authMiddleware, userController.getUsers);
router.get("/checarusuario", authMiddleware, userController.checarUsuarios);
router.get("/checarpassword", authMiddleware, userController.checarPassword);
router.get("/checarcorreo", authMiddleware, userController.checarCorreo);
router.post("/crearusuario", authMiddleware, upload.single('foto'), validateUserData, userController.crearUsuario);

module.exports = router;