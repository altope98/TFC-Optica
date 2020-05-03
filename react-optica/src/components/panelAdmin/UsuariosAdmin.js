import React, { Component } from 'react';
import axios from "axios";
import Global from "../../Global"
import { Link } from 'react-router-dom';



class UsuariosAdmin extends Component {
    url = Global.url
    state = {
        users:{},
        message: null,
        status: null
    }

    componentWillMount() {

        axios.get(this.url + 'users').then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    users: response.data.users,
                    status: 'success'
                });



            } else {
                this.setState({
                    status: 'error',
                    message: response.data.message
                });
                
            }
        })


    }


    render() {
        if (this.state.users.length >= 1) {
            var listUsers = this.state.users.map((data, i) => {

                return (

                    <div key={i} id={data.userId} className="card" >
                        <img className="card-img-top" src={data.user.imagen} alt="Cardcap" />
                        <div className="card-body">
                            <h5 className="card-title ">{data.user.nombre + ' ' + data.user.apellidos}</h5>
                            <small className="card-text">{data.user.email}</small><br />
                        </div>
                        <div class="card-footer">
                            <Link to={"/tope-vision/adminperfil/requestuser/" + data.userId} className="btn btn-primary">Ver Perfil</Link>
                         </div>
                    </div>
                )
            })

            return (
                <div id="clientes" className="row">
                    {listUsers}
                </div>
            );
        } else if (this.state.users.length === undefined && this.state.status === 'error') {
            return (
                <div id="clientes" className="text-center">
                    <h1 className="mt-5">No hay clientes para mostrar</h1>
                </div>
            );
        } else {
            return (
                <div id="clientes" className="text-center">
                    <h1 className="mt-5">Cargando...</h1>
                </div>
            );
        }
    }
}

export default UsuariosAdmin;