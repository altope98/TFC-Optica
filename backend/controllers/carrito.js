'use strict';

var db = require('../index');

var controller= {
    iniciarCarrito:(request)=> {
        if (request.session.carrito == undefined) {
            request.session.carrito = [];
        }
        return request.session.carrito
    },

    verificar:(carrito, id)=>{
        let pos= -1;
        carrito.forEach((element, i) => {
            if(element.id==id){
                pos=i;
            }
        });
        return pos;
    },

    agregarItem:(request, response) =>{
        if (request.session.carrito == undefined) {
            request.session.carrito = [];
        }
        let carrito=request.session.carrito;
        let id = request.body.item_id;
        db.collection('productos').doc(id).get()
            .then(doc => {
                if (!doc.exists) {
                    return response.status(404).send({
                        status: 'error',
                        message: 'No existe producto'
                    });
                }else{

                    let pos=controller.verificar(carrito, id);
                    if(pos==-1){
                        let item={
                            id: doc.id,
                            nombre: doc.data().nombre,
                            cantidad: 1,
                            precio: doc.data().precio,
                            precio_total: doc.data().precio,
                            imagen: doc.data().imagen
                        }
                        carrito.push(item);
                    }else{
                        let item= carrito[pos];
                        item.cantidad=item.cantidad+1;
                        item.precio_total=item.cantidad*item.precio;
                        carrito[pos]=item;
                    }

                    request.session.carrito=carrito;
                    return response.status(200).send({
                        status: 'success',
                        message: "Producto agregado",
                        carrito: request.session.carrito
                    });
                }
            }).catch(err => {
                return response.status(500).send({
                    status: 'error',
                    message: 'Error al obtener producto',
                    error:err
                });
            });
    },

    quitarItem: (request, response)=>{
        let carrito=request.session.carrito;
        let id=request.body.item_id;
        let pos= controller.verificar(carrito,id);
        let item=carrito[pos];
        if(item.cantidad > 1){
            item.cantidad = item.cantidad-1;
            item.precio_total=item.cantidad*item.precio;
            carrito[pos]=item;
            request.session.carrito= carrito;

            
        }else{
            carrito.splice(pos,1);
            request.session.carrito= carrito;
        }

        return response.status(200).send({
            status: 'success',
            message: "Producto eliminado",
            carrito: request.session.carrito
        });
    },

    mostrarCarrito:(request, response)=>{
        let carrito=request.session.carrito;
        return response.status(200).send({
            status: 'success',
            carrito
        });
    },

    updateCarrito:(request, response)=>{
        let carrito=request.body.carrito;
        request.session.carrito=carrito

    },


    
}


module.exports = controller;