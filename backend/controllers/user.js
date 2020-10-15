'use strict'

var validator = require('validator');
var db = require('../index');
var messaging = require('../index');
var firebase = require("firebase");
var auth= require('../index');
var admin= require('firebase-admin')

var user = {
    nombre: null,
    apellidos: null,
    email: null,
    historial: [],
    telefono: null,
    dni: null,
    imagen:null,
    admin: false
}

var controller = {

    save: (request, response) => {
        let requestedUser=request.body.user;
        let url=request.body.url;
        try {
            var validate_nombre = !validator.isEmpty(requestedUser.nombre);
            var validate_apellidos = !validator.isEmpty(requestedUser.apellidos);
            var validate_email =  !validator.isEmpty(requestedUser.email);
            var validate_password = !validator.isEmpty(requestedUser.password);
            var validate_dni = !validator.isEmpty(requestedUser.dni)
            var validate_telefono = !validator.isEmpty(requestedUser.telefono);


        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_nombre && validate_apellidos && validate_email && validate_password && validate_dni && validate_telefono) {
            
            db.collection('users').where('email', '==', requestedUser.email).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    
                    firebase.auth().createUserWithEmailAndPassword(requestedUser.email, requestedUser.password).then(() => {
                        delete requestedUser.password;
                        user.nombre = requestedUser.nombre;
                        user.apellidos = requestedUser.apellidos;
                        user.email = requestedUser.email;
                        user.dni = requestedUser.dni;
                        user.telefono = requestedUser.telefono;
                        user.imagen=url

                        db.collection('users').add(user);
        
                        return response.status(200).send({
                            status: 'success',
                            message: "Usuario registrado"
                        });
                    }).catch((err) => {
                        if (requestedUser.password.length < 6) {
                            return response.status(500).send({
                                status: 'error',
                                message: "Usuario no registrado, contraseña menor de 6 caracteres, error",
                            });
                        } else {
                            return response.status(500).send({
                                status: 'error',
                                message: "Usuario no registrado, error",
                                error: err.message
                            });
                        }
                    });
                }
            }).catch(err => {
                return response.status(500).send({
                    status:'error',
                    message: 'El usuario ya esta registrado'
                });
            });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }
    },

    save2: (request,response)=>{
        let requestedUser=request.body;

        try {
            var validate_nombre = !validator.isEmpty(requestedUser.nombre);
            var validate_apellidos = !validator.isEmpty(requestedUser.apellidos);
            var validate_email =  !validator.isEmpty(requestedUser.email);


        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_nombre && validate_apellidos && validate_email) {
            db.collection('users').where('email', '==', requestedUser.email).get()
            .then(snapshot => {
                if (snapshot.empty) {
                        user.nombre = requestedUser.nombre;
                        user.apellidos = requestedUser.apellidos;
                        user.email = requestedUser.email;
                        user.dni = requestedUser.dni;
                        user.telefono = requestedUser.telefono;

                        db.collection('users').add(user);
        
                        return response.status(200).send({
                            status: 'success',
                            message: "Usuario registrado"
                        });
                }else{
                    return response.status(200).send({
                        status:'error',
                        message: 'El usuario ya esta registrado'
                    });
                }
            }).catch(err => {
                return response.status(500).send({
                    status:'error',
                    message: 'El usuario ya esta registrado'
                });
            });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }
    },

    getUser: (request, response) => {

        var email = request.params.email;
        try {
            var validate_email = !validator.isEmpty(email);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }

        if (validate_email) {
            db.collection('users').where('email', '==', email).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        return response.status(404).send({
                            status: 'error',
                            message: 'No existe usuario'
                        });
                    }

                    snapshot.forEach(doc => {
                        return response.status(200).send({
                            status: 'success',
                            message: "Usuario encontrado",
                            userId:doc.id,
                            user: doc.data()
                        });
                    });
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al obtener usuario',
                        error:err
                    });
                });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }

    },

    getEmailById:(request,response)=>{
        var id = request.params.id;
        try {
            var validate_id = !validator.isEmpty(id);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }
        if (validate_id) {
            db.collection('users').doc(id).get()
                .then(doc => {
                    if (!doc.exists) {
                        return response.status(404).send({
                            status: 'error',
                            message: 'No existe usuario'
                        });
                    }else{
                        return response.status(200).send({
                            status: 'success',
                            message: "Usuario encontrado",
                            email: doc.data().email
                        });
                    }

                    
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al obtener usuario',
                        error:err
                    });
                });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }

    },

    getUserById: (request, response) => {
        var id = request.params.id;
        try {
            var validate_id = !validator.isEmpty(id);

        } catch (error) {
            return response.status(200).send({
                status: 'error',
                message: "Faltan datos"
            });
        }
        if (validate_id) {
            db.collection('users').doc(id).get()
                .then(doc => {
                    if (!doc.exists) {
                        return response.status(404).send({
                            status: 'error',
                            message: 'No existe usuario'
                        });
                    }else{
                        return response.status(200).send({
                            status: 'success',
                            message: "Usuario encontrado",
                            user: doc.data()
                        });
                    }

                    
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al obtener usuario',
                        error:err
                    });
                });
        } else {
            return response.status(200).send({
                status: 'error',
                message: "Datos no validos"
            });
        }

    },

    getUsers: (request, response) => {
        let users=[];
        db.collection('users').where('admin','==', false).get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        return response.status(200).send({
                            status: 'error',
                            message: 'No existen usuarios'
                        });
                    }

                    snapshot.forEach(doc => {
                        users.push({userId:doc.id, user:doc.data()});
                        
                    });
                    return response.status(200).send({
                        status: 'success',
                        users
                    });
                })
                .catch(err => {
                    return response.status(500).send({
                        status: 'error',
                        message: 'Error al obtener usuarios',
                        error:err
                    });
                });
    },

    update:(request,response)=>{
        let requestedUser=request.body.user;
        let url=request.body.url;
        requestedUser.imagen=url;
        /*admin:false
        apellidos:"Torrente Perez"
        dni:"4758839467L"
        email:"alvarotorrenteperez98@gmail.com"
        historial:null
        nombre:"Alvaro"
        telefono:"354235432"*/


        db.collection('users').doc(request.body.userId).update(requestedUser).then(()=>{
            return response.status(200).send({
                status: 'success',
                message: "Usuario actualizado",
            });
        }).catch((err)=>{
            return response.status(500).send({
                status: 'error',
                message: "Usuario no actualizado",
                error:err
            });
        });  
    },

    delete:(request, response)=>{
        let id=request.params.id;
        db.collection('users').doc(id).get().then((doc) => {
                    let user= doc.data();
                    admin.auth().getUserByEmail(user.email).then((userRecord) => {
                        admin.auth().deleteUser(userRecord.uid).then(()=> {
                            db.collection("users").doc(id).delete().then(()=> {
                                return response.status(200).send({
                                    status: 'success',
                                    message: "Usuario eliminado",
                                });
                            });
                        });
                    });  
        });
    },




    /* notificacion: (request, response) => {
        var params = request.body;
        var token = params.token;
        var payload = {
            data: {
                key: "Hola"
            }
        };
        console.log(token)
                var options={
                    priority:'high',
                    timeToLive: 60*60*24
                };
         

        //DENTRO DEL BUCLE ENVIAR A CADA TOKEN DE MENSAJE LAS CONSULTAS DEL DIA ACTUAL
        messaging.sendToDevice(token, payload).then((response) => {
            console.log("mensaje enviado" + response)
            return response.status(200).send({
                status: 'success',
                message: "mensaje enviado"
            });

        }).catch((error) => {
            console.log("mensaje no enviado" + error)
            return response.status(200).send({
                status: 'success',
                message: "mensaje no enviado"
            });
        })
    } */
}

module.exports = controller;