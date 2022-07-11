require('dotenv').config();
const cors =require('cors');
const { response } = require('express');
const express = require('express');
const { dbConnection } = require('./database/config');
//Crear el servidor express
const app = express();
//Configurar cors
app.use(cors());
//base de datos
dbConnection();
//rutas

app.get('/', ( req, res = response)=>{
    res.json({
        ok:true,
        msg:"Hola mundo"
    })
})


app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT)
});

