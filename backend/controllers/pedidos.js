'use strict';

var db = require('../index');
var validator = require('validator');


var pedido = {
    id_usuario:null,
    detalles:{
        direccion:null,
        provincia:null,
        telefono: null,
        email: null,
        municipio:null,
        cp:null,
        nombre_usuario:null,
        apellidos_usuario:null
    },
    fecha:null,
    precio_total:null,
    estado: 'pendiente',
    productos:[]
}



var controller = {

  save:(request,response)=>{
    let requestedPedido=request.body.save_pedido;    
        try {
            var validate_nombre = !validator.isEmpty(requestedPedido.detalles.nombre);
            var validate_apellidos = !validator.isEmpty(requestedPedido.detalles.apellidos);
            var validate_email =  !validator.isEmpty(requestedPedido.detalles.email);
            var validate_direccion = !validator.isEmpty(requestedPedido.detalles.direccion);
            var validate_municipio = !validator.isEmpty(requestedPedido.detalles.municipio)
            var validate_cp = !validator.isEmpty(requestedPedido.detalles.cp);
            var validate_provincia = !validator.isEmpty(requestedPedido.detalles.provincia);
            var validate_id_usuario = !validator.isEmpty(requestedPedido.id_usuario);
            var validate_telefono = !validator.isEmpty(requestedPedido.detalles.telefono);
            var validate_fecha= !validator.isEmpty(requestedPedido.fecha);


        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_nombre && validate_apellidos && validate_email && validate_direccion && validate_cp && validate_telefono && validate_fecha && validate_municipio && validate_provincia && validate_id_usuario  ) {
                        pedido= requestedPedido;
                        db.collection('pedidos').add(pedido).then((doc)=>{
                            return response.status(200).send({
                                status: 'success',
                                message: "Pedido guardado",
                                pedidoId: doc.id,
                            });
                        }).catch((error)=>{
                            return response.status(200).send({
                                status: 'error',
                                message: "Se ha producido un error"
                            });
                        });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }
  
    }






}


module.exports = controller;