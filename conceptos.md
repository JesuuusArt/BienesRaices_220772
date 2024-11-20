# Conceptos importantes
Una funcion `call back` tiene 3 cosas, request, response y el next


## npm i
El comando `npm i` instala todas las dependencias listadas en el archivo `package.json`, tanto para ejecución como para desarrollo.

---

## nodemon
`nodemon` reinicia automáticamente el servidor cuando detecta cambios en el código.

---

## End points 
Son las rutas para acceder a las secciones o funciones de nuestra aplicacion web

---

### Ventajas:
- Ahorra tiempo al no tener que reiniciar el servidor manualmente.
- Monitorea cambios en tiempo real.
---

## Puertos en la computadora
Una computadora tiene 65,536 puertos. Los primeros 1,024 están reservados para servicios del sistema. Los puertos comunes para servidores son el 80 (HTTP) y el 443 (HTTPS).

## Rutas y peticiones HTTP
Las rutas definen las respuestas del servidor en una URL. Solo puedes tener una ruta por combinación de método HTTP y camino.

### Métodos HTTP más comunes:
GET: Se utiliza para obtener información del servidor. No debe modificar los datos en el servidor.
POST: Se utiliza para enviar datos al servidor, generalmente para crear o actualizar recursos.

```javascript
app.get('/home', (req, res) => res.send('GET en /home'));
app.post('/home', (req, res) => res.send('POST en /home')); 
```

## Rutas
Todas las rutas que seran para el usuario estaran en el archivo `userRoutes.js`. Se pueden guardar rutas como:
` | newUser | updateUser | deleteUser | login | register | `
Las rutas generales estaran en el archivo `generalRoutes.js`. Se pueden guardar rutas como:
` | Propiedades mas vendidas | index | inicio | ingresarPropiedad |`

## const router = express.Router()
Este objeto permite definir rutas y manejar la lógica de las solicitudes HTTP de manera modular y organizada.
No se puede crear el objeto router sin importar express


### Buenas prácticas:
1. **Manejo de errores**: Es esencial para que el servidor no se caiga por errores imprevistos.

### Preguntas finales
¿cuales son los 2 elementos que define una ruta o un end point? 1. La ruta? 2. El callback o la funcion call back de lo que va a hacer
¿Que es ECMA Script 6?¿Que es CommonJS?
¿Puede el navegador acceder a cualquier ruta http como post, patch?
¿Para que sirve npx tailwind init -p?
