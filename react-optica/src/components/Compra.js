import React, { Component } from 'react';
import { auth } from '../db';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';
import { Redirect, Link } from 'react-router-dom';


class Compra extends Component {
    url = Global.url
    userId = null;
    loading=true;
    errorCarrito=false;

    state = {
        carrito: [],
        identity: true,
        user: {},
    }

    componentDidMount(){
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
            if (response.data.status === 'success' && response.data.carrito) {
                
                    this.setState({
                        carrito: response.data.carrito,
                    })
                    this.loading=false;
                }else{
                    this.loading=false;
                    this.errorCarrito=true;
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




    render() {
        if (this.state.identity === false) {
            return (
                <Redirect to="/login" />
            )
        }

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
                                            <div className="col text-center p-1" style={{ backgroundColor: '#A4AAA5', border: '1px solid black', borderRadius: '4px', color: 'white' }}>
                                                <label className="text-center ">{data.cantidad}</label>
                                            </div>
                                            <div className="col">
                                                <button className="btn btn-success m-1" onClick={() => this.agregarItem(data.id)}>+</button>
                                            </div>
                                        </div>
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
        }else if (this.errorCarrito===true && this.loading===false) {
            carrito = <h1 className="mt-5 text-center">Error al procesar compra</h1>
        } else {
            carrito =
                <h1 className="mt-5 text-center">Cargando...</h1>
        }
        return (
            <div id="compra" className="container-fluid mt-4">
                <h1>Compra</h1>
                <ul>
                    {carrito}
                </ul>
            </div>
        );
    }
}

export default Compra;