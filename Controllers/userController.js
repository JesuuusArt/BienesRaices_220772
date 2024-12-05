import { check, validationResult } from "express-validator"
import bcrypt from 'bcrypt'

import User from "../Models/Users.js"
import { generateId } from "../helpers/tokens.js"
import { registerEmail, passwordRecoveryEmail } from '../helpers/emails.js'

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
    await check('nombre').notEmpty().withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> El nombre no puede ir vacío').run(req)
    await check('email').isEmail().withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> El correo no puede ir vacío').run(req)
    await check('birthDate').isISO8601().withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> La fecha de nacimiento debe ser válida').run(req)
    await check('password').isLength({ min: 8 }).withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> La contraseña debe ser de al menos 8 caracteres').run(req)
    await check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> Las contraseñas no coinciden').run(req)

    let result = validationResult(req)

    if(!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
                birthDate: req.body.birthDate
            }
        })
    }

    const { nombre, email, password, birthDate } = req.body

    // Verificar que el usuario no esté duplicado
    const userExist = await User.findOne({ where: { email: email }})
    if(userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya existe' }],
            user: {
                nombre,
                email, 
                birthDate 
            }
        })
    }

    // Crear el usuario en la base de datos
    const user = await User.create({
        nombre,
        email,
        password,
        birthDate,
        token: generateId()
    })

    // Enviar email de confirmación
    registerEmail({
        nombre: user.nombre,
        email: user.email,
        token: user.token
    })

    // Mostrar mensaje de confirmación
    res.render('templates/mesage', {
        page: 'Cuenta Creada Correctamente', 
        mesage: 'Se ha enviado un correo de confirmación a su dirección. Por favor, revise su bandeja de entrada para completar el proceso.'
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
    confirmUser.confirm = 1
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

    await check('email').notEmpty().withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;"/> El correo no debe estar vacio').isEmail().withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;"/> El correo no tiene el formato adecuado: example@dominio.extension').run(req)
    
    let result = validationResult(req)

    // ? Verificar que el resultado este vacio
    if(!result.isEmpty()) {
        return res.render('auth/passwordRecovery', {
            page: 'Error al intentar resetear la contraseña',
            csrfToken: req.csrfToken(),
            errores: result.array(),
        })
    }

    // ? Buscar el usuario
    const { email : email } = req.body

    const user = await User.findOne({ where: {email, confirm:1} })

    if(!user) {
        return res.render('auth/passwordRecovery', {
            page: 'Error, no existe una cuenta autentificada asociada al correo electrónico ingresado',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'Por favor revisa los datos e intentalo de nuevo'}],
            user : { email : email}
        })
    }
    
    user.password = "";
    user.token = generateId();
    user.save();

    // ? Enviar el email
    passwordRecoveryEmail({
        name: user.name,
        email: user.email,
        token: user.token
    })


    // ? Renderizar el mensaje 
    // ? Mostrar mensaje de confirmacion
    res.render('templates/mesage', {
        page: 'Recupera tu Contraseña', 
        mesage: 'Hemos enviado un correo a: <Agregar email del usuario>  para la la actualización de tu contraseña'
    })
}

const checkToken = async(req, res)=>{

    const {token} = req.params;
    const userTokenOwner = await User.findOne({where :{token}})

    if(!userTokenOwner) { 
        res.render('templates/mesage', {
            csrfToken: req.csrfToken(),
            page: 'Error',
            msg: 'El token ha expirado o no existe.'
        })
    }

    res.render('auth/resetPassword', {
        csrfToken: req.csrfToken(),
        page: 'Restablece tu password',
        msg: 'Por favor ingresa tu nueva contraseña'
    })
}

const newPassword = async (req, res) => {
    // ? Validar contraseña
    await check('password').notEmpty().withMessage('El campo contraseña es obligatorio').isLength({ min: 8 }).withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> La contraseña debe ser de al menos 8 caracteres').run(req)
    await check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('<img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-right: 5px; display: inline-block;" /> Las contraseñas no coinciden').run(req)

    let result = validationResult(req);

    // ? Verificar que el resultado esté vacío
    if(!result.isEmpty()) {
        return res.render('auth/resetPassword', {  
            page: 'Error al intentar crear la Cuenta de Usuario',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            token: req.body.token
        });
    }

    // ? Actualizar en BD el pass 

    const userTokenOwner = await User.findOne({where: {token}}) 
    userTokenOwner.password = req.body.password;
    userTokenOwner.token = null;
    userTokenOwner.save();  // ? update tb_users set password=new_pasword where token=token;

    //Renderizar la respuesta
    res.render('auth/accountConfirmed', {
        page: 'Excelente..!',
        msg: 'Tu contraseña ha sido confirmada de manera exitosa.',
        error: false
    })  
};

export {
    formularioLogin, formularioRegister, register, confirmAccount, formularioPasswordRecovery, resetPassword, checkToken, newPassword
}