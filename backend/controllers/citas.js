'use strict'

var validator = require('validator');
var db = require('../index');
var messaging = require('../index');
var firebase = require("firebase");
var cron = require('node-cron');
var cita = {
    estado: null,
    fecha: null,
    hora: null,
    user: {
        nombre: null,
        apellidos: null,
        email: null,
        telefono: null
    }
}


cron.schedule('0 00 */1 * * *', () => {
    controller.comprobadorAntiguedad();
});



var controller = {

    save: (request, response) => {
        let requestedCita = request.body;
        try {
            var validate_nombre = !validator.isEmpty(requestedCita.nombre);
            var validate_apellidos = !validator.isEmpty(requestedCita.apellidos);
            var validate_email = validator.isEmail(requestedCita.email) && !validator.isEmpty(requestedCita.email);
            var validate_telefono = !validator.isEmpty(requestedCita.telefono);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_nombre && validate_apellidos && validate_email && validate_telefono) {

            cita.user.nombre = requestedCita.nombre;
            cita.user.apellidos = requestedCita.apellidos;
            cita.user.email = requestedCita.email;
            cita.user.telefono = requestedCita.telefono;
            cita.estado = 'pendiente';

            db.collection('citas').add(cita).then(() => {
                return response.status(200).send({
                    status: 'success',
                    message: "Cita registrada"
                });
            }).catch((err) => {
                return response.status(500).send({
                    status: 'error',
                    message: "Cita no registrada, error",
                    error: err.message
                });
            })
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }
    },

    update: (request, response) => {
        let requestedCita = request.body.cita;

        db.collection('citas').doc(request.body.id).update(requestedCita).then(() => {
            return response.status(200).send({
                status: 'success',
                message: "Cita actualizada",
            });
        }).catch((err) => {
            return response.status(500).send({
                status: 'error',
                message: "Cita no actualizada",
                error: err
            });
        });

    },

    getPendingCitas: (request, response) => {
        let citas = [];
        db.collection('citas').where('estado', '==', 'pendiente').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return response.status(200).send({
                        status: 'error',
                        message: 'No existen citas'
                    });
                }

                snapshot.forEach(doc => {
                    citas.push({ citaId: doc.id, cita: doc.data() });

                });
                return response.status(200).send({
                    status: 'success',
                    citas
                });
            })
            .catch(err => {
                return response.status(500).send({
                    status: 'error',
                    message: 'Error al obtener usuarios',
                    error: err
                });
            });

    },

    getUpdatedCitas: (request, response) => {
        let citas = [];
        db.collection('citas').where('estado', '==', 'actualizado').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return response.status(200).send({
                        status: 'error',
                        message: 'No existen citas'
                    });
                }

                snapshot.forEach(doc => {
                    citas.push({ citaId: doc.id, cita: doc.data() });

                });
                return response.status(200).send({
                    status: 'success',
                    citas
                });
            })
            .catch(err => {
                return response.status(500).send({
                    status: 'error',
                    message: 'Error al obtener usuarios',
                    error: err
                });
            });

    },



    comprobadorAntiguedad: () => {
        let citas = [];
        let status;
        db.collection('citas').where('estado', '==', 'actualizado').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    status = 'error';
                }
                snapshot.forEach(doc => {
                    citas.push({ citaId: doc.id, cita: doc.data() });

                });
                status = 'success'
                
                if (status == 'success') {
                    citas.forEach(element => {
                        let fecha2_split = element.cita.fecha.split("/");
                        let hora2_split = element.cita.hora.split(":");
                        let isAfter = false
                        if (new Date() > new Date(parseInt(fecha2_split[2]), parseInt(fecha2_split[1]) - 1, parseInt(fecha2_split[0]), parseInt(hora2_split[0]), parseInt(hora2_split[1]), 0)) {
                            isAfter = true;
                        } else {
                            isAfter = false;
                        }
                        if (isAfter === true) {
                            let cita = element.cita;
                            let id = element.citaId;
                            cita.estado = "terminado";
                            db.collection('citas').doc(id).update(cita).then(() => {
                                    status= 'success';
                            }).catch((err) => {
                                    status= 'error';
            
                            });
                        }
                    });
                }
            })
            .catch(err => {
                status = 'error'

            });
    },

    
}



module.exports = controller;