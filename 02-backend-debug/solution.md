
### explanation (Uso de IA para detectar donde estaban los fallos)

1. await faltante: getDataFromDB() devuelve una Promise. Sin await, data es el objeto Promise, no el valor resuelto. data.result sobre una Promise devuelve undefined, que es exactamente lo que reportó el QA. El fix es simple: const data = await getDataFromDB().

antes:
const data = getDataFromDB();
despues:
const data = await getDataFromDB();
_____________________________________________________________________________________________________________________________________________________________________________

2. Cambiamos data.result por result: data porque data no tiene una propiedad result; queremos enviar un nuevo objeto con la propiedad result que contenga el valor de data.
antes:
res.json({ result: data.result });  
despues:
res.json({ result: data });
__________________________________________________________________________________________________________________________________________________________________________

3.  cambiamos 200 por 404 ya que regresaba un mensaje de error y el estado al ser 200 se mostraria como si estuviese bien causando confusiones
en cambio 404 va de acuerdo al mensaje que imprime de error
antes:
return res.status(200).json({ error: 'No data found' });
despues:
return res.status(404).json({ error: 'No data found' });
_______________________________________________________________________________________________________________________________________________________________________________

4.(USO DE IA: realmente fue un error dificil de ver porque postman no lo mostraba, entonces pedi a la IA que me ayudara a optimizar esto) ya que en cada request se le agrega un elemento. El problema es que nunca se limpia. Si tu servidor recibe 10,000 requests al día, en un mes ese array tiene 300,000 objetos en memoria. Eventualmente el servidor se vuelve lento o se cae.

antes:
const requestLog = [];

despues:
const MAX_LOG_SIZE = 100;
const requestLog = [];

function appendToLog(entry) {
  requestLog.push(entry);
  if (requestLog.length > MAX_LOG_SIZE) {               // Cuando el array supera el límite, eliminamos el registro más viejo
    requestLog.shift();                                 // shift() elimina el primer elemento (el más antiguo)
  }
}
____________________________________________________________________________________________________________________________________________________________________

5.(USO DE IA: Sabia que tenia que hacecr estas validacciones pero le pedi a la IA  que las hiciera para ahorrar tiempo y hacerlas de la manera mas optima)
Antes POST /save acepta cualquier cosa sin quejarse. Si mandas un body vacío, guarda undefined como si fuera un dato válido. Esto es como un formulario de registro que te deja crear una cuenta sin nombre ni contraseña.

antes:
 app.post('/save', (req, res) => {
  const { name, value } = req.body;
 
  requestLog.push({ name, value, ts: Date.now() });  

  res.status(200).json({ saved: true, name, value });
});
despues:
app.post('/save', (req, res, next) => {
  try {
    const { name, value } = req.body;

    // FIX 5 — Validación de inputs
    // Antes: no había validación; se guardaban undefined sin avisar al cliente.
    // Ahora verificamos 'name' en tres niveles:
    //   !name          → captura null, undefined, string vacío ""
    //   typeof !== str → captura casos donde manden un número o array como name
    //   .trim() === '' → captura strings de solo espacios como "   "
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        error: '`name` es requerido y debe ser un string no vacío'
      });
    }

    // Para value usamos una verificación más simple:
    // solo rechazamos null y undefined, pero sí aceptamos 0, false, "" etc.
    // porque esos pueden ser valores legítimos dependiendo del contexto
    if (value === undefined || value === null) {
      return res.status(400).json({
        error: '`value` es requerido'
      });
    }

    appendToLog({ name, value, ts: Date.now() }); 

    res.status(200).json({ saved: true, name, value });

  } catch (err) {
    next(err);
  }
});

______________________________________________________________________________________________________________________________

6.(USO DE IA: La use porque no sabia como crear el middleware de errores, entonces pregunte como se hacia esto y lo implemente al codigo) 
Sin un manejador de errores global, cualquier excepción no controlada dentro de una ruta
dejaría la solicitud bloqueada indefinidamente o provocaría el fallo del proceso,
sin que el cliente reciba ninguna respuesta.

Express reconoce un middleware de manejo de errores por su firma de cuatro parámetros:
(err, req, res, next). Debe declararse después de todas las rutas
para que Express pueda recurrir a él cuando se llame a next(err).

Cambios realizados:
- Se añadió app.use((err, req, res, next)) al final del archivo.
- Se envolvieron las solicitudes GET /data y POST /save en bloques try/catch.
- Cada bloque catch llama a next(err) para delegar al manejador global.
- El manejador global responde con un código 500 y registra el mensaje de error.