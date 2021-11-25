//Importar todas las librerias
const express = require("express");
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.json());
app.use(cors())

//MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'evaluacion'
});

connection.connect(e => {
    if (e) {
        throw error;
    }
    console.log("conectado a la BDD");
})


app.get('/preguntas', (req, res) => {
    const sql = 'SELECT * FROM preguntas;'

    connection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            console.log('Consulta impresa')
            return res.json(results)
        } else {
            return res.send('Sin resultados')
        }
    })

    // return res.send(`Imprimir preguntas`)
})

app.post('/agregarPregunta', (req, res) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let fecha = '';
    if (month < 10) {
        fecha = `${year}-0${month}-${day}`
    } else {
        fecha = `${year}-${month}-${day}`
    }


    const sql = 'INSERT INTO preguntas SET ?;';
    const preguntaObj = {
        Pregunta: req.body.pregunta,
        Fecha_crea: fecha
    }

    connection.query(sql, preguntaObj, (err) => {
        if (err) throw err;
        res.send('Pregunta Guardada')
    })

    // res.send('Agregar una pregunta');
})

app.put('/editarPregunta/:id', (req, res) => {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let fecha = '';
    if (month < 10) {
        fecha = `${year}-0${month}-${day}`
    } else {
        fecha = `${year}-${month}-${day}`
    }

    const { id } = req.params;
    const { pregunta } = req.body;
    const sql = `UPDATE preguntas SET Pregunta = '${pregunta}', Fecha_Mod = '${fecha}'
     WHERE ID_Pregunta = ${id};`;


    connection.query(sql, (err) => {
        if (err) throw err;
        res.send('Pregunta Modificada')
    })
    // res.send('Editar una pregunta');
}
)

app.delete('/eliminarPregunta/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM preguntas 
     WHERE ID_Pregunta = ${id};`;

    connection.query(sql, (err) => {
        if (err) throw err;
        res.send('Pregunta Eliminada')
    })

    // res.send('Eliminar pregunta');
})

app.listen(PORT, () => {
    console.log(`corriendo en el puerto: ${PORT}`);
});