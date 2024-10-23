import express from 'express'

const router = express.Router()

router.get("/", function(req, res){
    res.send("Hola desde la web en NodeJS")
})

router.get("/quienEres", function(req, res){
    res.json({
        "nombre" : "Jesus Alejandro Artiaga Morales",
        "carrera" : "TI DSM",
        "grado" : "4",
        "grupo" : "A"
    })
})

export default router;  // ? Esta palabra reservada nos permite exportar los elementos a otros archivos