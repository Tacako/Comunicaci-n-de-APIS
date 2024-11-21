// Mostrar mensajes
function showMessage(message) {
    const messageElement = document.getElementById('responseMessage');
    messageElement.textContent = message;
    setTimeout(() => {
        messageElement.textContent = '';
    }, 2000);
}

// Actualizar los grupos de todos los alumnos según los promedios
document.getElementById('updateGrupos').addEventListener('click', async () => {
    try {
        const response = await fetch('http://172.16.16.226:4003/alumnos/actualizarGrupo', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.status === 200) {
            // Si la operación fue exitosa
            showMessage(`Grupos actualizados correctamente. Total de alumnos: ${data.total}`);
        } else {
            // Si hubo algún error
            showMessage(`Error: ${data.message}`);
        }
    } catch (error) {
        showMessage('Error al actualizar los grupos de los alumnos');
        console.error(error);
    }
});

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