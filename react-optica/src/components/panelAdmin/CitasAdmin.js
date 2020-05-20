import React, { Component } from 'react';
import axios from "axios";
import Global from "../../Global"
import swal from 'sweetalert';
import moment from 'moment'


class CitasAdmin extends Component {
    url = Global.url

    state = {
        citas: [],
        status: null,
    }

    componentWillMount() {
        axios.get(this.url + 'pendingcitas').then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    citas: response.data.citas,
                    status: 'success'
                });


            } else {
                this.setState({
                    status: 'error'
                });

            }
        })


    }


   updateCita(event, id, i){
        event.preventDefault(); 

        let fecha=moment(event.target[0].value).format("DD/MM/YYYY")
        let hora=event.target[1].value 
        let cita= this.state.citas[i].cita;
        cita.hora=hora;
        cita.fecha=fecha;
        cita.estado='actualizado';

        axios.put(this.url + 'cita', {cita, id}).then((response) => {
            if (response.data.status === 'success') {
                let citasaux=this.state.citas; 
                citasaux.splice(i,1);
                this.setState({
                    citas: citasaux, 
                    status: 'success'
                });
                swal(
                    'Cita guardada correctamente',
                    'Cita se ha guardado en tu calendario correctamente', 
                    'success'
                );
                this.forceUpdate();

                axios.post(this.url+'email/confirmacita', {cita});

            }else{
                swal(
                    'Cita no se ha guardado correctamente',
                    'Cita no se ha guardado en tu calendario',
                    'error'
                );
            } 
        }); 
    }

    render() {
        if (this.state.citas.length >= 1) {
            var listCitas = this.state.citas.map((data, i) => {
                return (
                    <li className="list-group-item" key={i}>
                        <div className="row">
                            <div className="col-4">
                                <h5>{data.cita.user.nombre + ' ' + data.cita.user.apellidos}</h5>
                                <p>{data.cita.user.email}</p>
                            </div>
                            <div className="col-md-8 col-12">
                        <form  onSubmit={(e)=>this.updateCita(e, data.citaId, i)}>
                            <div className="row">
                                <div className="col">
                            <input className="form-control m-1" type="date" name="fechaCita"  required/>
                            </div>
                            <div className="col">
                            <input className="form-control m-1 " type="time" name="horaCita"  min="09:00" max="20:00" required  />
                            </div>
                            <div className="col">
                            <input className="btn btn-success mr-4 ml-4" type="submit"  value="Aceptar"/>
                            </div>
                            </div>
                        </form>
                        </div>
                        </div>
                    </li>

                )
            })

            return (
                <ul className="list-group">
                    {listCitas}
                </ul>
            );
        } else if (this.state.citas.length === undefined || this.state.status === 'error') {
            return (
                <div id="clientes" className="text-center">
                    <h1 className="mt-5 error">No hay citas para mostrar</h1>
                </div>
            );
        } else {
            return (
                <div id="clientes" className="text-center">
                    <h1 className="mt-5 cargando">Cargando...</h1>
                </div>
            );
        }

    }
}

export default CitasAdmin;