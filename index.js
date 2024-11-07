import express from 'express';
import generalRoutes from './routes/generalRoutes.js';
import userRoutes from './routes/userRoutes.js';
import db from './db/config.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', './Views');  // Cambiado a minúsculas

app.use(express.static('public'));
app.use(express.json());  // Habilitado para procesar JSON
app.use(express.urlencoded({ extended: true }));  // Para datos de formularios

app.use(express.static("./public"))
try {
    await db.authenticate();
    db.sync();
    console.log("Conexión correcta a la base de datos");
} catch (error) {
    console.error("Error en la conexión a la base de datos:", error);
}

const port = 3000;

app.use('/', generalRoutes);
app.use('/', userRoutes);

app.listen(port, () =>
    console.log(`La aplicación ha iniciado en el puerto: ${port}`)
);
