import React, { Component } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from 'react-router-dom';

import a from '../assets/images/a.png'
import b from '../assets/images/b.png'
import c from '../assets/images/c.png'
import d from '../assets/images/d.png'

import niña from '../assets/images/niña-glasses.jpg'
import dog from '../assets/images/dog-glasses.jpg'
import familia from '../assets/images/familia-glasses.jpg'

import WOW from 'wowjs'

class Home extends Component {
    state = {}


    componentDidMount(){
        new WOW.WOW({
            live: false
        }).init();
    }

    render() {
        return (
            <div id="home">
                <div id="slider" className=" container-fluid p-0">
                    <Carousel
                        showArrows={false}
                        showThumbs={false}
                        infiniteLoop={true}
                        autoPlay={true}
                        interval={6000}
                        transitionTime={1000}
                        showStatus={false}
                        showIndicators={false}
                    >
                        <div>
                            <img src={a} alt="carrousel1" />
                        </div>
                        <div>
                            <img src={d} alt="carrousel4" />
                        </div>
                        <div>
                            <img src={b} alt="carrousel2" />
                        </div>
                        <div>
                            <img src={c} alt="carrousel3" />
                        </div>


                    </Carousel>
                </div>


                <div className="center">
                    <h1 className="titulo wow fadeIn">Bienvenido a Tope Vision</h1>
                    <div id="content">


                        <hr></hr>


                        <div className="text-left mt-5 mb-5  ">
                            <div className="m-5 wow fadeInUp">
                                <p className="h5">En Tope Vision, cuidamos su mirada gracias a sofisticados medios para la calibración de su vista y un equipo profesional humano.</p>
                                <p className="h5">Descubre en Tope Visión los últimos diseños vanguardistas en gafas de sol, graduadas y lentillas, con la garantía de utilizar siempre productos de máxima calidad, y las mas conocidas marcas.</p>
                            </div>
                        </div>
                        <div className="container mt-5 mb-5 wow slideInLeft" data-wow-duration="2s" data-wow-delay="0.3s">
                            <h3 className="text-left ml-4">Nuestros servicios</h3>
                            <hr />
                            <div className="row  ">
                                <div className="col-md-6 col-12 align-self-center  ">
                                    <p className="h5 m-4 ml-4   text-center">Accede a nuestro apartado de servicios para mas informacion</p>
                                    <Link to="/servicios" className="btn btn-success">Ir a servicios</Link>
                                </div>
                                <div className="col-md-5 col-12 mt-3 mb-3">
                                    <Carousel
                                        showArrows={false}
                                        showThumbs={false}
                                        infiniteLoop={true}
                                        autoPlay={true}
                                        interval={6000}
                                        transitionTime={1000}
                                        showStatus={false}
                                        showIndicators={false} 

                                    >
                                        <div>
                                            <img src={familia} style={{height:"15rem", border:"2px solid black"}}  alt="carrousel1" />
                                        </div>
                                        <div>
                                            <img src={niña}  style={{height:"15rem", border:"2px solid black"}} alt="carrousel4" />
                                        </div>
                                        <div>
                                            <img src={dog} style={{height:"15rem", border:"2px solid black"}} alt="carrousel2" />
                                        </div>


                                    </Carousel>
                                </div>
                            </div>



                        </div>
                        <div className="container mt-5 mb-5 wow slideInRight" data-wow-duration="2s" data-wow-delay="0.3s">
                            <h3 className="text-left ml-4">¿Donde nos encontramos?</h3>
                            <hr />
                            <div className="row  ">
                                <div className="col-md-5 col-12">
                                    <iframe className="p-4" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3179.4031370381613!2d-3.6059523848443464!3d37.166889379874604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd71fc983230a44d%3A0x46030361129f6a89!2sCamino%20de%20Ronda%2C%2038-40%2C%2018004%20Granada!5e0!3m2!1ses!2ses!4v1590427207546!5m2!1ses!2ses" id="map" frameborder="0" style={{ border: '0' }} allowfullscreen="" aria-hidden="false" tabindex="0" title="map"></iframe>
                                </div>
                                <div className="col-md-5 col-12  align-self-center text-left font-weight-bold">
                                    <p className="ml-4">Direccion: Camino de Ronda, 40, 18004 Granada</p>
                                    <p className="ml-4">Telefono: 692636501</p>
                                    <p className="ml-4">Email: opticatopevision@gmail.com</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;