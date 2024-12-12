import express from 'express'
import csurf from 'csurf'
import cookieParser from 'cookie-parser'

import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
import propertiesRotes from './routes/propertiesRoutes.js'
import db from './db/config.js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// ? Crear la app
const app = express()

app.set('view engine', 'pug')
app.set('views', './Views')

app.use(express.static('public'))
app.use(express.json()); 

// ? Habilitar la lectura de los datos de un formulario
app.use(express.urlencoded({ extended: true }))

// ? Habilitar cookie Parser
app.use(cookieParser())

// ? Habilitar CSRF
app.use(csurf({ cookie: true }))

app.use(express.static('./public'))

try {
    await db.authenticate()
    db.sync()
    console.log('Conexión correcta a la base de datos')
} catch (error) {
    console.error('Error en la conexión a la base de datos:', error)
}

app.use('/', propertiesRotes)
app.use('/auth', userRoutes)

const port = process.env.PORT
app.listen(port, () =>
    console.log(`La aplicación ha iniciado en el puerto: ${port}`)
)
