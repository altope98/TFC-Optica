import React, { Component } from 'react';
import axios from "axios";
import Global from "../../Global"
import swal from 'sweetalert';
import { Modal, Button } from 'react-bootstrap';



class PedidosAdmin extends Component {
    url = Global.url;
    pedidoaux = []

    state = {
        pedidos: [],
        status: null,
    }


    componentWillMount() {
        axios.get(this.url + 'pendingpedidos').then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    pedidos: response.data.pedidos,
                    status: 'success'
                });


            } else {
                this.setState({
                    status: 'error'
                });

            }
        })


    }


    pulsadoEvento = (id) => {
        this.state.pedidos.forEach((element, i) => {
            if (id === element.pedidoId) {
                this.pedidoaux.push(element)
                this.setState({
                    show: true
                })
            }
        })
    }

    cerradoEvento = () => {
        this.setState({
            show: false
        });
        this.pedidoaux = [];
    }




    updatePedido(id, i, estado) {
        let state = estado
        let pedido = this.state.pedidos[i].pedido;

        axios.put(this.url + 'pedido', { state, id }).then((response) => {
            if (response.data.status === 'success') {
                let pedidosaux = this.state.pedidos;
                if (state === 'terminado' || state === 'rechazado') { //confirmado, enviado, terminado, rechazado
                    pedidosaux.splice(i, 1);
                    this.setState({
                        pedidos: pedidosaux,
                        status: 'success'
                    });
                }else{
                    pedidosaux[i].pedido.estado = state
                    this.setState({
                        pedidos: pedidosaux,
                        status: 'success'
                    });
                }

               

                swal(
                    'Pedido actualizado correctamente',
                    'Se enviara un email al usuario con nuevos datos de su pedido',
                    'success'
                );
                this.forceUpdate();


                if (state === 'rechazado' || state === 'confirmado' || state === 'enviado') {
                    axios.post(this.url + 'email/adminpedido', { pedido, state });
                }

            } else {
                swal(
                    'Pedido no se ha actualizado correctamente',
                    'Pedido no actualizado',
                    'error'
                );
            }
        });
    }
    render() {
        if (this.state.pedidos.length >= 1) {
            var listPedidos = this.state.pedidos.map((data, i) => {
                return (
                    <li className="list-group-item " key={i} >
                        <div className="row">
                            <div className="col-3 m-1 pedido-list-item" onClick={() => this.pulsadoEvento(data.pedidoId)}>
                                <h5>{data.pedido.detalles.nombre + ' ' + data.pedido.detalles.apellidos}</h5>
                                <p>{data.pedido.detalles.email}</p>
                            </div>
                            <div className="col-md-3 col-9 pedido-list-item" onClick={() => this.pulsadoEvento(data.pedidoId)}>
                                <div className="row  ">
                                    <div className="col-5 m-1">
                                        <h6>Fecha: </h6>
                                        <p>{data.pedido.fecha}</p>
                                    </div>
                                    <div className="col-5 m-1">
                                        <h6>Estado:</h6>
                                        <p>{data.pedido.estado}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-5 col-12 m-1">
                                <button className="btn btn-success mr-1 ml-1" onClick={() => this.updatePedido(data.pedidoId, i, 'confirmado')}>Confirmar</button>
                                <button className="btn btn-primary mr-1 ml-1" onClick={() => this.updatePedido(data.pedidoId, i, 'enviado')}>Enviado</button>
                                <button className="btn btn-secondary mr-1 ml-1" onClick={() => this.updatePedido(data.pedidoId, i, 'terminado')}>Terminado</button>
                                <button className="btn btn-danger mr-1 ml-1" onClick={() => this.updatePedido(data.pedidoId, i, 'rechazado')}>Rechazar</button>
                            </div>

                        </div>

                    </li>

                )
            })

            return (
                <div id="clientes " className="text-center">
                    <ul className="list-group">
                        {listPedidos}
                    </ul>
                    {/* MODAL DE DETALLE DE PRODUCTO */}
                    {this.pedidoaux.length === 1 &&
                        <Modal show={this.state.show} onHide={this.cerradoEvento} size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-center">
                                    <h4>ID: {this.pedidoaux[0].pedidoId}</h4>
                                    <p><strong>Fecha: </strong>{this.pedidoaux[0].pedido.fecha}</p>
                                    <p><strong>Direccion de envio: </strong>{this.pedidoaux[0].pedido.detalles.direccion + ', ' + this.pedidoaux[0].pedido.detalles.municipio + ', ' + this.pedidoaux[0].pedido.detalles.provincia + ' - ' + this.pedidoaux[0].pedido.detalles.cp}</p>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="infocitacontacto pl-3">
                                    <h6 className="m-1 ">Telefono: {this.pedidoaux[0].pedido.detalles.telefono}</h6>
                                    <h6 className="m-1 ">Email: {this.pedidoaux[0].pedido.detalles.email}</h6>
                                    <h6 className="m-1">ID usuario: {this.pedidoaux[0].pedido.id_usuario}</h6>
                                </div>
                                <div className="infocarrito pl-3">
                                    <ul>{
                                        this.pedidoaux[0].pedido.productos.map((data, i) => {
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
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })

                                    }
                                        <li className="list-group-item m-2 text-right"><p className="h6 mr-3">Total: {this.pedidoaux[0].pedido.precio_total} €</p></li>
                                    </ul>
                                </div>


                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={this.cerradoEvento}>
                                    Cerrar
                        </Button>
                            </Modal.Footer>
                        </Modal>

                    }

                </div>
            );
        } else if (this.state.pedidos.length === undefined || this.state.status === 'error') {
            return (
                <div id="clientes" className="text-center">
                    <h1 className="mt-5 error">No hay pedidos para mostrar</h1>
                </div>
            );
        } else {
            return (
                <div id="clientes" className="text-center">
                    <h1 className="mt-5 cargando">Cargando...</h1>
                </div>
            );
        }
    }
}

export default PedidosAdmin;