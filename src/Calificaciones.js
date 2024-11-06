//Mau
const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const axios = require('axios');

//configuración inicial
const app = express();
const PORT = 4002; // Cambiar el puerto
const IP = '172.16.21.44';

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}`);
});

//Middlewares
app.use(morgan("dev"))
app.use(express.json());

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
        const pasa = promedio >= 60;

        console.log(promedio)
        // Comunicar el resultado a Alumnos.js
        await axios.patch(`http://${IP}:4001/alumnos/${id}/pasa`, { //Cambiar puerto e IP 
            pasa
        });

        res.json({ promedio, pasa });
    } catch (error) {
        console.error("Error al calcular el promedio:", error);
        res.status(500).send("Error al calcular el promedio");
    }
});

app.get('/calificaciones', async (req, res)=>{
    const connection = await database. getConnection();
    const [result] = await connection.query("SELECT * from calificaciones");
    res.json(result)
});

app.post('/calificaciones/agregar/:id', async (req, res) => {
    const { id } = req.params;
    const { Matematicas, Ingles, DesarrolloWeb } = req.body;
    const connection = await database.getConnection();

    try {
        const [result] = await connection.query(
            'INSERT INTO calificaciones (idalumnos, Matematicas, Ingles, DesarrolloWeb) VALUES (?, ?, ?, ?)',
            [id, Matematicas, Ingles, DesarrolloWeb]
        );

        if (result.affectedRows === 1) {
            return res.status(201).json({ message: "Calificaciones agregadas correctamente", id });
        }

        res.status(400).json({ message: "No se pudo agregar las calificaciones" });
    } catch (error) {
        console.error("Error al agregar calificaciones:", error);
        res.status(500).send("Error al agregar calificaciones");
    }
});

app.patch('/calificaciones/actualizar/:id', async (req, res) => {
    const { id } = req.params;
    const { Matematicas, Ingles, DesarrolloWeb } = req.body;
    const connection = await database.getConnection();

    console.log(Matematicas)
    try {
        const [result] = await connection.query(
            'UPDATE calificaciones SET Matematicas = ?, Ingles = ?, DesarrolloWeb = ? WHERE idalumnos = ?',
            [Matematicas, Ingles, DesarrolloWeb, id]
        );

        if (result.affectedRows === 1) {
            return res.json({ message: "Calificaciones actualizadas correctamente" });
        }

        res.status(404).json({ message: "No se encontró el alumno o no se pudo actualizar las calificaciones" });
    } catch (error) {
        console.error("Error al actualizar calificaciones:", error);
        res.status(500).send("Error al actualizar calificaciones");
    }
});

app.delete('/calificaciones/eliminar/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await database.getConnection();

    try {
        const [result] = await connection.query(
            'DELETE FROM calificaciones WHERE idalumnos = ?',
            [id]
        );

        const [result1] = await connection.query(
            'delete from alumnos where idalumnos = ?',
            [id]
        );

        if (result.affectedRows === 1 && result1.affectedRows === 1) {
            return res.json({ message: "Calificaciones eliminadas correctamente" });
        }

        res.status(404).json({ message: "No se encontró el alumno o no se pudo eliminar las calificaciones" });
    } catch (error) {
        console.error("Error al eliminar calificaciones:", error);
        res.status(500).send("Error al eliminar calificaciones");
    }
});

