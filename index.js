require('dotenv').config();
const cors =require('cors');
const express = require('express');
const { dbConnection } = require('./database/config');
//Crear el servidor express
const app = express();
//Configurar cors
app.use(cors());
//lectura del body
app.use(express.json());
//base de datos
dbConnection();

//rutas
app.use('/api/usuarios', require('./routes/usuarios') );
app.use('/api/hospitales', require('./routes/hospitales') );
app.use('/api/login', require('./routes/auth') );
app.use('/api/medicos', require('./routes/medicos') );
app.use('/api/todo', require('./routes/busquedas') );
app.use('/api/upload', require('./routes/uploads') );



app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
});

