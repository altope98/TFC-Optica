import React, { Component } from 'react';
import { auth } from '../db';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';
import SimpleReactValidator from 'simple-react-validator';
import moment from 'moment'
import {storage} from '../db';

class PerfilUsuario extends Component {
    url = Global.url
    userId = null;
    admin = null;
    listHistorial = null;
    nombreRef = React.createRef();
    apellidosRef = React.createRef();
    dniRef = React.createRef();
    telefonoRef = React.createRef();
    textoHistorialRef = React.createRef();
    fechaHistorialRef = React.createRef();

    state = {
        identity: true,
        user: {},
        status: null,
        loading: true,
        archivo: 'default',
        loading_file: false,
        eliminado:false,
    }

    componentWillMount() {

        if (this.props.match.params.admin) {
            this.admin = true

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

        if (!auth.currentUser) {
            this.setState({
                identity: false
            });
        } else {
            if (this.admin === true) {
                this.userId = this.props.match.params.id
                let email = auth.currentUser.email;
                axios.get(this.url + 'user/' + email).then((response) => {
                    if (response.data.status === 'success' && response.data.user.email === auth.currentUser.email) {
                        this.getUser(this.userId);

                    } else {
                        this.setState({
                            identity: false
                        });
                    }
                })


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

    }

    getUser = (id) => {
        axios.get(this.url + 'getuser/' + id).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    user: response.data.user,
                    historial: response.data.user.historial,
                    loading: false
                })
            }

        })
    }

    changeState = () => {
        this.setState({
            user: {
                nombre: this.nombreRef.current.value,
                apellidos: this.apellidosRef.current.value,
                telefono: this.telefonoRef.current.value,
                dni: this.dniRef.current.value,
                historial: this.state.historial,
                imagen:this.state.user.imagen
            }
        });
    }

    addHistorial = () => {
        let historialaux = this.state.historial;

        let add = { texto: this.textoHistorialRef.current.value, fecha: moment(this.fechaHistorialRef.current.value).format("DD/MM/YYYY") }
        historialaux.push(add)

        this.textoHistorialRef.current.value = ""
        this.setState({
            historial: historialaux
        })


    }

    recogerFoto = (event) => {
        this.setState({
            archivo: event.target.files[0]
        })
    }

    recibirFormulario = (event) => {
        event.preventDefault();

        this.changeState();

        if (this.validator.allValid()) {

            if (this.state.archivo !== 'default') {
                this.setState({
                    loading_file: true
                })
                storage.ref(this.state.archivo.name).put(this.state.archivo).then(() => {
                    storage.ref().child(this.state.archivo.name).getDownloadURL().then(
                        url => {
                            this.setState({
                                loading_file: false
                            })
                            let user = this.state.user;
                            axios.put(this.url + 'user', { user, userId: this.userId, url }).then((response) => {
                                if (response.data.status === 'success') {
                                    this.setState({
                                        user: {
                                            nombre: this.nombreRef.current.value,
                                            apellidos: this.apellidosRef.current.value,
                                            telefono: this.telefonoRef.current.value,
                                            dni: this.dniRef.current.value,
                                            historial: this.state.historial,
                                            imagen:url
                                        },
                                        status: 'success'
                                    });
                                    swal(
                                        'Usuario actualizado',
                                        'Tu perfil se ha actualizado correctamente',
                                        'success'
                                    );
                                } else {
                                    this.setState({
                                        status: 'failed'
                                    });
                                    swal(
                                        'Usuario no actualizado',
                                        'Tu perfil no se ha actualizado correctamente',
                                        'error'
                                    );
                                }
                            });
                        });
                });
            } else {
                let user = this.state.user;
                axios.put(this.url + 'user', { user, userId: this.userId, url:this.state.user.imagen }).then((response) => {
                    if (response.data.status === 'success') {
                        this.setState({
                            user: {
                                nombre: this.nombreRef.current.value,
                                apellidos: this.apellidosRef.current.value,
                                telefono: this.telefonoRef.current.value,
                                dni: this.dniRef.current.value,
                                historial: this.state.historial,
                                imagen:this.state.user.imagen
                            },
                            status: 'success'
                        });
                        swal(
                            'Usuario actualizado',
                            'Tu perfil se ha actualizado correctamente',
                            'success'
                        );
                    } else {
                        this.setState({
                            status: 'failed'
                        });
                        swal(
                            'Usuario no actualizado',
                            'Tu perfil no se ha actualizado correctamente',
                            'error'
                        );
                    }
                });
            }

        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'failed'
            })
        }

    }

    eliminarUsuario=()=>{
        let id=this.userId
        axios.delete(this.url +'user/'+id).then((response) => {
            if(response.data.status === 'success') {
                swal(
                    'Usuario eliminado',
                    'El usuario ha sido eliminado correctamente',
                    'success'
                );

            }else{
                swal(
                    'Usuario no eliminado',
                    'Se ha producido un error al eliminar usuario',
                    'error'
                );
            }
        }); 
    }



    render() {

        if (this.state.loading === false) {
            return (

                <div id="info" className="col-lg-12 mt-3">
                    {this.state.identity === true
                        ? <React.Fragment>
                            {this.admin === true
                                ? <React.Fragment>
                                    <h2>
                                        Perfil de: {this.state.user.nombre + ' ' + this.state.user.apellidos}
                                    </h2><small>{this.state.user.email}</small>
                                </React.Fragment>
                                : <h2>
                                    Mi perfil   -   {this.state.user.nombre + ' ' + this.state.user.apellidos}
                                </h2>
                            }
                            <hr />
                            <div className="row">

                                <img className="user-image" src={this.state.user.imagen} alt="user" />



                            </div>
                            <div className="row">
                                <form className="col-md-5 ml-4 pl-0" onSubmit={this.recibirFormulario} >
                                    <div className="form-group text-left">
                                        <label htmlFor="nombre" className="ml-2">Nombre</label>
                                        <input id="nombre" className="form-control" type="text" value={this.state.user.nombre} name="nombre" ref={this.nombreRef} onChange={this.changeState} required />
                                        {this.validator.message('nombre', this.state.user.nombre, 'required|names_surnames')}
                                    </div>
                                    <div className="form-group text-left">
                                        <label htmlFor="apellidos" className="ml-2">Apellidos</label>
                                        <input className="form-control" type="text" name="apellidos" value={this.state.user.apellidos} ref={this.apellidosRef} onChange={this.changeState} required />
                                        {this.validator.message('apellidos', this.state.user.apellidos, 'required|names_surnames')}
                                    </div>
                                    <div className="form-group text-left">
                                        <label htmlFor="telefono" className="ml-2">Telefono</label>
                                        <input className="form-control" type="text" name="telefono" value={this.state.user.telefono} ref={this.telefonoRef} onChange={this.changeState} maxLength="9" required />
                                        {this.validator.message('telefono', this.state.user.telefono, 'required|telefono')}
                                    </div>
                                    <div className="form-group text-left">
                                        <label htmlFor="dni" className="ml-2">DNI</label>
                                        <input className="form-control" type="text" name="dni" value={this.state.user.dni} ref={this.dniRef} onChange={this.changeState} required />
                                        {this.validator.message('dni', this.state.user.dni, 'required|dni')}
                                    </div>
                                    <div className="form-group text-left">
                                        <label htmlFor="image" className="ml-2">Avatar</label>
                                        <input className="form-control-file mr-2 ml-2" type="file" name="imagen" onChange={(e) => this.recogerFoto(e)} />
                                        {this.state.loading_file === true &&
                                            <small>Cargando imagen...</small>
                                        }
                                    </div>

                                    <div className="clearfix"></div>
                                    <input type="submit" value="Actualizar datos" className="btn btn-success" />
                                </form>


                                {this.admin === true &&
                                    <React.Fragment>
                                        <div className="col-md-6 ml-5">
                                            <div className="row">
                                                <div className="col-12">
                                                    <label htmlFor="textoHistorial">Agregar al historial</label>
                                                    <input className="form-control mt-1 mb-1" type="text" name="textoHistorial" ref={this.textoHistorialRef} required />
                                                    <input className="form-control mt-1 mb-1" type="date" name="fechaHistorial" ref={this.fechaHistorialRef} required />
                                                    <input className="btn btn-success mt-1 mb-1" type="button" value="Añadir" onClick={this.addHistorial} />
                                                </div>


                                                <div className="historial col-12 mt-4">
                                                    <ul className="list-group">
                                                        {this.state.historial !== undefined && this.state.historial.length !== null && this.state.historial.length >= 1

                                                            ? this.listHistorial = this.state.historial.map((data, i) => {
                                                                return (
                                                                    <li className="list-group-item" key={i} >
                                                                        <p>{data.texto + ' - ' + data.fecha}</p>
                                                                    </li>
                                                                );
                                                            })
                                                            : <li className="list-group-item"><h3>No hay ningun historial</h3></li>

                                                        }
                                                    </ul>
                                                </div>

                                                <button className="btn btn-danger" style={{margin: "2rem auto"}} onClick={this.eliminarUsuario} >Eliminar usuario</button>
                                            </div>

                                        </div>
                                    </React.Fragment>
                                }

                            </div>
                        </React.Fragment>
                        : <React.Fragment>
                            {this.admin === true
                                ? <div id="info">
                                    <h1 className="mt-5">Problema con carga de Usuario</h1>
                                </div>
                                : <Redirect to="/tope-vision/login" />
                            }
                        </React.Fragment>
                    }


                </div>
            );
        } else {
            return (
                <div id="info">
                    <h1 className="mt-5">Cargando...</h1>
                </div>
            );
        }
    }
}

export default PerfilUsuario;