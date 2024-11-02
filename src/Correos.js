//Regina
const express = require("express");
const morgan = require("morgan");
const database = require("./database");

//configuración inicial
const app = express();
const PORT = 4002; // Cambiar el puerto sumando 1
const IP = '192.168.56.1'; //Cambiar a tu ip usando en la consola de windows ipconfig

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}/correos`);
});

//Middlewares
app.use(morgan("dev"))

//Rutas
app.get('/correos', async (req, res) => {
    const connection = await database.getConnection();
    const [result] = await connection.query("SELECT * from correos");
    res.json(result)
});