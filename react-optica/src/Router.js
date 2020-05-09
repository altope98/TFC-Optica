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
                ? <Header logged={true} />
                : <Header />
            }
                    <Switch>

                        <Route exact path="/" component={Home} />
                        <Route exact path="/tope-vision" component={Home} />
                        <Route exact path="/tope-vision/home" component={Home} />
                        <Route exact path="/tope-vision/login" component={Login} />
                        <Route exact path="/tope-vision/register" component={Register} />
                        <Route exact path="/tope-vision/servicios" component={Servicios} />
                        <Route exact path="/tope-vision/tienda/:id?" component={Tienda} />
                        {/* <Route exact path="/tope-vision/carrito" component={Carrito} /> */}
                        <Route exact path="/tope-vision/miperfil/:id" component={PerfilUsuario}/>
                        <Route exact path="/tope-vision/adminperfil/:adminid" component={PerfilAdmin}/>
                        <Route exact path="/tope-vision/citas" component={Citas} />
                        <Route exact path="/tope-vision/logged" render={
                            ()=>{   
                                    this.logged();
                                    return(
                                        <Redirect to="/tope-vision/home"/>
                                    )

                            }
                        }/>
                        <Route exact path="/tope-vision/signout" render={
                            ()=>{   
                                    this.signout();
                                    return(
                                        <Redirect to="/tope-vision/home"/>
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