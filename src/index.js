const express = require('express');
const app = express();
const PORT = 3000; // Cambia el puerto según cada computadora

app.get('/', (req, res) => {
    res.send('yarbis pide dos de asada pero en fa');
});

app.listen(PORT, '172.16.18.107', () => {
    console.log(`Servidor en ejecución en http://172.16.18.107:${PORT}`);
});
