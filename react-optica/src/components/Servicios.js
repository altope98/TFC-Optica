import React, { Component } from 'react';
import gafas from '../assets/images/gafas.svg';
import graduacion from '../assets/images/graduacion.svg';
import online from '../assets/images/online.svg';
import envio from '../assets/images/envio.svg';


import WOW from 'wowjs'

class Servicios extends Component {

    componentDidMount(){
        new WOW.WOW({
            live: false
        }).init();
    }

    render() {
        return (
            <div id="servicios">
                <h2 className="text-center p-3 text-md-left m-3 wow fadeInRight">
                    Nuestros servicios
                </h2>
                <hr />
                <div className="container wow rotateInUpRight" data-wow-duration="1s" data-wow-delay="0.3s">
                    <div className="row">

                        <div class="col-12 col-md-6 col-lg-3 mt-2 mb-2">
                            <article class="item-servicios">
                                <img src={gafas} className="icono"  alt="item-servicio" />
                                <h3>Miles de productos</h3>
                                <p>En Tope Vision podrás elegir entre las muchísimas referencias de nuestro amplio catálogo. Gafas, gafas de sol, gafas de sol deportivas, lentes de contacto, líquidos limpiadores y desinfectantes para lentes de contacto, etc...</p>
                            </article>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 mt-2 mb-2">
                            <article class="item-servicios">
                                <img src={graduacion} className="icono"  alt="item-servicio" />
                                <h3>Graduación de su vista</h3>
                                <p>En Tope Visión, disponemos de la más vanguardista tecnología para una correcta graduación de su vista. El equipo humano de Tope Visión, con una gran formación, le realizará una graduación que le solucionará sus problemas de visión.</p>
                            </article>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 mt-2 mb-2">
                            <article class="item-servicios">
                                <img src={online} className="icono"  alt="item-servicio" />
                                <h3>Venta online</h3>
                                <p>Podrás comprar cómodamente desde casa, cualquier producto que necesites, y recibirlo rápidamente en tu domicilio con unas condiciones mas que ventajosas.</p>
                            </article>
                        </div>
                        <div class="col-12 col-md-6 col-lg-3 mt-2 mb-2">
                            <article class="item-servicios">
                                <img src={envio} className="icono" alt="item-servicio" />
                                <h3>Pedidos a domicilio</h3>
                                <p>Recibirás tu compra on-line en tu domicilio gratis. Así de cómodo y sencillo.</p>
                            </article>
                        </div>
                    </div>

                </div>


            </div>



        );
    }
}

export default Servicios;