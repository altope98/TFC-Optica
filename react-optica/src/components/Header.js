import React, { Component } from 'react';
import logo from '../assets/images/logo.png';
import { NavLink , Link, Redirect} from 'react-router-dom';
import { auth } from '../db';
import axios from "axios";
import Global from "../Global";

class Header extends Component {

    url = Global.url;

    state = {
        identity: false,
        user: {},
        userId: null,
        redirect:false,

    }

    componentDidUpdate() {
        if (this.props.logged===true && auth.currentUser!=null && this.state.identity === false) {
            let email = auth.currentUser.email
            axios.get(this.url + 'user/' + email).then((response) => {
                if (response.data.status === 'success') {
                    this.setState({
                        identity: true,
                        user: response.data.user,
                        userId: response.data.userId,
                        redirect:false
                    });

                } else {
                    this.setState({
                        identity: null
                    });
                }
            });
        }

        if(this.state.identity===false){
            axios.post(this.url + 'carrito/cerrar');
        }

    }

    logout=()=>{
        auth.signOut().then(()=>{
            this.setState({
                identity: false,
                user: {},
                userId: null,
                redirect:true
            })

            axios.post(this.url + 'carrito/cerrar');

        }).catch((e)=>{
            alert(e.message)
        });
        
    }



    render() {

        return (

            <React.Fragment>
                
            {this.state.redirect===true &&
                            
                <Redirect to="/signout"/>
            }
            

            <header id="header" className="container-fluid">
                <nav className="navbar navbar-expand-lg navbar-light" id="barra" >
                    <div className="navbar-brand">
                        <NavLink to="/" activeClassName="active"><img src={logo} className="app-logo" id="logo" alt="Logotipo" /></NavLink>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <NavLink to="/" activeClassName="active">Inicio</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/servicios" activeClassName="active">Servicios</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={"/tienda/"+this.state.userId }activeClassName="active">Tienda</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/citas" activeClassName="active">Citas</NavLink>
                            </li>
                        </ul>
                        <div className="dropdown-divider "></div>
                        <ul className="navbar-nav navbar-right">

                            {this.state.identity === false || this.state.identity === null
                                ? <React.Fragment>
                                    <li className="nav-item">
                                        <NavLink to="/register" activeClassName="active">Registro</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/login" activeClassName="active">Iniciar sesion</NavLink>
                                    </li>
                                </React.Fragment>
                                : <React.Fragment>
                                    <li className="nav-item dropdown" >
                                        <p className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {this.state.user.nombre + ' ' + this.state.user.apellidos}
                                        </p>

                                        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                            {this.state.user.admin === false 

                                                ?<React.Fragment>
                                                <Link className="dropdown-item" to={"/miperfil/" + this.state.userId} >Mi perfil</Link>
                                                <Link className="dropdown-item" to={"/mispedidos/" + this.state.userId}>Mis pedidos</Link>
                                                </React.Fragment>
                                                : <React.Fragment>
                                                <Link className="dropdown-item" to={"/adminperfil/" + this.state.userId} >Administracion</Link>
                                                
                                                </React.Fragment>
                                            }
                                            <div className="dropdown-divider"></div>
                                            <Link className="dropdown-item pointer" style={{cursor: "pointer"}} onClick={this.logout}>Cerrar sesion</Link>
                                        </div> 
                                    </li>
                                    </React.Fragment>
                                }
                                
                            </ul>
                        

            </div >
                    </nav >
                
            </header >
            </React.Fragment>
         );
    }
}

export default Header;