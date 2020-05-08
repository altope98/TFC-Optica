'use strict'

var express=require('express');
var UserController=require('../controllers/user');
var CitasController=require('../controllers/citas');
var EmailController=require('../emails/email');
var CarritoController=require('../controllers/carrito');
var ProductosController=require('../controllers/productos');


var router= express.Router();

router.post('/user', UserController.save);
router.post('/user2', UserController.save2);
router.get('/user/:email', UserController.getUser);
router.get('/getuser/:id', UserController.getUserById);
router.get('/getemail/:id', UserController.getEmailById);
router.get('/users', UserController.getUsers);
router.put('/user', UserController.update);
router.delete('/user/:id', UserController.delete);


router.post('/cita', CitasController.save );
router.put('/cita', CitasController.update );
router.get('/pendingcitas', CitasController.getPendingCitas );
router.get('/updatedcitas', CitasController.getUpdatedCitas );


router.post('/email/cita', EmailController.nuevaCita );
router.post('/email/confirmacita', EmailController.confirmaCita );
router.post('/email/cambiocita', EmailController.cambioCita );
router.post('/email/recordatorio', EmailController.recordatorioCita );


router.post('/carrito/agregar', CarritoController.agregarItem );
router.delete('/carrito/eliminar', CarritoController.quitarItem );
router.get('/carrito', CarritoController.mostrarCarrito);


router.post('/productos', ProductosController.getProductsByFilters);

/* router.post('/push', User.notificacion); */
/*  router.post('/upload-image/:id?', MainController.upload); */
/* router.post('/email', ArticleController.sendEmail); */
module.exports=router