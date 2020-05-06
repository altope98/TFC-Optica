import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import Global from "../Global";
import SimpleReactValidator from 'simple-react-validator';
import { auth } from '../db'
import firebase from 'firebase';



class Login extends Component {

    emailRef = React.createRef();
    passwordRef = React.createRef();

    url = Global.url;

    state = {
        email: null,
        password: null,
        status: null,
        user: {},
    };
    componentWillMount() {
        this.validator = new SimpleReactValidator({
            messages: {
                required: 'Este campo es obligatorio',
                alpha_num_space: 'Solo se permiten caracteres alfanumericos',
                numeric: 'Solo se permiten numeros',
                email: 'Email no es correcto',

            },
        });
    }

    inicioGoogle = () => {
        var provider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(provider).then((result) => {
            var current = result.user;
            let name = current.displayName.split(" ");
            let user = {
                nombre: name[0],
                apellidos: name[1],
                email: current.email,
                telefono: "",
                dni: "",
                imagen:"https://firebasestorage.googleapis.com/v0/b/proyecto-consulta-firebase.appspot.com/o/default-user-image.png?alt=media&token=6c3d7402-c876-48ff-b1e1-5d1a0b6cab66"
            }
            axios.post(this.url + 'user2', user).then((response)=>{
                if(response.data){
                    this.setState({
                        status: 'success'
                    })
                }
            });
        })
    }

    inicioFacebook = () => {
        var provider = new firebase.auth.FacebookAuthProvider();

        auth.signInWithPopup(provider).then((result) => {
            var current = result.user;
            let name = current.displayName.split(" ");
            let user = {
                nombre: name[0],
                apellidos: name[1],
                email: current.email,
                telefono: "",
                dni: "",
                imagen: "https://firebasestorage.googleapis.com/v0/b/proyecto-consulta-firebase.appspot.com/o/default-user-image.png?alt=media&token=6c3d7402-c876-48ff-b1e1-5d1a0b6cab66"
            }
            axios.post(this.url + 'user2', user).then((response)=>{
                if(response.data){
                    this.setState({
                        status: 'success'
                    })
                }
            });
            
        })
    }

    changeState = () => {
        this.setState({
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value
        });
    }

    recibirFormulario = (event) => {
        event.preventDefault();

        this.changeState();

        if (this.validator.allValid()) {
            auth.signInWithEmailAndPassword(this.state.email, this.state.password).then(() => {
                this.setState({
                    password: null,
                    status: 'success'
                })
            }).catch((err) => {
                alert(err.message)
            })
        } else {
            this.validator.showMessages();
            this.forceUpdate();
            this.setState({
                status: 'failed'
            })
        }

    }


    render() {
        if (this.state.status === 'success') {
            return (
                <Redirect to="/tope-vision/logged" />
            )
        }

        return (

            <div id="login" className=" col-12">

                <h2 className="text-center p-3 text-md-left">
                    Iniciar sesion
                </h2>
                <hr />

                <form className="col-md-5" onSubmit={this.recibirFormulario} >
                    <div className="form-group text-left">
                        <label htmlFor="email" className="ml-2">Email</label>
                        <input className="form-control mr-2 ml-2" type="text" name="email" ref={this.emailRef} onChange={this.changeState} required />
                        {this.validator.message('email', this.state.email, 'required|email')}
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="password" className="ml-2">Contraseña</label>
                        <input className="form-control mr-2 ml-2" type="password" name="password" ref={this.passwordRef} onChange={this.changeState} required minlength="6" />
                        {this.validator.message('password', this.state.password, 'required')}

                    </div>
                    <div className="clearfix"></div>
                    <input type="submit" value="Iniciar sesion" class="btn btn-success" />
                </form>

                <div className="botonessesion">
                    <button className="btngoogle row" onClick={() => this.inicioGoogle()}><img src="https://www.gstatic.com/mobilesdk/160512_mobilesdk/auth_service_google.svg" alt="google-boton" /> <p>Inicia sesion con Google</p></button>
                    <button className="btnfacebook row" onClick={() => this.inicioFacebook()}><img src="https://www.gstatic.com/mobilesdk/160409_mobilesdk/images/auth_service_facebook.svg" alt="facebook-boton" /> <p>Inicia sesion con Facebook</p></button>

                </div>
            </div>
        );

    }
}

export default Login;