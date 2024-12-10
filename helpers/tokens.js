import jwt from 'jsonwebtoken'

const generateToken = id => jwt.sign ({id : datos.id, nombre: datos.nombre}, process.env.JWT_SECRET , {
    expiresIn: id
})

const generateId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

export {generateToken, generateId}