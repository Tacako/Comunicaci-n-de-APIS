//Regina
const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const axios = require('axios');

//configuración inicial
const app = express();
const PORT = 4003; // Cambiar el puerto sumando 1
const IP = '192.168.56.1'; //Cambiar a tu ip usando en la consola de windows ipconfig

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}/correos`);
});

//Middlewares
app.use(morgan("dev"))
app.use(express.json());



//Rutas
app.patch('/alumnos/actualizarGrupo/:id', async (req, res) => {
    const alumnoId = req.params.id;
    const connection = await database.getConnection();

    try {
        //Consulta al API de calificaciones para obtener el promedio
        const response = await axios.get(`http://${IP}:4002/calificaciones/promedio/${alumnoId}`);
        const promedio = response.data.promedio;
        
        //Limite de aprobacion
        const umbralAprobacion = 60;

        // Verificamos si el alumno aprueba o no
        if (promedio >= umbralAprobacion) {
            //Si aprueba, incrementa el grupo en 1
            await connection.query('UPDATE alumnos SET grupo = grupo + 1 WHERE idalumnos = ?', [alumnoId]);
            res.status(200).json({ message: "El alumno aprobó y se le ha asignado un nuevo grupo." });
        } else {
            //Si no aprueba, no se modifica el grupo
            res.status(200).json({ message: "El alumno no aprobó y permanece en el grupo actual." });
        }
    } catch (error) {
        console.error("Error al actualizar el grupo del alumno:", error);
        res.status(500).json({ message: "Error al actualizar el grupo del alumno." });
    }
});