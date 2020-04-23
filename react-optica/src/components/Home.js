import React, { Component } from 'react';
 import "react-responsive-carousel/lib/styles/carousel.min.css"; 
 import { Carousel } from 'react-responsive-carousel'; 

import a from '../assets/images/a.png'
import b from '../assets/images/b.png'
import c from '../assets/images/c.png'
 import d from '../assets/images/d.png' 

class Home extends Component {
    state = {}
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
                            <img src={a} alt="carrousel1"  />
                        </div>
                        <div>
                            <img src={d} alt="carrousel4"  />
                        </div>
                        <div>
                            <img src={b} alt="carrousel2"  />
                        </div>
                        <div>
                            <img src={c} alt="carrousel3"  />
                        </div>
                        

                    </Carousel> 
                    </div>
                    
                
                <div className="center">
                <h1 className="titulo">Bienvenido a Tope Vision</h1>
                    <div id="content">


                        <hr></hr>
                        <div>
                            <p>Contenido de prueba</p>
                            <p>dvdsvdf</p>
                        </div>
                        <div>
                            <p>Contenido de prueba</p>
                            <p>dvdsvdf</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home;