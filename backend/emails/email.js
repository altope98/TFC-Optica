'use strict'

var validator = require('validator');
var transporter = require('./transporter');
var db = require('../index');
var fs = require('fs');
var handlebars = require('handlebars');
var cron = require('node-cron');
var moment = require('moment');
require('moment/locale/es.js');


var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            return response.status(200).send({
                status: 'error',
                message: "Mensaje no enviado",
                err
            });

        }
        else {
            callback(null, html);
        }
    });
};

cron.schedule('30 15 * * Monday,Tuesday,Wednesday,Thursday,Sunday', () => {
    controller.envioRecordatorio();
}); 


var controller = {

    nuevaCita: (request, response) => {

        readHTMLFile(__dirname + '/nuevacita.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                nombre: '',
                apellidos: ''
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'opticatopevision@gmail.com',
                to: 'opticatopevision@gmail.com',
                subject: 'Nueva Cita Pendiente',
                html: htmlToSend

            };
            transporter.sendMail(mailOptions, function (error, res) {
                if (error) {
                    return response.status(200).send({
                        status: 'error',
                        message: "Email no enviado",
                        respuesta: error
                    });
                } else {
                    return response.status(200).send({
                        status: 'success',
                        message: "Email enviado",
                        respuesta: res
                    });
                }
            });
        });
    },

    confirmaCita: (request, response) => {
        let cita = request.body.cita;

        readHTMLFile(__dirname + '/citaconfirmada.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                nombre: cita.user.nombre,
                apellidos: cita.user.apellidos,
                fecha: cita.fecha,
                hora: cita.hora
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'opticatopevision@gmail.com',
                to: cita.user.email,
                subject: 'Cita Confirmada',
                html: htmlToSend

            };
            transporter.sendMail(mailOptions, function (error, res) {
                if (error) {
                    return response.status(200).send({
                        status: 'error',
                        message: "Email no enviado",
                        respuesta: error
                    });
                } else {
                    return response.status(200).send({
                        status: 'success',
                        message: "Email enviado",
                        respuesta: res
                    });
                }
            });
        });
    },

    cambioCita: (request, response) => {
        let cita = request.body.cita;

        readHTMLFile(__dirname + '/citaactualizada.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                nombre: cita.user.nombre,
                apellidos: cita.user.apellidos,
                fecha: cita.fecha,
                hora: cita.hora
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'opticatopevision@gmail.com',
                to: cita.user.email,
                subject: 'Cita Modificada',
                html: htmlToSend

            };
            transporter.sendMail(mailOptions, function (error, res) {
                if (error) {
                    return response.status(200).send({
                        status: 'error',
                        message: "Email no enviado",
                        respuesta: error
                    });
                } else {
                    return response.status(200).send({
                        status: 'success',
                        message: "Email enviado",
                        respuesta: res
                    });
                }
            });
        });
    },

    recordatorioCita: (request, response) => {
        let cita = request.body.cita;

        readHTMLFile(__dirname + '/recordatoriocitacliente.html', function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                nombre: cita.user.nombre,
                apellidos: cita.user.apellidos,
                fecha: cita.fecha,
                hora: cita.hora
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'opticatopevision@gmail.com',
                to: cita.user.email,
                subject: 'Recordatorio Proxima Cita',
                html: htmlToSend

            };
            transporter.sendMail(mailOptions, function (error, res) {
                if (error) {
                    return response.status(200).send({
                        status: 'error',
                        message: "Email no enviado",
                        respuesta: error
                    });
                } else {
                    return response.status(200).send({
                        status: 'success',
                        message: "Email enviado",
                        respuesta: res
                    });
                }
            });
        });
    },

    envioRecordatorio: () => {
        let fecha = moment().add(1, 'days');
        fecha = fecha.format('DD/MM/YYYY');
        let citas = [];
        let status;

        db.collection('citas').where('fecha', '==', fecha).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    status = 'error';
                } else {
                    snapshot.forEach(doc => {
                        citas.push({ cita: doc.data() });

                    });

                    status = 'success';
                    if (status == 'success') {
                        //ENVIO DUEÑO
                        readHTMLFile(__dirname + '/recordatorioscitas.html', function (err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                citas: citas,
                                fecha: fecha,
                            };
                            var htmlToSend = template(replacements);
                            var mailOptions = {
                                from: 'opticatopevision@gmail.com',
                                to: 'opticatopevision@gmail.com',
                                subject: 'Citas para mañana',
                                html: htmlToSend
                            };
                            transporter.sendMail(mailOptions, function (error, res) {
                                if (error) {
                                    status = 'error';
                                    console.log(error);
                                } else {
                                    status = 'success';
                                }
                            });
                        }); 


                        //ENVIO A CADA CLIENTE QUE TIENE LA CITA
                        citas.forEach(cita => {
                            readHTMLFile(__dirname + '/recordatoriocitacliente.html', function (err, html) {
                                var template = handlebars.compile(html);
                                var replacements = {
                                    nombre: cita.cita.user.nombre,
                                    apellidos: cita.cita.user.apellidos,
                                    fecha: cita.cita.fecha,
                                    hora: cita.cita.hora
                                };
                                var htmlToSend = template(replacements);
                                var mailOptions = {
                                    from: 'opticatopevision@gmail.com',
                                    to: cita.cita.user.email,
                                    subject: 'Recordatorio Proxima Cita',
                                    html: htmlToSend
    
                                };
                                transporter.sendMail(mailOptions, function (error, res) {
                                    if (error) {
                                        status = 'error';
                                        console.log(error);
                                    } else {
                                        status = 'success';
                                    }
                                });
                            }); 
                            
                        });
                    }
                }

            })
            .catch(err => {

                status = 'error';
                console.log(err)
            });
    },

    adminPedido: (request, response)=>{
        let estado = request.body.state;
        let pedido= request.body.pedido;
        var html;
        if(estado==='confirmado'){
            html='pedidoconfirmado.html';
        }else if(estado==='rechazado'){
            html='pedidorechazado.html';
        }else{
            html='pedidoenviado.html';
        }


        readHTMLFile(__dirname + '/'+html, function (err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                nombre: pedido.detalles.nombre,
                apellidos: pedido.detalles.apellidos,
            };
            var htmlToSend = template(replacements);
            var mailOptions = {
                from: 'opticatopevision@gmail.com',
                to: pedido.detalles.email,
                subject: 'Informacion de su pedido',
                html: htmlToSend

            };
            transporter.sendMail(mailOptions, function (error, res) {
                if (error) {
                    return response.status(200).send({
                        status: 'error',
                        message: "Email no enviado",
                        respuesta: error
                    });
                } else {
                    return response.status(200).send({
                        status: 'success',
                        message: "Email enviado",
                        respuesta: res
                    });
                }
            });
        });

    }


}

module.exports = controller


