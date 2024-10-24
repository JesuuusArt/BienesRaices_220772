const formularioLogin = (req, res) => {
    res.render('auth/login', {
        
    })
}

const formularioRegister = (req, res) => {
    res.render('auth/register', {
        
    })
}

const formularioPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        
    })
}

export {
    formularioLogin, formularioRegister, formularioPasswordRecovery
}
