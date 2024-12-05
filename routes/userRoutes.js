import express from 'express'
import { formularioLogin, formularioRegister, register, confirmAccount, formularioPasswordRecovery, resetPassword, checkToken, newPassword } from '../Controllers/userController.js'

const router = express.Router()

// ? GET 
// ? ":" En una ruta define de manera posicional los parametros de entrada
router.get("/findById/:id", function(req, res){
    res.send(`Se esta solicitando buscar al usuario con ID: ${req.params.id}`)
})

// ? POST - Se utiliza para el envio de datos e informacion de cliente al servidor
router.post("/newUser/:name/:email/:password", function(req, res){
    res.send(`Se ha solicitado la creacion de un nuevo usuario de nombre: ${req.params.name}, asociado con el correo electronico: ${req.params.email} y con la contraseña: ${req.params.password}`)
})

// ? PUT - Se utiliza para la actualizacion total de informacion del cliente al servidor
router.put("/replaceUserByEmail/:name/:email/:password", function(req, res){
    res.send(`Se ha solicitando el reemplazo de toda la informacion del usuario: ${req.params.name}, con correo: ${req.params.email} y con la contraseña: ${req.params.password}`)
})

// ? PATCH - Se utiliza para la actualizacion de datos por propiedades o separados
router.patch("/updatePassword/:email/:newPassword/:newPasswordConfirm", function(req, res) {
    const { email, newPassword, newPasswordConfirm } = req.params;

    if (newPassword === newPasswordConfirm) {
        res.send(`Se ha aceptado la actualización de la contraseña del usuario con correo: ${email} con la nueva contraseña: ${newPassword} ya que coincide con su confirmación.`);
    } else {
        res.send(`Se ha negado la actualización de la contraseña del usuario con correo: ${email} ya que la nueva contraseña "${newPassword}" y la confirmación de la contraseña "${newPasswordConfirm}" no coinciden.`);
    }
});

// ? DELETE 
router.delete("/deleteUser/:email", function(req, res){
    res.send(`Se ha solicitado la eliminacion del usuario con el correo: ${req.params.email}`)
})

// ? Aqui se estan creando las rutas
router.get("/login", formularioLogin) // ? middleware
router.get("/register", formularioRegister)  

router.post("/register", register)

router.get("/confirmAccount/:token", confirmAccount)

router.get("/passwordRecovery", formularioPasswordRecovery)

router.post("/passwordRecovery", resetPassword)

// ? Almacena la nueva contraseña
router.get('/passwordRecovery/:token', checkToken)
router.post('/passwordRecovery/:token', newPassword)

export default router
