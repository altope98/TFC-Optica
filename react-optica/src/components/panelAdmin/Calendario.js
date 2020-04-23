import React, { Component } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from "axios";
import Global from "../../Global"
import { Modal, Button } from 'react-bootstrap';
import swal from 'sweetalert';

require('moment/locale/es.js');
const localizer = momentLocalizer(moment)

class Calendario extends Component {
    eventsList = []
    url = Global.url
    citaaux = []
    state = {
        citas: [],
        message: null,
        status: null,
        showmodal: false,
        show: false,
    }


    
    componentWillMount() {
        

        axios.get(this.url + 'updatedcitas').then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    citas: response.data.citas,
                    status: 'success'
                });

                this.actualizadorCitas();

                this.forceUpdate();

            } else {
                this.setState({
                    status: 'error',
                    message: response.data.message
                });

            }
        })
    }


    actualizadorCitas=()=>{
        var date = moment().format('L');
        var hora = moment().format('LT');
        var fecha = date + " " + hora
        this.eventsList=[];
        this.state.citas.forEach((element, i) => {
            let fecha2 = element.cita.fecha + " " + element.cita.hora
            let isAfter = moment(fecha, 'YYYY-MM-DD hh:mm').isAfter(moment(fecha2, 'YYYY-MM-DD hh:mm'));
            if (isAfter) {
                let cita = element.cita;
                let id = element.citaId;
                cita.estado = "terminado";

                axios.put(this.url + 'cita', { cita, id }).then((response) => {
                    if (response.data.status === 'success') {
                        let citasaux = this.state.citas;
                        citasaux.splice(i, 1);
                        this.setState({
                            citas: citasaux,
                            status: 'success'
                        });
                        this.forceUpdate();

                    } else {
                        console.log(response.data.error)
                    }
                });
            }

            let fecha_split = element.cita.fecha.split("/");
            let hora_split = element.cita.hora.split(":");

            this.eventsList.push(
                {
                    title: element.cita.user.nombre + " " + element.cita.user.apellidos,
                    start: new Date(parseInt(fecha_split[2]), parseInt(fecha_split[1]) - 1, parseInt(fecha_split[0]), parseInt(hora_split[0]), parseInt(hora_split[1]), 0),
                    end: new Date(parseInt(fecha_split[2]), parseInt(fecha_split[1]) - 1, parseInt(fecha_split[0]), parseInt(hora_split[0]) + 1, parseInt(hora_split[1]), 0),
                    id: element.citaId
                }
            );
            this.forceUpdate();
        });
    }


    pulsadoEvento = (event) => {
        this.state.citas.forEach((element, i) => {
            if (event.id === element.citaId) {
                this.citaaux.push(element)
                this.setState({
                    show: true
                })
            }
        })
    }

    cerradoEvento = () => {
        this.setState({
            show: false
        });
        this.citaaux = [];
    }

    updateCita(event, id){
        event.preventDefault(); 

        let fecha=moment(event.target[0].value).format("DD/MM/YYYY")
        let hora=event.target[1].value 
        let cita= this.citaaux[0].cita;
        cita.hora=hora;
        cita.fecha=fecha;
        cita.estado='actualizado';

        axios.put(this.url + 'cita', {cita, id}).then((response) => {
            if (response.data.status === 'success') {
                this.actualizadorCitas();
                this.cerradoEvento();
                swal(
                    'Cita guardada correctamente',
                    'Cita se ha guardado en tu calendario correctamente', 
                    'success'
                );
                this.forceUpdate();

            }else{
                console.log(response.data.error)
                swal(
                    'Cita no se ha guardado correctamente',
                    'Cita no se ha guardado en tu calendario',
                    'error'
                );
            } 
        }); 
    }



    render() {
        return (
            <React.Fragment>
                <div className="bigCalendar-container">
                    <Calendar
                        localizer={localizer}
                        events={this.eventsList}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="week"
                        onSelectEvent={(e) => {
                            this.pulsadoEvento(e)
                        }}
                        min={new Date(2008, 0, 1, 9, 0)}
                        max={new Date(2008, 0, 1, 20, 0)}
                        style={{ height: 500, margin: "2rem" }}
                    />


                </div>


                {this.citaaux.length === 1 &&
                    <Modal show={this.state.show} onHide={this.cerradoEvento} size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-center">
                                <h2>{this.citaaux[0].cita.fecha + " - " + this.citaaux[0].cita.hora}</h2>
                                <h4>{this.citaaux[0].cita.user.nombre + " " + this.citaaux[0].cita.user.apellidos}</h4>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="infocitacontacto pl-3">
                                <h6 className="m-1 ">Telefono: {this.citaaux[0].cita.user.telefono}</h6>
                                <h6 className="m-1 ">Email: {this.citaaux[0].cita.user.email}</h6>
                            </div>


                            <div className="infoactualizarcita mt-3">

                                {/* INPUT DATE Y HORA Y BOTON PARA ACTUALIZAR JUNTO CON TITULO DE CAMBIO Y BORDES SEÑALADOS */}
                                <form className="col-12" onSubmit={(e) => this.updateCita(e, this.citaaux[0].citaId)}>
                                    <div className="row">
                                        <div className="col">
                                            <input className="form-control m-1" type="date" name="fechaCita" required />
                                        </div>
                                        <div className="col">
                                            <input className="form-control m-1 " type="time" name="horaCita" min="09:00" max="20:00" required />
                                        </div>
                                        <div className="col">
                                        <input className="btn btn-success m-1" type="submit" value="Actualizar cita" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col d-flex justify-content-between  mt-2 mb-2">
                                            <button className="btn btn-primary m-auto" >Enviar recordatorio</button>
                                        </div>
                                    </div>
                                </form>
                            </div>



                            {/* BOTON ENVIAR RECORDATORIO */}

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.cerradoEvento}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>

                }


            </React.Fragment>
        );
    }
}

export default Calendario;