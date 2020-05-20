import React, { Component } from 'react';
import axios from "axios";
import Global from "../Global";
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';


class Citas extends Component {
    nombreRef = React.createRef();
    apellidosRef = React.createRef();
    emailRef = React.createRef();
    telefonoRef = React.createRef();

    url = Global.url;

    state = {  
        cita:{
            nombre:null,
            apellidos:null,
            email:null,
            telefono:null
        },
        status:null
    }


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
                },
                telefono:{
                    message: 'El telefono no es valido',
                    rule: (val, params, validator) => {
                        // eslint-disable-next-line
                        return validator.helpers.testRegex(val, /^[896]\d{8}$/) && params.indexOf(val) === -1
                    },
                },
                dni:{
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

    changeState = () => {
        this.setState({
            cita: {
                nombre: this.nombreRef.current.value,
                apellidos: this.apellidosRef.current.value,
                email: this.emailRef.current.value,
                telefono: this.telefonoRef.current.value,
            }
        });
    }

    recibirFormulario = (event) => {
        event.preventDefault();

        this.changeState();

        if (this.validator.allValid()) {
            let cita = this.state.cita;
            axios.post(this.url + 'cita', cita).then((response) => {
                if (response.data.status === 'success') {
                    this.setState({
                        status: 'success'
                    });
                    swal(
                        'Cita enviada',
                        'Contactaremos contigo por email',
                        'success'
                    );

                    axios.post(this.url + 'email/cita');
                } else {
                    this.setState({
                        status: 'failed'
                    });
                    swal(
                        'Cita no enviada',
                        'Se ha producido un error',
                        'error'
                    );
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




    render() { 
        return ( 
        <div id="citas" className=" col-12">
        <h2 className="text-center p-3 text-md-left">
            Pedir Cita
        </h2>
        <hr />

        <form className="col-md-5" onSubmit={this.recibirFormulario} >
            <div className="form-group text-left">
                <label htmlFor="nombre" className="ml-2">Nombre</label>
                <input id="nombre" className="form-control mr-2 ml-2" type="text" name="nombre" ref={this.nombreRef} onChange={this.changeState} required />
                {this.validator.message('nombre', this.state.cita.nombre, 'required|names_surnames')}
            </div>
            <div className="form-group text-left">
                <label htmlFor="apellidos" className="ml-2">Apellidos</label>
                <input className="form-control mr-2 ml-2" type="text" name="apellidos" ref={this.apellidosRef} onChange={this.changeState} required />
                {this.validator.message('apellidos', this.state.cita.apellidos, 'required|names_surnames')}
            </div>
            <div className="form-group text-left">
                <label htmlFor="telefono" className="ml-2">Telefono</label>
                <input className="form-control mr-2 ml-2" type="text" name="telefono" ref={this.telefonoRef} onChange={this.changeState} maxLength="9" required />
                {this.validator.message('telefono', this.state.cita.telefono, 'required|telefono')}
            </div>
            <div className="form-group text-left">
                <label htmlFor="email" className="ml-2">Email</label>
                <input className="form-control mr-2 ml-2" type="text" name="email" ref={this.emailRef} onChange={this.changeState} required />
                {this.validator.message('email', this.state.cita.email, 'required|email2')}
            </div>
            <div className="clearfix"></div>
            {this.state.status=== 'success'
                ?<input type="submit" value="Pedir cita" className="btn btn-success" disabled />
                :<input type="submit" value="Pedir cita" className="btn btn-success" />
            
            }
            
        </form>
    </div> );
    }
}
 
export default Citas;