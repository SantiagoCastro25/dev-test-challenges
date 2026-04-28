// api.js

async function fetchUser(id) {
  const response = fetch(`https://jsonplaceholder.typicode.com/users/${id}`);  
  const data = response.json();                                                 
  return data;
}
 