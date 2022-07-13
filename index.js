require('dotenv').config();
const cors =require('cors');
const { response, application } = require('express');
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
app.use('/api/login', require('./routes/auth') );


 

app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
});

