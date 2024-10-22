const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateUserData } = require('../middleware/usuarios/crearUsuariosMiddleware');
const { validateEditUserData } = require('../middleware/usuarios/editarUsuariosMiddleware');
const multer = require('multer');
const upload = multer(); 

router.post("/login", userController.login);
router.get("/getusers", authMiddleware, userController.getUsers);
router.get("/checarusuario", authMiddleware, userController.checarUsuarios);
router.get("/checarpassword", authMiddleware, userController.checarPassword);
router.get("/checarcorreo", authMiddleware, userController.checarCorreo);
router.post("/crearusuario", authMiddleware, upload.single('foto'), validateUserData, userController.crearUsuario);
router.get("/getusuarioxid", authMiddleware, userController.editarUsuario);
router.get("/checareditusuario", authMiddleware, userController.checarEditUsuario);
router.get("/checareditpassword", authMiddleware, userController.checarEditPassword);
router.get("/checareditcorreo", authMiddleware, userController.checarEditCorreo);
router.put("/editarusuario/:id", authMiddleware, upload.single('foto'), validateEditUserData, userController.editarUsuarioPage);
router.delete("/eliminarusuario/:id", authMiddleware, userController.eliminarUsuario);

module.exports = router;