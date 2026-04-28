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
 
  document.getElementById('result').innerHTML =
    `<strong>${user.name}</strong><br>${user.email}<br>${user.website}`;  
}

function showResult(message, isError = false) {
  const el = document.getElementById('result');
  el.className = isError ? 'error' : '';
  el.textContent = message;
}
 