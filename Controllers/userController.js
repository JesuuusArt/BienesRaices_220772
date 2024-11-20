import { check, validationResult } from "express-validator"
import User from "../Models/Users.js"
import { generateId } from "../helpers/tokens.js"
import { registerEmail} from '../helpers/emails.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        page : 'Inicia Sesion'
    })
}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
    })
}

const register = async (req, res) => { 

    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacio').run(req)
    await check('email').isEmail().withMessage('El correo no puede ir vacio').run(req)
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(req)
    await check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let result = validationResult(req)

    // ? Verificar que el resultado este vacio
    if(!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
            }
        })
    }

// ? Extraer datos
const { nombre, email, password} = req.body

    // ? Verificar que el usuario no este duplicado
    const userExist = await User.findOne({ where: {email : email }})
    
    if(userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya existe'}],
            usuer: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // ? Almacenar un usuario
    const user = await User.create({
        nombre,
        email,
        password,
        token: generateId()
    })

    // ? Envia email de confirmacion
    registerEmail({
        nombre: user.nombre,
        email: user.email,
        token: user.token
    })



    // ? Mostrar mensaje de confirmacion
    res.render('templates/mesage', {
        page: 'Cuenta Creada Correctamente', 
        mesage: 'Hemos enviado un correo de confirmacion, presiona el enlace'
    })
}

// ? Funcion que comprueba una cuenta
const confirmAccount = async (req, res) => {

    const { token } = req.params

    // ? Verificar si el token es valido
    const confirmUser = await User.findOne({ where : {token}})
    
    if(!confirmUser) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu Cuenta',
            mesage: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true,
        })
    }

    // ? Confirmar la cuenta
    confirmUser.token = null
    confirmUser.confirmAccount = true
    await confirmUser.save()

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        mesage: 'La cuenta se confirmo correctamente',
    })

}

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page : 'Recupera tu contraseña'
    })
}

export {
    formularioLogin, formularioRegister, formularioPasswordRecovery, register, confirmAccount
}