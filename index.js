import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
import db from "./db/config.js"

// ? Ejemplo de activacion de HOT RELOAD
//console.log("Hola desde NodeJS, esto esta en hot reload")

//const express = require(`express`) // ? Usando CommonJS
// ? Importar la libreria para crear un servidor web - CommonJS / ECMA Script 6
// ? Instanciar nuestra aplicacion web
import express from 'express'

const app = express()
app.set('view engine', 'pug')
app.set('Views', '/.Views')

// ? Carpeta publica de recursos estaticos (assets)
app.use(express.static('public'))

// ? Conexion a la base de datos
try {
    await db.authenticate()
    console.log("Conexion correcta a la base de datos")
} catch (error) {
    
}

const port = 3000

app.listen(port, () =>
    console.log(`La aplicacion ha iniciado en el puerto: ${port}`))

// ? Routing - Enrutacion para peticiones
app.use('/', generalRoutes) // ? Importando de las rutas del archivo generalRoutes.js
app.use('/', userRoutes) // ? Importando de las rutas del archivo userRoutes.js