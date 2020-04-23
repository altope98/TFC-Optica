'use strict'

var express=require('express');
var UserController=require('../controllers/user');
var CitasController=require('../controllers/citas');

var router= express.Router();

router.post('/user', UserController.save);
router.get('/user/:email', UserController.getUser);
router.get('/getuser/:id', UserController.getUserById);
router.get('/getemail/:id', UserController.getEmailById);
router.get('/users', UserController.getUsers);
router.put('/user', UserController.update);


router.post('/cita', CitasController.save );
router.put('/cita', CitasController.update );
router.get('/pendingcitas', CitasController.getPendingCitas );
router.get('/updatedcitas', CitasController.getUpdatedCitas );


/* router.post('/push', User.notificacion); */
/*  router.post('/upload-image/:id?', MainController.upload); */
/* router.post('/email', ArticleController.sendEmail); */
module.exports=router