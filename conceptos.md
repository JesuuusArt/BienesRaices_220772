# Conceptos importantes

## npm i
El comando `npm i` instala todas las dependencias listadas en el archivo `package.json`, tanto para ejecución como para desarrollo.

---

## nodemon
`nodemon` reinicia automáticamente el servidor cuando detecta cambios en el código.

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


### Buenas prácticas:
1. **Manejo de errores**: Es esencial para que el servidor no se caiga por errores imprevistos.

