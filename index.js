const express = require('express');
const routes = require('./routes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config({path: 'variables.env'});

// Cors permite que un cliente se conecta a otro servidor para el intercambio de recursos

const cors = require('cors');
// Definir un dominio para recibir las peticiones
const whitelist = [process.env.FRONTEND_URL];

// conectar mongo
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true
});

// crear el servidor
const app = express();

// Definir dominio(s) para recibir las peticiones
const whiteList = ['http://localhost:3000'];
const corsOptions = {
    origin: (origin, callback) => {
        console.log(origin);
        //Revisar si la petición viene de un servidor que esta en whiteList
        const existe = whiteList.some(dominio => dominio === origin);
        if(existe) {
            callback(null, true);
        }else {
            callback(new Error('No permitido por CORS'));
        }
    }
}
// habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Habilitar cors
app.use(cors(corsOptions));

// Rutas de la app
app.use('/', routes());

// carpeta publica
app.use(express.static('uploads'));

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;
// puerto
app.listen(port, host,  ()=>{
    console.log('Server Linstening')
});