import React, { Component } from 'react';
import { PayPalButton, paypalConf } from '../paypal'
import { auth } from '../db';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';
import { Redirect, Link } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import StripeCheckout from 'react-stripe-checkout';
import moment from 'moment'

import WOW from 'wowjs'

class Compra extends Component {
    url = Global.url
    paypalConf = paypalConf;
    PayPalButton = PayPalButton;
    userId = null;
    loading = true;
    errorCarrito = false;
    pvp = 0;

    nombreRef = React.createRef();
    apellidosRef = React.createRef();
    telefonoRef = React.createRef();
    emailRef = React.createRef();
    direccionRef = React.createRef();
    municipioRef = React.createRef();
    cpRef = React.createRef();
    provinciaRef = React.createRef();


    state = {
        carrito: [],
        pedido: {},
        identity: true,
        user: {},
        loadedUser: false,
        buttons: false,
        completed: false
    }

    componentDidMount() {
        this.getCarrito();

            new WOW.WOW({
                live: false
            }).init();
        
    
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



        this.validator = new SimpleReactValidator({
            locale: 'es',
            validators: {
                names_surnames: {
                    message: 'El campo debe contener letras y espacios',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && params.indexOf(val) === -1
                    },

                },
                email2: {
                    message: 'El email no es valido',
                    rule: (val, params, validator) => {
                        // eslint-disable-next-line
                        return validator.helpers.testRegex(val, /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i) && params.indexOf(val) === -1
                    },
                },
                telefono: {
                    message: 'El telefono no es valido',
                    rule: (val, params, validator) => {
                        // eslint-disable-next-line
                        return validator.helpers.testRegex(val, /^[896]\d{8}$/) && params.indexOf(val) === -1
                    },
                },
                dni: {
                    message: 'El DNI no es valido',
                    rule: (val, params, validator) => {
                        // eslint-disable-next-line
                        return validator.helpers.testRegex(val, /^\d{8}[a-zA-Z]$/) && params.indexOf(val) === -1
                    },
                }
            },
            messages: {
                required: 'Este campo es obligatorio',
                alpha_num_space: 'Solo se permiten caracteres alfanumericos',
                numeric: 'Solo se permiten numeros',
                email: 'Email no es correcto',
                alpha_space: 'Solo se permiten letras y espacios'

            },
        });
    }

    getCarrito = () => {
        axios.get(this.url + 'carrito').then((response) => {
            if (response.data.status === 'success' && response.data.carrito) {

                this.setState({
                    carrito: response.data.carrito,
                })
                this.loading = false;
            } else {
                this.loading = false;
                this.errorCarrito = true;
            }

        });
    }


    getUser = (id) => {
        axios.get(this.url + 'getuser/' + id).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    user: response.data.user,
                    loadedUser: true
                })
            }
        })
    }


    changeState = () => {
        this.setState({
            pedido: {
                nombre: this.nombreRef.current.value,
                apellidos: this.apellidosRef.current.value,
                telefono: this.telefonoRef.current.value,
                email: this.emailRef.current.value,
                provincia: this.provinciaRef.current.value,
                municipio: this.municipioRef.current.value,
                cp: this.cpRef.current.value,
                direccion: this.direccionRef.current.value,
            }
        }, () => {
            if (this.validator.allValid()) {
                this.setState({
                    buttons: true
                })

            } else {
                this.setState({
                    buttons: false
                })
            }
        });

    }


    /* STRIPE */

    onToken = (token) => {
        let total = this.pvp;
        let save_pedido = {
            id_usuario: this.userId,
            detalles: {
                direccion: this.state.pedido.direccion,
                provincia: this.state.pedido.provincia,
                telefono: this.state.pedido.telefono,
                email: this.state.pedido.email,
                municipio: this.state.pedido.municipio,
                cp: this.state.pedido.cp,
                nombre: this.state.pedido.nombre,
                apellidos: this.state.pedido.apellidos
            },
            fecha: moment().format("DD/MM/YYYY"),
            precio_total: this.pvp,
            productos: this.state.carrito,
            estado: 'pendiente'
        }

        axios.post(this.url + 'pedido/generar', { save_pedido }).then((response) => {
            if (response.data.status === 'success') {
                let pedidoId = response.data.pedidoId;
                axios.post(this.url + 'pago', { token, total }).then((response) => {
                    if (response.data.status === 'success') {
                        swal(
                            'Compra realizada correctamente',
                            'En breves confirmaremos su pedido, ID de pedido: ' + pedidoId,
                            'success'
                        );

                        axios.post(this.url + 'email/pedido');

                        this.setState({
                            completed: true
                        })
                    } else {
                        swal(
                            'Compra no realizada',
                            'Ha ocurrido un error con el pago',
                            'error'
                        );
                    }
                });

            } else {
                swal(
                    'Compra no realizada',
                    'Ha ocurrido un error con su pedido',
                    'error'
                );
            }
        });
    }

    /*  */



    /* PAYPAL */
    payment = (data, actions) => {
        const payment = {
            transactions: [
                {
                    amount: {
                        total: this.pvp,
                        currency: this.paypalConf.currency
                    },
                    description: 'Compra en Tope-Vision',
                    custom: this.state.pedido.email || ''
                }
            ],
            note_to_payer: 'Contactanos para cualquier duda en opticatopevision@gmail.com',
        };

        return actions.payment.create({ payment });
    };

    onAuthorize = (data, actions) => {

        let save_pedido = {
            id_usuario: this.userId,
            detalles: {
                direccion: this.state.pedido.direccion,
                provincia: this.state.pedido.provincia,
                telefono: this.state.pedido.telefono,
                email: this.state.pedido.email,
                municipio: this.state.pedido.municipio,
                cp: this.state.pedido.cp,
                nombre: this.state.pedido.nombre,
                apellidos: this.state.pedido.apellidos
            },
            fecha: moment().format("DD/MM/YYYY"),
            precio_total: this.pvp,
            productos: this.state.carrito,
            estado: 'pendiente'
        }

        axios.post(this.url + 'pedido/generar', { save_pedido }).then((response) => {
            if (response.data.status === 'success') {
                let pedidoId = response.data.pedidoId;
                return actions.payment.execute().then(response => {
                    swal(
                        'Compra realizada correctamente',
                        'En breves confirmaremos su pedido, ID: ' + pedidoId,
                        'success'
                    );

                    axios.post(this.url + 'email/pedido');

                    this.setState({
                        completed: true
                    })
                }).catch(error => {
                    swal(
                        'Compra no realizada',
                        'Ha ocurrido un error en el pago',
                        'error'
                    );
                })

            } else {
                swal(
                    'Compra no realizada',
                    'Ha ocurrido un error con su pedido',
                    'error'
                );
            }
        });

    };

    onError = (error) => {
        swal(
            'Pago no realizado',
            'Intentelo mas tarde',
            'error'
        );
    };

    /*  */

    render() {
        if (this.state.identity === false) {
            return (
                <Redirect to="/login" />
            )
        }
        if (this.state.completed === true) {
            return (
                <div id="compra" className="container-fluid mt-4">
                    <h1 className="cargando">Gracias por confiar en Optica Tope Vision</h1>
                    <p>En breve nos pondremos en contacto con usted</p>
                    <Link to="/" className="btn btn-success">Volver a Inicio</Link>
                </div>
            )
        }

        var carrito;
        this.pvp = 0;
        if (this.state.carrito.length >= 1) {
            carrito = this.state.carrito.map((data, i) => {
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
        } else if (this.errorCarrito === true && this.loading === false) {
            carrito = <h1 className="mt-5 text-center error">Error al procesar compra</h1>
        } else {
            carrito =
                <h1 className="mt-5 text-center cargando">Cargando...</h1>
        }

        if (this.state.loadedUser === true) {
            return (
                <div id="compra" className="container-fluid mt-4">
                    <div className="row ">
                        <div className="col-12 text-left m-4 wow fadeInRight">
                            <h2>Procesando compra</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div id="direciones" className="col-md-6 col-12 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.3s">
                            <div className="form-group text-left">
                                <label htmlFor="nombre" className="ml-2">Nombre</label>
                                <input id="nombre" className="form-control mr-2 ml-2" type="text" value={this.state.user.nombre} name="nombre" ref={this.nombreRef} /* onChange={this.changeState} */ onKeyUp={this.changeState} required />
                                {this.validator.message('nombre', this.state.user.nombre, 'required|names_surnames')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="apellidos" className="ml-2">Apellidos</label>
                                <input className="form-control mr-2 ml-2" type="text" name="apellidos" value={this.state.user.apellidos} ref={this.apellidosRef} /* onChange={this.changeState} */ onKeyUp={this.changeState} required />
                                {this.validator.message('apellidos', this.state.user.apellidos, 'required|names_surnames')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="telefono" className="ml-2">Telefono</label>
                                <input className="form-control mr-2 ml-2" type="text" name="telefono" value={this.state.user.telefono} ref={this.telefonoRef} onKeyUp={this.changeState} maxLength="9" required />
                                {this.validator.message('telefono', this.state.user.telefono, 'required|telefono')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="email" className="ml-2">Email</label>
                                <input className="form-control mr-2 ml-2" type="text" name="email" ref={this.emailRef} value={this.state.user.email} onKeyUp={this.changeState} required />
                                {this.validator.message('email', this.state.user.email, 'required|email')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="provincia" className="ml-2">Provincia</label>
                                <input className="form-control mr-2 ml-2" type="text" name="provincia" ref={this.provinciaRef} onKeyUp={this.changeState} required />
                                {this.validator.message('provincia', this.state.pedido.provincia, 'required|names_surnames')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="municipio" className="ml-2">Municipio</label>
                                <input className="form-control mr-2 ml-2" type="text" name="municipio" ref={this.municipioRef} onKeyUp={this.changeState} required />
                                {this.validator.message('municipio', this.state.pedido.municipio, 'required|names_surnames')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="cp" className="ml-2">CP</label>
                                <input className="form-control mr-2 ml-2" type="text" name="cp" ref={this.cpRef} onKeyUp={this.changeState} required maxLength="5" minLength="5" />
                                {this.validator.message('cp', this.state.pedido.cp, 'required|numeric')}
                            </div>
                            <div className="form-group text-left">
                                <label htmlFor="direccion" className="ml-2">Direccion</label>
                                <input className="form-control mr-2 ml-2" type="text" name="direccion" ref={this.direccionRef} onKeyUp={this.changeState} required />
                                {this.validator.message('direccion', this.state.pedido.direccion, 'required')}
                            </div>
                        </div>
                        <div className="col-md-6 col-12">
                            <div className="row">
                                <div id="buy-list" className="col-12 ml-3 wow fadeIn" data-wow-duration="1s" data-wow-delay="0.5s">
                                    <ul className="p-3">
                                        {carrito}
                                        <li className="list-group-item m-2 text-right"><p className="h6 mr-3">Total a pagar: {this.pvp} €</p></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div id="pagos" className="col-12 ml-3 wow fadeInUp" data-wow-duration="1s" data-wow-delay="0.5s">
                                    {this.state.buttons === true
                                        ? <React.Fragment>
                                            <StripeCheckout ComponentClass="boton-pago" locale="es" currency="EUR" stripeKey="pk_test_xQbGMr8UIbCrgGFLNQ2l5LbI00SVNQjKoV" token={this.onToken} amount={this.pvp * 100}  >
                                                <button className="boton-pago btn btn-stripe">Pagar con Tarjeta <img className="img-stripe" alt="img-stripe" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1280px-Stripe_Logo%2C_revised_2016.svg.png" /> </button>
                                            </StripeCheckout>
                                            <this.PayPalButton
                                                env={this.paypalConf.env}
                                                client={this.paypalConf.client}
                                                payment={(data, actions) => this.payment(data, actions)}
                                                onAuthorize={(data, actions) => this.onAuthorize(data, actions)}
                                                onError={(error) => this.onError(error)}
                                                style={this.paypalConf.style}
                                                commit
                                                locale={this.paypalConf.locale}
                                            />
                                        </React.Fragment>
                                        : <h3 className="error">Rellena los datos para habilitar pago</h3>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <h1 className="mt-5 cargando">Cargando...</h1>
            )
        }
    }
}

export default Compra;