import jwt from 'jsonwebtoken'

const generateJWT = id => jwt.sign(
    {
        id, // ID del usuario
        developerName: 'Jesus Alejandro Artiaga Morales',
        empresa: 'Universidad Tecnológica de Xicotepec de Juárez',
        tecnologias: 'Node.js'
    },
    process.env.JWT_SECRET, // Clave secreta desde el entorno
    {
        expiresIn: '1h' // Token válido por 1 hora
    }
)

const generateId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)

export {generateJWT, generateId}