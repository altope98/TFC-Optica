import React, { Component } from 'react';
import { auth } from '../db';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';
import { Redirect, Link } from 'react-router-dom';


class Carrito extends Component {
    url = Global.url
    userId = null;
    loading=true;

    state = {
        carrito: [],
        identity: true,
        user: {},

    }


    componentDidMount() {

        this.getCarrito();
    }
    componentWillMount() {
        if (!auth.currentUser) {
            this.setState({
                identity: false
            });
        } else {
            this.userId = this.props.location.state.userId
            if (this.userId === "null") {
                this.setState({
                    identity: false
                });
            } else {
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
    }

    getCarrito=()=>{
        axios.get(this.url + 'carrito').then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    carrito: response.data.carrito,
                })
                this.loading=false;
            } 
        });
    }


    getUser = (id) => {
        axios.get(this.url + 'getuser/' + id).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    user: response.data.user
                })
                /* this.getCarrito(); */
                
            }
        })
    }

    agregarItem = (id) => {
        axios.post(this.url + 'carrito/agregar', { item_id: id }).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    carrito: response.data.carrito
                })
            } 

        });
    }

    reducirItem = (id) => {
        axios.post(this.url + 'carrito/quitar', { item_id: id }).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    carrito: response.data.carrito
                })
            } 

        });
    }

    eliminarItem=(id)=>{
        axios.post(this.url + 'carrito/eliminar', { item_id: id }).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    carrito: response.data.carrito
                })
                swal(
                    'Producto eliminado correctamente',
                    'El producto se ha eliminado del carrito correctamente',
                    'success'
                );

            } else {
                swal(
                    'El producto no se ha eliminado correctamente',
                    'Ha ocurrido un error al eliminar el producto del carrito, intentelo mas tarde',
                    'error'
                );
            }

        });
    }

    procesarCompra=()=>{

    }

    
    render() {

        var carrito;
        if (this.state.carrito.length >= 1) {
            carrito = this.state.carrito.map((data, i) => {
                return (

                    <li key={i} className="list-group-item m-2">
                        <div className="row">
                            <div className="col-md-4 col-12 text-md-left text-center" >
                                <img src={data.imagen} className="imagencarrito" alt="Cartimg" />
                                <p className="d-md-inline  m-3">{data.nombre}</p>
                            </div>
                            <div className="col-md-8 col-12 align-self-center">
                                <div className="row justify-content-center">
                                    <div className="col mt-2">
                                        <div className="row flex-nowrap align-items-center justify-content-center align-self-center">
                                            <div className="col">
                                                <button className="btn btn-danger m-1" onClick={() => this.reducirItem(data.id)}>-</button>
                                            </div>
                                            <div className="col text-center p-1"  style={{backgroundColor:'#A4AAA5', border:'1px solid black', borderRadius:'4px',color:'white'}}>
                                                    <label className="text-center "> {data.cantidad}</label>
                                            </div>
                                            <div className="col">
                                                <button className="btn btn-success m-1" onClick={() => this.agregarItem(data.id)}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-12 col-md-2 mt-2">
                                            <label className="text-center ">Total: <strong>{data.precio_total} €</strong></label>
                                    </div>
                                    <div className="col mt-2">
                                        <button className="btn btn-danger mr-4 ml-4" onClick={() => this.eliminarItem(data.id)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                );
            });
        } else if (this.state.carrito.length===0 && this.loading===false) {
            carrito = <h1 className="mt-5 text-center error">No hay productos en el carrito</h1>
        } else {
            carrito =
                <h1 className="mt-5 text-center cargando">Cargando...</h1>
        }

        if (this.state.identity === false) {
            return (
                <Redirect to="/login" />
            )
        } else {
            return (
                <div id="carrito" className="container mt-4">
                    <div className="row ">
                        <div className="col-12 text-left m-4">
                        <h2>Carrito</h2>
                        </div>
                    </div>
                    <div className="row">
                    <div id="carrito-list" className="col-md-8 col-12 m-2">
                        <ul className="p-3">
                            {carrito}
                        </ul>
                    </div>
                    <div id="boton-procesar" className="col-12 col-md-3 align-self-center">
                        <div className="row justify-content-center">
                        <Link to={{ pathname: "/compra", state: { userId: this.userId } }} className="btn btn-primary" onClick={() => this.procesarCompra()}>Procesar compra</Link>
                        </div>
                    </div>

                    </div>

                </div>
            );
        } 
    }
}

export default Carrito;