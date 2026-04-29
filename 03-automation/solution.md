Mi workflow recibe datos de registro de usuarios a través de un webhook POST. Cuando alguien envía un nombre, email y fuente, lo primero que hago es validar el formato del email usando una expresión regular. Si el email está mal formado — le falta el signo @, no tiene dominio, o tiene una estructura incorrecta — retorno inmediatamente un estado "invalid" y me detengo ahí. No tiene sentido continuar con datos incorrectos.

Si el email pasa la validación, consulto Google Sheets para ver si ese email ya existe. Filtro la hoja de usuarios por la columna email, y un nodo de código compara lo que Sheets devolvió con lo que llegó en el webhook. Si coinciden, significa que el usuario ya está registrado, entonces retorno un estado "duplicate" y me detengo. Esto evita que el mismo email se guarde dos veces.

Si es un email nuevo, procedo a guardarlo. El nodo de guardado está configurado con lógica de reintento — si Google Sheets falla por cualquier razón, como un problema de red o un timeout de la API, automáticamente espera 2 segundos y lo intenta una vez más antes de rendirse. Esto cubre fallas temporales sin que yo tenga que hacer nada manualmente.

Si los dos intentos fallan, el workflow toma la ruta de error. Capturo los datos del usuario junto con el error y los escribo en una hoja separada llamada err_log. Esto me da un registro permanente de cada registro fallido para poder revisarlos después y reintentarlos manualmente si es necesario. La respuesta que se retorna en este caso le indica al cliente que la cuenta no fue creada.

Si el guardado tiene éxito, retorno un estado "saved" confirmando que el registro fue exitoso.

Entonces cada resultado posible — email inválido, duplicado, guardado exitoso, o guardado fallido — tiene su propio camino explícito y su propia respuesta. Nada queda sin resolver.