### explanation (Uso de IA para desarrollo y optimizacion)


¿De qué trata el proyecto?
Básicamente hice una mini app web que te permite buscar usuarios de GitHub por su username. Muestra el avatar, nombre, bio y un link al perfil. También guarda un historial de búsquedas con localStorage para no perder lo que ya buscaste.

¿Cómo empecé?
Lo primero que hice fue el HTML a mano porque esa parte sí la entiendo bien. Definí la estructura: un input, un botón de búsqueda, un div para mostrar el usuario actual y una lista para el historial. Eso no fue problema.
El CSS sí lo generé con IA porque honestamente el diseño no es lo mío y no quería perder tiempo ahí. Le pedí algo limpio y centrado, tipo tarjeta, con colores parecidos a los de GitHub

¿Dónde me trabé?
1. El fetch y el async/await
Sabía que tenía que hacer una petición a la API de GitHub, pero nunca había usado async/await de verdad en un proyecto propio. Al principio intenté con .then() encadenado y me hice un enredo horrible. Después entendí que async/await era básicamente lo mismo pero más legible:

jsconst response = await fetch(`https://api.github.com/users/${username}`);
if (!response.ok) throw new Error('Usuario no encontrado');
const data = await response.json();

Lo que no sabía era que fetch no lanza un error solo porque el usuario no exista. El status 404 llega como respuesta "exitosa" para fetch. Eso me confundió un buen rato hasta que aprendí que toca revisar response.ok manualmente.

2. El localStorage — aquí sí pedí ayuda a la IA
Esta parte fue la que más me costó. Sabía que existía localStorage pero no tenía claro cómo guardar una lista de cosas. La IA me explicó el patrón de leer, modificar y volver a guardar:
jslet history = JSON.parse(localStorage.getItem('searchHistory')) || [];
if (!history.includes(name)) {
    history.push(name);
    localStorage.setItem('searchHistory', JSON.stringify(history));
}
El || [] me pareció muy elegante. Si no hay nada guardado, arranca con un arreglo vacío. Eso no lo hubiera pensado solo tan rápido.

3. El botón de limpiar historial — idea que me sugirió la IA
Esto ni lo tenía planeado. Cuando le mostré el avance a la IA me recomendó añadirlo porque sin eso el historial solo crecía para siempre y no había forma de resetearlo. Lo implementé con localStorage.removeItem() y también oculté la tarjeta del usuario actual al limpiar.

¿Qué aprendí con esto?

Cómo manejar eventos del DOM (click, DOMContentLoaded)
Cómo hacer peticiones HTTP reales con fetch y async/await
Manipular el DOM dinámicamente con innerHTML
Usar localStorage para persistir datos entre sesiones
Manejar errores básicos con try/catch


¿Qué todavía no entiendo bien?
Siendo honesto, aún me quedan dudas sobre el rate limiting de la API de GitHub (si hago muchas búsquedas rápido, en algún momento me bloquea y no sé muy bien cómo manejarlo elegantemente). También los métodos de arrays como .map() e .includes() los uso porque funcionan, pero me falta practicarlos más para entenderlos a fondo.