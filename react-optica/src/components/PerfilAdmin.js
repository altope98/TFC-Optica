import React, { Component } from 'react';
import { auth } from '../db';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Global from "../Global";
import UsuariosAdmin from './panelAdmin/UsuariosAdmin'
import CitasAdmin from './panelAdmin/CitasAdmin'
import PerfilUsuario from './PerfilUsuario'
import Calendario from './panelAdmin/Calendario'
import { MDBNav, MDBNavItem, MDBNavLink } from "mdbreact";

class PerfilAdmin extends Component {
    url = Global.url
    userId = null;
    state = {
        identity: true,
        user: {},
        status: null,
        loading:true
    }

    componentWillMount() {
        if (auth.currentUser === undefined) {
            this.setState({
                identity: false
            });
        } else {

            this.userId = this.props.match.params.adminid

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
                    loading:false
                })

                if (this.state.user.admin === false) {
                    this.setState({
                        identity: false
                    })
                }
            }
        })
    }
    render() {
        if(this.state.loading===false){
        return (
            <div id="admin" className="col-lg-12 mt-3">
                {this.state.identity === true
                    ? <React.Fragment>
                        <h2>
                            Bienvenido   -   {this.state.user.nombre + ' ' + this.state.user.apellidos}
                        </h2>
                        <hr />
                        <BrowserRouter>
                            <div id="panel">
                                <Redirect exact from="/" to={"/tope-vision/adminperfil/" + this.userId + "/clientes"} />


                                <MDBNav className="nav-tabs mt-5">
                                    <MDBNavItem>
                                        <MDBNavLink to={"/tope-vision/adminperfil/" + this.userId + "/clientes"}>Clientes</MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink to={"/tope-vision/adminperfil/" + this.userId + "/citas"}>Citas</MDBNavLink>
                                    </MDBNavItem>
                                    <MDBNavItem>
                                        <MDBNavLink to={"/tope-vision/adminperfil/" + this.userId + "/calendario"}>Calendario</MDBNavLink>
                                    </MDBNavItem>
                                    {/* <MDBNavItem>
                                        <MDBNavLink to={"/tope-vision/adminperfil/" + this.userId + "/pedidos"}>Pedidos</MDBNavLink>
                                    </MDBNavItem>  */}
                                </MDBNav>


                                <Switch>

                                    <Route path={"/tope-vision/adminperfil/" + this.userId + "/clientes"} >
                                        <UsuariosAdmin />
                                    </Route>
                                    <Route path={"/tope-vision/adminperfil/" + this.userId + "/citas"} >
                                        <CitasAdmin />
                                    </Route>

                                    <Route path={"/tope-vision/adminperfil/" + this.userId + "/calendario"} >
                                        <Calendario />
                                    </Route>
                                    {/* <Route path={"/tope-vision/adminperfil/" + this.userId + "/pedidos"} >
                                        <PedidosAdmin />
                                    </Route> */}
                                    <Route exact path="/tope-vision/perfil/:id/:admin" component={PerfilUsuario}/>
                                    <Route path={"/tope-vision/adminperfil/requestuser/:id"}
                                        render={
                                            (props) => {
                                                var userId = props.match.params.id;
                                                var admin=true;
                                                return (
                                                    <Redirect to={'/tope-vision/perfil/' + userId + '/'+admin} />
                                                )
                                            }
                                        }
                                    />

                                </Switch>

                            </div>
                        </BrowserRouter>


                    </React.Fragment>
                    : <React.Fragment>
                        <Redirect to="/tope-vision/login" />
                    </React.Fragment>
                }

            </div>
        );

            }else{
                return(
                    <h1>Cargando....</h1>
                );
            }
    }
}

export default PerfilAdmin;