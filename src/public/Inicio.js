const express = require("express");
const morgan = require("morgan");


//configuración inicial
const app = express();
const PORT = 4004;
const IP = '172.16.16.226'; // Cambiar la ip

app.listen(PORT, IP, () => {
    console.log(`Servidor en ejecución en http://${IP}:${PORT}`);
});

//Middlewares
app.use(morgan("public"))
app.use(express.static("src"));

app.get("/Inicio.html", (req, res) => {
    res.sendFile(__dirname + "/inicio.html"); // Ruta principal
});

app.get("/Alumnos.html", (req, res) => {
    res.sendFile(__dirname + "/Alumnos/Alumnos.html"); // Ruta principal
});

app.get("/Calificaciones.html", (req, res) => {
    res.sendFile(__dirname + "/Calificaciones/Calificaciones.html"); // Ruta principal
});

app.get("/Grupos.html", (req, res) => {
    res.sendFile(__dirname + "/Grupos/Grupos.html"); // Ruta principal
});

