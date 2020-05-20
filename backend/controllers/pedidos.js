'use strict';

var db = require('../index');
var validator = require('validator');


var pedido = {
    id_usuario: null,
    detalles: {
        direccion: null,
        provincia: null,
        telefono: null,
        email: null,
        municipio: null,
        cp: null,
        nombre_usuario: null,
        apellidos_usuario: null
    },
    fecha: null,
    precio_total: null,
    estado: 'pendiente',
    productos: []
}



var controller = {

    save: (request, response) => {
        let requestedPedido = request.body.save_pedido;
        try {
            var validate_nombre = !validator.isEmpty(requestedPedido.detalles.nombre);
            var validate_apellidos = !validator.isEmpty(requestedPedido.detalles.apellidos);
            var validate_email = !validator.isEmpty(requestedPedido.detalles.email);
            var validate_direccion = !validator.isEmpty(requestedPedido.detalles.direccion);
            var validate_municipio = !validator.isEmpty(requestedPedido.detalles.municipio)
            var validate_cp = !validator.isEmpty(requestedPedido.detalles.cp);
            var validate_provincia = !validator.isEmpty(requestedPedido.detalles.provincia);
            var validate_id_usuario = !validator.isEmpty(requestedPedido.id_usuario);
            var validate_telefono = !validator.isEmpty(requestedPedido.detalles.telefono);
            var validate_fecha = !validator.isEmpty(requestedPedido.fecha);


        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_nombre && validate_apellidos && validate_email && validate_direccion && validate_cp && validate_telefono && validate_fecha && validate_municipio && validate_provincia && validate_id_usuario) {
            pedido = requestedPedido;
            db.collection('pedidos').add(pedido).then((doc) => {
                return response.status(200).send({
                    status: 'success',
                    message: "Pedido guardado",
                    pedidoId: doc.id,
                });
            }).catch((error) => {
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

    },

    getPedidosUser: (request, response) => {
        var id = request.params.id;
        var pedidos = [];
        try {
            var validate_id = !validator.isEmpty(id);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_id) {
            db.collection('pedidos').where('id_usuario', '==', id).get()
                .then(snapshot => {

                    if (snapshot.empty) {
                        return response.status(404).send({
                            status: 'error',
                            message: 'No existen pedidos'
                        });
                    }
                    snapshot.forEach(doc => {
                        pedidos.push({ pedidoId: doc.id, pedido: doc.data() })

                    });

                    return response.status(200).send({
                        status: 'success',
                        message: "Pedidos encontrados",
                        pedidos
                    });
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al obtener pedidos',
                        error: err
                    });
                });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }
    },

    getPedidoById: (request, response) => {
        let id = request.params.id;

        db.collection('pedidos').doc(id).get()
            .then(doc => {
                if (!doc.exists) {
                    return response.status(404).send({
                        status: 'error',
                        message: 'No existe pedido'
                    });
                } else {
                    return response.status(200).send({
                        status: 'success',
                        message: "Pedido encontrado",
                        producto: doc.data()
                    });
                }
            })
            .catch(err => {
                return response.status(500).send({
                    status: 'error',
                    message: 'Error al obtener pedido',
                    error: err
                });
            });
    },

    getPedidosPendientesyConfirmados: (request, response) => {
        var pedidos = [];
            db.collection('pedidos').where('estado', 'in', ['pendiente', 'confirmado', 'enviado'])/* .where('estado', '==', 'confirmado') */.get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        return response.status(404).send({
                            status: 'error',
                            message: 'No existen pedidos'
                        });
                    }
                    snapshot.forEach(doc => {
                        pedidos.push({ pedidoId: doc.id, pedido: doc.data() })

                    });

                    return response.status(200).send({
                        status: 'success',
                        message: "Pedidos encontrados",
                        pedidos
                    });
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al obtener pedidos',
                        error: err
                    });
                });
    },

    updateEstado: (request, response) => {
        var id = request.body.id;
        var state=request.body.state
        try {
            var validate_id = !validator.isEmpty(id);
            var validate_estado = !validator.isEmpty(state);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_id && validate_estado) {
            db.collection('pedidos').doc(id).update({ estado: state}).then(snapshot => {

                return response.status(200).send({
                    status: 'success',
                    message: "Estado actualizado",
                });
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar estado del pedido',
                        error: err
                    });
                });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }
    },


}


module.exports = controller;