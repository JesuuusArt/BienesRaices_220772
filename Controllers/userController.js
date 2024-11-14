import { check, validationResult } from "express-validator"
import User from "../Models/Users.js"
import { where } from "sequelize"

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        page : 'Inicia Sesion'
    })
}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page : 'Crear Cuenta'
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
            errores: [{msg: 'El usuario ya existe'}],
            usuer: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // ? Almacenar un usuario
    await User.create({
        nombre,
        email,
        password,
        token: 123
    })
}

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page : 'Recupera tu contraseña'
    })
}

export {
    formularioLogin, formularioRegister, formularioPasswordRecovery, register
}