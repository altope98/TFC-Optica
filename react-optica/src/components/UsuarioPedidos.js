import React, { Component } from 'react';
import { auth } from '../db';
import axios from "axios";
import Global from "../Global";
import { Modal, Button } from 'react-bootstrap';



class UsuarioPedidos extends Component {
    userId = null;
    url = Global.url
    pedidoaux = []
    state = {
        identity: false,
        user: {},
        status: null,
        loading: true,
        pedidos: [],
        errorPedidos: false,
        show: false,
    }
    componentDidMount() {

        if (!auth.currentUser) {
            this.setState({
                identity: false
            });
        } else {
            this.userId = this.props.match.params.id
            axios.get(this.url + 'getemail/' + this.userId).then((response) => {
                if (response.data.status === 'success' && response.data.email === auth.currentUser.email) {
                    this.getUser(this.userId);
                } else {
                    this.setState({
                        identity: false
                    });

                }
            })
        }
    }

    getUser = (id) => {
        axios.get(this.url + 'getuser/' + id).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    user: response.data.user,
                    identity: true
                })
                this.getPedidos();

            }
        })
    }

    getPedidos = () => {
        axios.get(this.url + 'pedidos/' + this.userId).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    pedidos: response.data.pedidos,
                    loading: false
                })
            } else {
                this.setState({
                    loading: false,
                    errorPedidos: true
                })

            }
        });
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



    render() {
        var pedidos;
        this.pvp = 0;
        if (this.state.pedidos.length >= 1) {
            pedidos = this.state.pedidos.map((data, i) => {
                return (
                    <li key={i} className="list-group-item m-2">
                        <div className="row">
                            <div className="col-md-4 col-12 mt-2 mb-2 text-md-left text-center" >
                                <p className="font-weight-bold">Fecha:</p>
                                <p >{data.pedido.fecha}</p>
                            </div>
                            <div className="col-md-4 col-12 mt-2 mb-2 estados-pedidos">
                                <div className="row justify-content-center">
                                    <div className=" col-4 " >
                                        <p className="font-weight-bold">PVP:</p>
                                        <p>{data.pedido.precio_total}€</p>
                                    </div>
                                    <div className=" col-4" >
                                        <p className="font-weight-bold">Estado:</p>
                                        <p >{data.pedido.estado}</p>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-md-4 col-12 mt-2 mb-2  text-center" >
                                <button className="btn btn-success" onClick={() => this.pulsadoEvento(data.pedidoId)}>Detalle</button>
                            </div>
                        </div>
                    </li>
                );
            });
        } else if (this.state.errorPedidos === true && this.state.loading === false) {
            pedidos = <h1 className="mt-5 text-center error ">No hay pedidos</h1>
        } else {
            pedidos =
                <h1 className="mt-5 text-center cargando  ">Cargando...</h1>
        }


        if (this.state.identity === true && this.state.loading === false) {

            return (
                <div className="col-12  wow fadeInRight">
                    <div className="row">
                        <div id="pedidos-list" className="col-12 ml-3">
                            <h1 className="m-2 text-md-left text-center ">Mis pedidos</h1>
                            <ul className="p-3">
                                {pedidos}
                            </ul>
                        </div>
                    </div>
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
        } else {
            return (
                <h1 className="cargando ">Cargando...</h1>
            )
        }
    }
}

export default UsuarioPedidos;