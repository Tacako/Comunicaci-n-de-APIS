// Función para mostrar mensajes de respuesta
function showMessage(message) {
    const messageElement = document.getElementById('responseMessage');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 2000);
}

//Ver Alumnos
document.getElementById('loadAlumnos').addEventListener('click', async () => {
    try {
        const response = await fetch('http://172.16.16.226:4001/alumnos'); //Cambiar ip y puerto
        const data = await response.json();
        
        // Si no hay alumnos, mostrar un mensaje
        if (typeof data === 'string') {
            showMessage(data);
            return;
        }

        const alumnosTableBody = document.getElementById('alumnosBody');
        alumnosTableBody.innerHTML = '';  // Limpiar la tabla antes de mostrar los nuevos alumnos
        
        // Mostrar los alumnos en la tabla
        data.forEach(alumno => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${alumno.idalumnos}</td>
                <td>${alumno.nombre}</td>
                <td>${alumno.edad}</td>
                <td>${alumno.genero}</td>
                <td>${alumno.grupo}</td>
                <td>${alumno.aprobado}</td>
            `;
            
            alumnosTableBody.appendChild(row);
        });
        
    } catch (error) {
        showMessage('Error al cargar los alumnos');
        console.error(error);
    }
});

// Agregar Alumno
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const edad = document.getElementById('edad').value;
    const genero = document.getElementById('genero').value;

    try {
        const response = await fetch('http://172.16.16.226:4001/alumnos/agregar', { //Cambiar ip y puerto
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, nombre, edad, genero }),
        });

        const data = await response.json();
        showMessage(data);
    } catch (error) {
        showMessage('Error al agregar alumno');
        console.error(error);
    }
});

// Actualizar Alumno
document.getElementById('updateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('updateId').value;
    const nombre = document.getElementById('updateNombre').value;
    const edad = document.getElementById('updateEdad').value;
    const genero = document.getElementById('updateGenero').value;
    const grupo = document.getElementById('updateGrupo').value;
    const aprobado = document.getElementById('updatePasa').value;

    try {
        const response = await fetch(`http://172.16.16.226:4001/alumnos/${id}`, { //Cambiar ip y puerto
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, edad, genero, grupo, aprobado }),
        });

        const data = await response.json();
        showMessage(data);
    } catch (error) {
        showMessage('Error al actualizar alumno');
        console.error(error);
    }
});

// Cambiar Estado de Aprobación
document.getElementById('passForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('passId').value;
    const pasa = document.getElementById('pasa').value;

    try {
        const response = await fetch(`http://172.16.16.226:4001/alumnos/${id}/pasa`, { //Cambiar ip y puerto
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pasa }),
        });

        const data = await response.json();
        showMessage(data);
    } catch (error) {
        showMessage('Error al cambiar estado de aprobación');
        console.error(error);
    }
});

// Eliminar Alumno
document.getElementById('deleteForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('deleteId').value;

    try {
        const response = await fetch(`http://172.16.16.226:4001/alumnos/${id}/borrar`, { //Cambiar ip y puerto
            method: 'DELETE',
        });

        const data = await response.json();
        showMessage(data);
    } catch (error) {
        showMessage('Error al eliminar alumno');
        console.error(error);
    }
});
