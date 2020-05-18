import React, { Component } from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';


import Header from './components/Header';
import Home from './components/Home';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Tienda from './components/Tienda';
import Citas from './components/Citas';
import Servicios from './components/Servicios';
import Error from './components/Error'
import PerfilUsuario from './components/PerfilUsuario';
import PerfilAdmin from './components/PerfilAdmin';
import Carrito from './components/Carrito';
import Compra from './components/Compra';
import UsuarioPedidos from './components/UsuarioPedidos';


class Router extends Component {
    state = {
        isLogged:false,
    };
    logged=()=>{
        this.setState({
            isLogged:true,  
        })
    }

    signout=()=>{
        this.setState({
            isLogged:false,
        })
    }





    render() {
        return (
            <BrowserRouter>
            {this.state.isLogged===true
                ? <Header logged={true} />    //MIENTRAS ESTA CARGANDO EL USUARIO AQUI APARECE PANTALLA DE CARGA MEDIANTE UN PROP DE HIJO A PADRE
                : <Header />
            }
                    <Switch>

                        <Route exact path="/" component={Home} />
                        {/* <Route exact path="/tope-vision" component={Home} /> */}
                        <Route exact path="/home" component={Home} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/servicios" component={Servicios} />
                        <Route exact path="/compra" component={Compra} />
                        <Route exact path="/tienda/:id?" component={Tienda} />
                        <Route exact path="/carrito" component={Carrito} />
                        <Route exact path="/miperfil/:id" component={PerfilUsuario}/>
                        <Route exact path="/mispedidos/:id" component={UsuarioPedidos}/>
                        <Route exact path="/adminperfil/:adminid" component={PerfilAdmin}/>
                        <Route exact path="/citas" component={Citas} />
                        <Route exact path="/logged" render={
                            ()=>{   
                                    this.logged();
                                    return(
                                        <Redirect to="/"/>
                                    )

                            }
                        }/>
                        <Route exact path="/signout" render={
                            ()=>{   
                                    this.signout();
                                    return(
                                        <Redirect to="/"/>
                                    )

                            }
                        }/>
                        

                        <Route component={Error} />
                    </Switch>

                    
                    
            
                <Footer />
            </BrowserRouter>

        );
    }

}

export default Router;