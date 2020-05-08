'use strict'

var db = require('../index');


var controller={
    getProductById:(request, response)=>{
        let id= request.params.id;

        db.collection('productos').doc(id).get()
        .then(doc => {
            if (!doc.exists) {
                return response.status(404).send({
                    status: 'error',
                    message: 'No existe producto'
                });
            }else{
                return response.status(200).send({
                    status: 'success',
                    message: "Producto encontrado",
                    producto: doc.data()
                });
            }

            
        })
        .catch(err => {
            return response.status(500).send({
                status: 'error',
                message: 'Error al obtener producto',
                error:err
            });
        });
    },

    getProductsByFilters:(request, response)=>{
        let categoria= request.body.categoria;
        let genero= request.body.genero;
        let edad= request.body.edad;
        console.log(categoria, genero, edad)
        let productos=[];

        db.collection('productos').where('categoria', '==', categoria).where('tamaño', '==', edad).where('genero', '==', genero).get()
        .then(snapshot => {
            if (snapshot.empty) {
                return response.status(200).send({
                    status: 'error',
                    message: 'No existen productos'
                });
            }

            snapshot.forEach(doc => {
                productos.push({productId:doc.id, product:doc.data()});                
            });

            return response.status(200).send({
                status: 'success',
                message: "Productos encontrados",
                productos
            });
        })
        .catch(err => {
            return response.status(500).send({
                status: 'error',
                message: 'Error al obtener productos',
                error:err
            });
        });

    }
}

module.exports=controller;