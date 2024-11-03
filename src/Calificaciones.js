//Iber
const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const axios = require('axios');

//configuración inicial
const app = express();
const PORT = 4002; // Cambiar el puerto
const IP = '192.168.56.1';

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}`);
});

//Middlewares
app.use(morgan("dev"))

//Rutas
app.get('/calificaciones/promedio/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await database.getConnection();

    try {
        // Obtener calificaciones
        const [rows] = await connection.query(
            'SELECT Matematicas, Ingles, DesarrolloWeb FROM calificaciones WHERE idalumnos = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).send('No se encontraron calificaciones para el alumno.');
        }

        // Calcular promedio
        const { Matematicas, Ingles, DesarrolloWeb } = rows[0];
        const totalCalificaciones = Matematicas + Ingles + DesarrolloWeb;
        const promedio = totalCalificaciones / 3;
        const pasa = promedio >= 60; // Ejemplo de criterio de aprobación

        console.log(promedio)
        // Comunicar el resultado a Alumnos.js
        await axios.patch(`http://192.168.56.1:4001/alumnos/${id}/pasa`, { //Cambiar puerto e IP 
            pasa
        });

        res.json({ promedio, pasa });
    } catch (error) {
        console.error("Error al calcular el promedio:", error);
        res.status(500).send("Error al calcular el promedio");
    }
});


