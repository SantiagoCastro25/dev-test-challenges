const input = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const currentUserDiv = document.getElementById('currentUser');
const historyList = document.getElementById('historyList');

// Cargar historial al iniciar
document.addEventListener('DOMContentLoaded', displayHistory);

searchBtn.addEventListener('click', async () => {
    const username = input.value.trim();
    if (!username) return;

    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('Usuario no encontrado');

        const data = await response.json();

        // Mostrar resultado actual
        showUserCard(data);

        // Guardar en LocalStorage
        saveToHistory(data.login);

    } catch (err) {
        alert(err.message);
    }
});

function showUserCard(user) {
    currentUserDiv.style.display = 'block';
    currentUserDiv.innerHTML = `
        <img src="${user.avatar_url}" alt="avatar">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || 'Sin biografía'}</p>
        <a href="${user.html_url}" target="_blank">Ver Perfil</a>
    `;
}

function saveToHistory(name) {
    let history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!history.includes(name)) {
        history.push(name);
        localStorage.setItem('searchHistory', JSON.stringify(history));
        displayHistory();
    }
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    historyList.innerHTML = history.map(name => `<li>${name}</li>`).join('');
}

clearBtn.addEventListener('click', () => {
    localStorage.removeItem('searchHistory');
    displayHistory();
    currentUserDiv.style.display = 'none';
});