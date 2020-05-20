'use strict'


var { v4: uuidv4 } = require('uuid');
var stripe = require('stripe')('sk_test_JzsYaMoBJKUncDeAEcc3igcA00cOZondJJ');
var express=require('express');
var UserController=require('../controllers/user');
var CitasController=require('../controllers/citas');
var EmailController=require('../emails/email');
var CarritoController=require('../controllers/carrito');
var ProductosController=require('../controllers/productos');
var PedidosController=require('../controllers/pedidos');



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
router.post('/email/adminpedido', EmailController.adminPedido );


router.post('/carrito/agregar', CarritoController.agregarItem );
router.post('/carrito/quitar', CarritoController.quitarItem );
router.post('/carrito/eliminar', CarritoController.eliminarItem );
router.post('/carrito/cerrar', CarritoController.cerrarCarrito);
router.get('/carrito', CarritoController.mostrarCarrito);


router.post('/productos', ProductosController.getProductsByFilters);


router.post('/pedido/generar', PedidosController.save);
router.get('/pedidos/:id', PedidosController.getPedidosUser);
router.get('/pedido/:id', PedidosController.getPedidoById);
router.get('/pendingpedidos', PedidosController.getPedidosPendientesyConfirmados);
router.put('/pedido', PedidosController.updateEstado);


router.post('/pago' , async(request,response)=>{
    try{
        let token = request.body.token;
        let total = request.body.total;

        let customer = await stripe.customers.create(
            {
                email: token.email,
                source: token.id
            });
        let idempotencyKey= uuidv4();

        let charge = await stripe.charges.create(
            {
                amount: total * 100,
                currency: 'EUR',
                customer: customer.id,
                receipt_email: token.email,
                description: '',
                shipping: {
                    name: token.card.name,
                    address: {
                        line1: token.card.address_line1,
                        line2: token.card.address_line2,
                        city: token.card.address_city,
                        country: token.card.address_country,
                        postal_code: token.card.address_zip
                    }
                }
            },{
                idempotencyKey
            }
            
            );
            return response.status(200).send({
                status: 'success',
                token: token.id,
            });

                }catch(error){
                    return response.status(200).send({
                        status: 'error',
                        error
                    });
                }        
        }
);

/* router.post('/push', User.notificacion); */


module.exports=router