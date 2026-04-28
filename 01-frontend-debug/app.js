// app.js

let cachedUser = null;

async function loadUser() {
  const userId = document.getElementById('userId').value;

 
  if (userId === '') { //Aqui se corrige la validacion ya que no estaba haciendo una comparacion sino asignando '' a user id    
    showResult('Please enter a valid ID');
    return;
  }

  if (userId <= 0) {  //Hacemos la validacion de manera correcta, ya que el id no puede ser negativo ni cero
    showResult('ID must be positive', true);
    return;
  }

  
  if (!cachedUser) {
    cachedUser = await fetchUser(userId);  // agregamos el await para esperar la respuesta de la promesa
  }

    const user = cachedUser;
 
  const result = document.getElementById('result');
  result.innerHTML = '';  // limpia lo que había antes

  // Crear el elemento <strong>
  const name = document.createElement('strong');

  name.textContent = user.name;
  // Si user.name es un script no lo ejecuta sino lo muestra como texto plano

  //agregamos el elemento al div e insertamos saltos de linea
  result.appendChild(name);

  result.appendChild(document.createElement('br'));

  result.appendChild(document.createTextNode(user.email));

  result.appendChild(document.createElement('br'));

  result.appendChild(document.createTextNode(user.website));

  // Aqui al usar InnerHTML nos exponemos a XSS ya que nos pueden llegar scripts desde la API

// document.getElementById('result').innerHTML =
//  `<strong>${user.name}</strong><br>${user.email}<br>${user.website}`;  
}

function showResult(message, isError = false) {
  const el = document.getElementById('result');
  el.className = isError ? 'error' : '';
  el.textContent = message;
}
 