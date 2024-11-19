// Mostrar mensajes
function showMessage(message) {
    const messageElement = document.getElementById('responseMessage');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 2000);
}

// Cargar todas las calificaciones
document.getElementById('fetchCalificaciones').addEventListener('click', async () => {
    try {
        const response = await fetch('http://192.168.100.6:4002/calificaciones'); //Cambiar ip y puerto
        const data = await response.json();

        const listElement = document.getElementById('calificacionesList');
        listElement.innerHTML = data.map(calif => `
            <p>
                <strong>Nombre:</strong> ${calif.nombre}<br>
                <strong>ID:</strong> ${calif.idalumnos}<br>
                <strong>Matemáticas:</strong> ${calif.Matematicas}<br>
                <strong>Inglés:</strong> ${calif.Ingles}<br>
                <strong>Desarrollo Web:</strong> ${calif.DesarrolloWeb}
            </p>
        `).join('');
    } catch (error) {
        showMessage('Error al cargar calificaciones');
        console.error(error);
    }
});

// Calcular promedios
document.getElementById('calculatePromedios').addEventListener('click', async () => {
    try {
        const response = await fetch('http://192.168.100.6:4002/calificaciones/promedio'); //Cambiar ip y puerto
        const data = await response.json();

        const resultElement = document.getElementById('promediosResult');
        resultElement.innerHTML = data.map(res => `
            <p>
                ID: ${res.idalumnos}, Promedio: ${res.promedio.toFixed(2)}, ${res.pasa ? 'Aprobado' : 'Reprobado'}
            </p>
        `).join('');
    } catch (error) {
        showMessage('Error al calcular promedios');
        console.error(error);
    }
});

// Agregar calificaciones
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('addId').value;
    const Matematicas = document.getElementById('matematicas').value;
    const Ingles = document.getElementById('ingles').value;
    const DesarrolloWeb = document.getElementById('desarrolloWeb').value;

    try {
        const response = await fetch(`http://192.168.100.6:4002/calificaciones/agregar/${id}`, { //Cambiar ip y puerto
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Matematicas, Ingles, DesarrolloWeb }),
        });

        const data = await response.json();
        showMessage(data.message);
    } catch (error) {
        showMessage('Error al agregar calificaciones');
        console.error(error);
    }
});

// Actualizar calificaciones
document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('updateId').value;
    const Matematicas = document.getElementById('updateMatematicas').value;
    const Ingles = document.getElementById('updateIngles').value;
    const DesarrolloWeb = document.getElementById('updateDesarrolloWeb').value;

    try {
        const response = await fetch(`http://192.168.100.6:4002/calificaciones/actualizar/${id}`, { //Cambiar ip y puerto
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Matematicas, Ingles, DesarrolloWeb }),
        });

        const data = await response.json();
        showMessage(data.message);
    } catch (error) {
        showMessage('Error al actualizar calificaciones');
        console.error(error);
    }
});

// Eliminar calificaciones
document.getElementById('deleteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('deleteId').value;

    try {
        const response = await fetch(`http://192.168.100.6:4002/calificaciones/eliminar/${id}`, { //Cambiar ip y puerto
            method: 'DELETE',
        });

        const data = await response.json();
        showMessage(data.message);
    } catch (error) {
        showMessage('Error al eliminar calificaciones');
        console.error(error);
    }
});
