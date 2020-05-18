'use strict'

//CARGA DE MODULOS DE NODE PARA CREAR SERVER
var express= require('express');
var cookieParser= require('cookie-parser')
var bodyParser= require('body-parser');
var session=require('express-session');



//EJECUTAR EXPRESS (HTTP)
var app=express();

//CARGAR FICHEROS DE RUTAS
var clients_router= require('./routes/routes');

//MIDDLEWARES
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.use(cookieParser());

app.use(session({
    secret:'carrito',
    resave: false,
    saveUninitialized: true
}));


//PREFIJOS A RUTAS  //CARGADO DE RUTAS
app.use(clients_router);

 app.use(express.static('public')); 


//EXPORTAR MODULO
module.exports=app;