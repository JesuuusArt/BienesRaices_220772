import { check, validationResult } from "express-validator"
import bcrypt from 'bcrypt'

import User from "../Models/Users.js"
import { generateId } from "../helpers/tokens.js"
import { registerEmail, passwordRecoveryEmail} from '../helpers/emails.js'

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
            user: {
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
        page : 'Recupera tu contraseña',
        csrfToken: req.csrfToken()
    })
}

const resetPassword = async (req, res) => {

    // ? Validacion
    await check('email').isEmail().withMessage('El correo no puede ir vacio').run(req)

    let result = validationResult(req)

    // ? Verificar que el resultado este vacio
    if(!result.isEmpty()) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu contraseña',
            csrfToken: req.csrfToken(),
            errores: result.array(),
        })
    }

    // ? Buscar el usuario

    const { email } = req.body
    const user = await User.findOne({ where: {email} })

    if(!user) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu contraseña',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El email no existe'}],
        })
    }

    // ? Generar un Token y enviar el email

    user.token = generateId()
    await user.save()

    // ? Enviar el email

    passwordRecoveryEmail({
        email: user.email,
        nombre: user.nombre,
        token: user.token
    })

    // ? Renderizar el mensaje 
    // ? Mostrar mensaje de confirmacion
    res.render('templates/mesage', {
        page: 'Recupera tu Contrasela', 
        mesage: 'Hemos enviado un correo con las instrucciones para recuperar tu contraseña, presiona el enlace'
    })

}

const checkToken = async (req, res) => {

    const { token } = req.params
    const user = await User.findOne({ where: {token}})

    if(!user){
        return res.render('auth/confirmAccount', {
            page: 'Restablece tu Contraseña',
            mesage: 'Hubo un error al validar tu informacion, intenta de nuevo',
            error: true,
        })
    }

    // ? Mostrar formulario para modificar la contraseña
    res.render('auth/resetPassword', {
        page: 'Recupera tu Contraseña',
        csrfToken: req.csrfToken(),
    })

}

const newPassword = async (req, res) => {
    // ? Validar contraseña
    await check('newPassword').isLength({ min: 8 }).withMessage('La contraseña debe ser de al menos 8 caracteres').run(req);

    let result = validationResult(req);

    // ? Verificar que el resultado esté vacío
    if(!result.isEmpty()) {
        return res.render('auth/resetPassword', {  
            page: 'Recupera tu contraseña',
            csrfToken: req.csrfToken(),
            errores: result.array(),
        });
    }

    const { token } = req.params;
    const { newPassword } = req.body;

    // ? Identificar quien hace el cambio
    const user = await User.findOne({ where: {token}});

    if(!user) {
        return res.render('auth/resetPassword', {  
            page: 'Recupera tu Contraseña',
            mesage: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true,
        });
    }

    // ? Hashear nueva contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.token = null;

    await user.save();

    res.render('auth/confirmAccount', {
        page: 'Contraseña Recuperada',
        mesage: 'La contraseña se recuperó correctamente'
    });
};



export {
    formularioLogin, formularioRegister, register, confirmAccount, formularioPasswordRecovery, resetPassword, checkToken, newPassword
}