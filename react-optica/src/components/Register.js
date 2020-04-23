import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import Global from "../Global";
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';

class Register extends Component {

    nombreRef = React.createRef();
    apellidosRef = React.createRef();
    emailRef = React.createRef();
    passwordRef = React.createRef();
    password2Ref = React.createRef();
    dniRef = React.createRef();
    telefonoRef = React.createRef();

    url = Global.url;

    state = {
        user: {},
        status: null,
        password2: null,

    };

    confirmpassword=null;


    componentWillMount() {
        this.validator = new SimpleReactValidator({
            locale: 'es',
            validators: {
                names_surnames: {
                    message: 'El campo debe contener letras y espacios',
                    rule: (val, params, validator) => {
                        return validator.helpers.testRegex(val, /^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/) && params.indexOf(val) === -1
                    },
                    
                },
                email2:{
                    message: 'El email no es valido',
                    rule: (val, params, validator) => {
                        // eslint-disable-next-line
                        return validator.helpers.testRegex(val, /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i) && params.indexOf(val) === -1
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

    changeState = () => {
        this.setState({
            user: {
                nombre: this.nombreRef.current.value,
                apellidos: this.apellidosRef.current.value,
                email: this.emailRef.current.value,
                password: this.passwordRef.current.value,
                telefono: this.telefonoRef.current.value,
                dni: this.dniRef.current.value,
            },
            password2: this.password2Ref.current.value
        });
        if (this.state.password2 === this.state.user.password) {
            
                this.confirmpassword=true
           

        } else {
            
                this.confirmpassword= false
        }
    }

    recibirFormulario = (event) => {
        event.preventDefault();

        this.changeState()

        this.ejecutarFormulario();
        
    }

    ejecutarFormulario=()=>{
        if (this.confirmpassword === true) {
            if (this.validator.allValid()) {
                let user = this.state.user;
                axios.post(this.url + 'user', user).then((response) => {
                    if (response.data.status === 'success') {
                        this.setState({
                            status: 'success'
                        });
                        swal(
                            'Usuario registrado',
                            'Te has registrado correctamente',
                            'success'
                        );
                    } else {
                        this.setState({
                            status: 'failed'
                        });
                    }
                });
            } else {
                this.validator.showMessages();
                this.forceUpdate();
                this.setState({
                    status: 'failed'
                })
            }

        }
    }


    render() {
        if (this.state.status === 'success') {
            return (
                <Redirect to="/tope-vision/login" />
            )
        }
        return (

            <div id="registro" className=" col-12">
                <h2 className="text-center p-3 text-md-left">
                    Registro
                </h2>
                <hr />

                <form className="col-md-5" onSubmit={this.recibirFormulario} >
                    <div className="form-group text-left">
                        <label htmlFor="nombre" className="ml-2" >Nombre</label>
                        <input id="nombre" className="form-control mr-2 ml-2" type="text" name="nombre" ref={this.nombreRef} onChange={this.changeState} required />
                        {this.validator.message('nombre', this.state.user.nombre, 'required|names_surnames')}
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="apellidos" className="ml-2">Apellidos</label>
                        <input className="form-control mr-2 ml-2" type="text" name="apellidos" ref={this.apellidosRef} onChange={this.changeState} required />
                        {this.validator.message('apellidos', this.state.user.apellidos, 'required|names_surnames')}
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="telefono" className="ml-2">Telefono</label>
                        <input className="form-control mr-2 ml-2" type="text" name="telefono" ref={this.telefonoRef} onChange={this.changeState} maxLength="9" required />
                        {this.validator.message('telefono', this.state.user.telefono, 'required|numeric')}
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="dni" className="ml-2">DNI</label>
                        <input className="form-control mr-2 ml-2" type="text" name="dni" ref={this.dniRef} onChange={this.changeState} onBlur={this.changeState} required />
                        {this.validator.message('dni', this.state.user.dni, 'required|alpha_num')}
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="email" className="ml-2">Email</label>
                        <input className="form-control mr-2 ml-2" type="text" name="email" ref={this.emailRef} onChange={this.changeState} onBlur={this.changeState} required />
                        {this.validator.message('email', this.state.user.email, 'required|email2')}
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="password" className="ml-2">Contraseña</label>
                        <input className="form-control mr-2 ml-2" type="password" name="password" ref={this.passwordRef} onChange={this.changeState} onBlur={this.changeState} required minlength="6" />
                        {this.validator.message('password', this.state.user.password, 'required')}

                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="password2" className="ml-2">Confirmar contraseña</label>
                        <input className="form-control mr-2 ml-2" type="password" name="password2" ref={this.password2Ref} onChange={this.changeState} onBlur={this.changeState} onKeyUp={this.changeState}  required minlength="6" />
                        {this.confirmpassword === false &&
                            <small>La contraseña no coincide</small>
                        }

                    </div>
                    <div className="clearfix"></div>
                    <input type="submit" onFocus={this.changeState} onClick={this.changeState} value="Registro" class="btn btn-success" />
                </form>
            </div>
        );
    }
}

export default Register;