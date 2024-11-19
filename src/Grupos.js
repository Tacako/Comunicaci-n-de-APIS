//Regina
const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const axios = require('axios');
const cors = require('cors');


//configuración inicial
const app = express();
const PORT = 4003; 
const IP = '192.168.100.6'; // Cambiar la ip

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}`);
});

//Middlewares
app.use(morgan("dev"))
app.use(express.json());
app.use(cors());



//Rutas
app.patch('/alumnos/actualizarGrupo', async (req, res) => {
    const connection = await database.getConnection();

    try {
        // Consulta al API de calificaciones para obtener los promedios de todos los alumnos
        const response = await axios.get(`http://${IP}:4002/calificaciones/promedio`);
        const promedios = response.data; // Suponemos que es un array de objetos [{ id: 1, promedio: 75 }, { id: 2, promedio: 55 }, ...]

        if (!Array.isArray(promedios) || promedios.length === 0) {
            return res.status(400).json({ message: "No se encontraron promedios para los alumnos." });
        }

        // Límite de aprobación
        const umbralAprobacion = 60;

        // Construir las consultas de actualización para todos los alumnos
        const queries = promedios.map(({ idalumnos, promedio }) => {
            if (promedio >= umbralAprobacion) {
                // Incrementa el grupo si el promedio es suficiente
                return connection.query('UPDATE alumnos SET grupo = grupo + 1 WHERE idalumnos = ?', [idalumnos]);
            } else {
                // No se modifica el grupo si el promedio es insuficiente
                return Promise.resolve(); // Devuelve una promesa resuelta para mantener la estructura
            }
        });

        // Ejecutar todas las consultas en paralelo
        await Promise.all(queries);

        res.status(200).json({
            message: "Grupos actualizados para todos los alumnos.",
            total: promedios.length,
        });
    } catch (error) {
        console.error("Error al actualizar los grupos de los alumnos:", error);
        res.status(500).json({ message: "Error al actualizar los grupos de los alumnos." });
    }
});
