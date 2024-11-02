//Iber
const express = require("express");
const morgan = require("morgan");
const database = require("./database");

//configuración inicial
const app = express();
const PORT = 4000; // Cambiar el puerto
const IP = '192.168.56.1';

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}`);
});

//Middlewares
app.use(morgan("dev"))

//Rutas
app.get('/calificaciones', async (req, res) => {
    const connection = await database.getConnection();
    const [result] = await connection.query("SELECT * from calificaciones");
    res.json(result)
});


