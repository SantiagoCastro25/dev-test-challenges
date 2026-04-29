
const express = require('express');
const app = express();
app.use(express.json());

const MAX_LOG_SIZE = 100;
const requestLog = [];


function appendToLog(entry) {
  requestLog.push(entry);
  // Cuando el array supera el límite, eliminamos el registro más viejo
  if (requestLog.length > MAX_LOG_SIZE) {
    requestLog.shift(); // shift() elimina el primer elemento (el más antiguo)
  }
}

async function getDataFromDB() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id: 1, value: 'hello' }), 100);
  });
}

app.get('/data', async (req, res, next) => {
  
  try{
  appendToLog({ ts: Date.now() })   

  const data = await getDataFromDB();     //Aqui faltaba el await      

  if (!data) {
    return res.status(404).json({ error: 'No data found' });  //cambiamos 200 por 404 ya que regresaba un mensaje de error
  }

  res.json({ result: data }); // Cambiamos data.result por result: data porque data no tiene una propiedad result; queremos enviar un nuevo objeto con la propiedad result que contenga el valor de data.
    }
    catch (err) {
    // Si algo explota inesperadamente, le pasamos el error
    // al middleware global de errores (definido al final del archivo)
    next(err);
   }   //result no es una propiedad de data, es un nuevo objeto que estamos creando para enviar la respuesta. Por eso no se puede usar data.result
});





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


// ============================================================
// FIX 6 — Middleware global de manejo de errores
// Express reconoce este middleware por tener exactamente 4 parámetros.
// Debe ir DESPUÉS de todos los routes, justo antes de app.listen().
// Sin esto, cualquier excepción no capturada dejaba la request colgada
// o hacía crashear el servidor sin darle ninguna respuesta al cliente.
// ============================================================
app.use((err, req, res, next) => {
  console.error('[Error no manejado]', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    detail: err.message
  });
});



app.listen(3001, () => {
  console.log('Server running on port 3001');
});

module.exports = app;
