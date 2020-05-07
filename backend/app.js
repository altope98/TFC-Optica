'use strict'

//CARGA DE MODULOS DE NODE PARA CREAR SERVER
var express= require('express');
var bodyParser= require('body-parser');
var session=require('express-session');


//EJECUTAR EXPRESS (HTTP)
var app=express();

//CARGAR FICHEROS DE RUTAS
var clients_router= require('./routes/routes');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(session({
    secret:'carrito',
    resave: false,
    saveUninitialized: false
}));


//PREFIJOS A RUTAS  //CARGADO DE RUTAS
app.use('/api',clients_router);


//EXPORTAR MODULO
module.exports=app;