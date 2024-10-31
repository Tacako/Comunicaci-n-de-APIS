app.get('/Gestion', async (req, res) => {
    const connection = await database.getConnection();

    try {
        // Obtén los datos de las tres tablas
        const [alumnos] = await connection.query("SELECT * FROM alumnos");
        const [calificaciones] = await connection.query("SELECT * FROM calificaciones");
        const [correos] = await connection.query("SELECT * FROM correos");

        // Combina los datos
        const resultado = alumnos.map(alumno => ({
            ...alumno,
            calificaciones: calificaciones.filter(c => c.id_alumno === alumno.id),
            correos: correos.filter(correo => correo.id_alumno === alumno.id)
        }));

        res.json(resultado);

    } catch (error) {
        console.error("Error al consolidar los datos:", error);
        res.status(500).send("Error al obtener los datos");
    } finally {
        connection.release(); // Libera la conexión
    }
});