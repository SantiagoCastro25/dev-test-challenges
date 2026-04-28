// api.js

async function fetchUser(id) {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);  // agregamos el await para esperar la respuesta de la promesa
  const data = await response.json();// agregamos el await para esperar la respuesta de la promesa                                                 
  return data;
}
 