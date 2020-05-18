import React, { Component } from 'react';



class UsuarioPedidos extends Component {
    state = {  }

    


    render() { 

        var pedidos;
        this.pvp = 0;
        if (this.state.pedidos.length >= 1) {
            pedidos = this.state.pedidos.map((data, i) => {
                this.pvp = this.pvp + data.precio_total;
                return (

                    <li key={i} className="list-group-item m-2">
                        <div className="row">
                            <div className=" col-8 text-md-left text-center" >
                                <img src={data.imagen} className="imagencarrito" alt="Cartimg" />
                                <p className="d-inline  m-3">{data.nombre}</p>
                            </div>
                            <div className="col-4 align-self-center">
                                <div className="row justify-content-center">
                                    <div className="col mt-2">
                                        <div className="row flex-nowrap align-items-center justify-content-center align-self-center">
                                            <div className="col text-center p-1" >
                                                <label className="text-center ">Cantidad: <strong>{data.cantidad}</strong></label>
                                            </div>
                                            <div className="col text-center p-1" >
                                                <label className="text-center ">Total: <strong>{data.precio_total} €</strong></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            });
        } else if (this.errorPedidos === true && this.loading === false) {
            pedidos = <h1 className="mt-5 text-center error">No hay pedidos</h1>
        } else {
            pedidos =
                <h1 className="mt-5 text-center cargando">Cargando...</h1>
        }


        if (this.state.loadedUser === true) {

        return ( 
            <div className="col-md-6 col-12">
                            <div className="row">
                                <div id="pedidos-list" className="col-12 ml-3">
                                    <ul className="p-3">
                                        {pedidos}
                                        <li className="list-group-item m-2 text-right"><p className="h6 mr-3">Total a pagar: {this.pvp} €</p></li>
                                    </ul>
                                </div>
                            </div>
            </div>
        );
        } else {
            return (
                <h1 className="cargando">Cargando...</h1>
            )
        }
    }
}
 
export default UsuarioPedidos;