import User from "../Models/users.js"

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
    const user = await User.create(req.body);
    res.json(user)
}

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page : 'Recupera tu contraseña'
    })
}

export {
    formularioLogin, formularioRegister, formularioPasswordRecovery, register
}