import { check, validationResult } from "express-validator";
import User from "../Models/Users.js";
import { generateId } from "../helpers/tokens.js";
import { registerEmail, passwordRecoveryEmail } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        page: 'Inicia Sesión'
    });
};

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        page: 'Crear Cuenta',
        csrfToken: req.csrfToken(),
    });
};

const register = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre no puede ir vacío').run(req);
    await check('email').isEmail().withMessage('El correo no es válido').run(req);
    await check('birthDate').isISO8601().withMessage('La fecha de nacimiento debe ser válida').run(req);
    await check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req);
    await check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden').run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: result.array(),
            user: {
                nombre: req.body.nombre,
                email: req.body.email,
                birthDate: req.body.birthDate
            }
        });
    }

    const { nombre, email, password, birthDate } = req.body;

    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
        return res.render('auth/register', {
            page: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya existe' }],
            user: { nombre, email, birthDate }
        });
    }

    const user = await User.create({
        nombre,
        email,
        password,
        birthDate,
        token: generateId()
    });

    registerEmail({
        nombre: user.nombre,
        email: user.email,
        token: user.token
    });

    res.render('templates/mesage', {
        page: 'Cuenta Creada Correctamente',
        mesage: 'Se ha enviado un correo de confirmación a su dirección. Revise su bandeja de entrada.'
    });
};

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    // Verificar que el token no es undefined o null
    if (!token) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta',
            mesage: 'Token inválido',
            error: true,
        });
    }

    const confirmUser = await User.findOne({ where: { token } });

    if (!confirmUser) {
        return res.render('auth/confirmAccount', {
            page: 'Error al confirmar tu cuenta',
            mesage: 'Hubo un error al confirmar tu cuenta, intenta de nuevo',
            error: true,
        });
    }

    confirmUser.token = null;
    confirmUser.confirm = true;
    await confirmUser.save();

    res.render('auth/confirmAccount', {
        page: 'Cuenta Confirmada',
        mesage: 'La cuenta se confirmó correctamente',
    });
};

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page: 'Recupera tu contraseña',
        csrfToken: req.csrfToken()
    });
};

const resetPassword = async (req, res) => {
    await check('email').isEmail().withMessage('El correo no tiene un formato válido').run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu contraseña',
            csrfToken: req.csrfToken(),
            errores: result.array(),
        });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.render('auth/passwordRecovery', {
            page: 'Recupera tu contraseña',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'No existe una cuenta asociada a ese correo' }],
            user: { email }
        });
    }

    // Verificar si la cuenta no está confirmada
    if (!user.confirm) {
        return res.render('auth/passwordRecovery', {
            page: 'Cuenta no confirmada',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'La cuenta aún no ha sido confirmada. Por favor, revisa tu correo para confirmar tu cuenta.' }],
            user: { email }
        });
    }

    // Generar token de recuperación
    user.token = generateId();
    await user.save();

    // Enviar correo de recuperación
    passwordRecoveryEmail({
        nombre: user.nombre,
        email: user.email,
        token: user.token
    });

    res.render('templates/mesage', {
        page: 'Recupera tu contraseña',
        mesage: `Hemos enviado un correo a ${user.email} para actualizar tu contraseña.`
    });
};


const checkToken = async (req, res) => {

    const {token} = req.params;
    const userTokenOwner = await User.findOne({where :{token}})

    if(!userTokenOwner)
        { 
            res.render('templates/message', {
                csrfToken: req.csrfToken(),
                page: 'Error al intentar cambiar la contraseña',
                mesage: 'El token ha expirado o no existe.'
            })
        }

    res.render('auth/resetPassword', {
        csrfToken: req.csrfToken(),
        page: 'Restablece tu contraseña',
        mesage: 'Por favor ingresa tu nueva contraseña'
    })
};

const newPassword = async (req, res) => {
    const { token } = req.params;
    
    await check('newPassword').notEmpty().withMessage("La contraseña es un campo obligatorio.").isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres').run(req);
    await check('confirmPassword').custom((value, { req }) => value === req.body.newPassword).withMessage('Las contraseñas no coinciden').run(req);

    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.render("auth/resetPassword", {
            page: 'Error al intentar cambiar la contraseña',
            errores: result.array(),
            csrfToken: req.csrfToken(),
            token: token
        });
    }

    try {
        // ? Actualizar en BD el pass 
        const userTokenOwner = await User.findOne({ where: { token } });

        if (!userTokenOwner) {
            return res.render('auth/resetPassword', {
                page: 'Error al actualizar la contraseña',
                errores: [{ msg: 'Usuario no encontrado o token inválido.' }],
                csrfToken: req.csrfToken(),
                token: token 
            });
        }

        userTokenOwner.password = req.body.newPassword;
        userTokenOwner.token = null;
        await userTokenOwner.save(); 

        // Renderizar la respuesta
        res.render('auth/confirmAccount', {
            page: 'Contraseña cambiada correctamente',
            mesage: 'Tu contraseña ha sido confirmada de manera exitosa.',
            error: false
        });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).render('auth/resetpassword', {
            page: 'Error al actualizar la contraseña',
            errores: [{ msg: 'Ocurrió un error inesperado. Por favor intenta nuevamente.' }],
            csrfToken: req.csrfToken(),
            token: token 
        });
    }
}

export {
    formularioLogin,
    formularioRegister,
    register,
    confirmAccount,
    formularioPasswordRecovery,
    resetPassword,
    checkToken,
    newPassword
};
