import React, { Component } from 'react';
import { auth } from '../db';
import { Redirect, Link } from 'react-router-dom';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';
import carrito from '../assets/images/carrito.svg'
import { Modal, Button } from 'react-bootstrap'
/* axios.defaults.withCredentials = true */

class Tienda extends Component {

    url = Global.url
    userId = null;
    productaux = [];
    state = {
        identity: true,
        user: {},
        status: null,
        productos: [],
        carrito: [],
        categoria: 'gafas',
        edad: 'adulto',
        genero: 'masculino',
        show: false
    }

    componentWillMount() {
        if (!auth.currentUser) {
            this.setState({
                identity: false
            });
        } else {
            this.userId = this.props.match.params.id
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

    onCategoriaChange = (event) => {
        this.setState({
            categoria: event.target.value,
        }, this.getProductos);

    }

    onEdadChange = (event) => {
        this.setState({
            edad: event.target.value
        }, this.getProductos);
    }

    onGeneroChange = (event) => {
        this.setState({
            genero: event.target.value
        }, this.getProductos);
    }

    componentDidMount() {
        this.getProductos();
        this.getCarrito();

    }


    getUser = (id) => {
        axios.get(this.url + 'getuser/' + id).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    user: response.data.user
                })
            }
        })
    }

    getCarrito = () => {
        axios.get(this.url + 'carrito').then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    carrito: response.data.carrito
                })
            }
        })

        console.log(this.state.carrito);
    }

    getProductos = () => {
        let categoria = this.state.categoria;
        let edad = this.state.edad;
        let genero = this.state.genero;
        axios.post(this.url + 'productos', { categoria: categoria, edad: edad, genero: genero }).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    productos: response.data.productos,
                    status: 'success'
                })
            } else {
                this.setState({
                    productos: [],
                    status: 'error'
                })
            }
        })
    }

    pulsadoEvento = (item) => {
        this.state.productos.forEach((element) => {
            if (item === element.productId) {
                this.productaux.push(element)
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
        this.productaux = [];
    }

    agregarItem=(id)=>{
        axios.post(this.url + 'carrito/agregar', { item_id: id}  ).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    carrito: response.data.carrito
                })
                this.cerradoEvento();
                swal(
                    'Producto agregado correctamente',
                    'El producto se ha añadido al carrito correctamente',
                    'success'
                );
                console.log(this.state.carrito)

            }else{
                this.cerradoEvento();
                swal(
                    'El producto no se ha agregado correctamente',
                    'Ha ocurrido un error al agregar el producto al carrito, intentelo mas tarde',
                    'error'
                );
            }

        });
    }

    render() {

        var listProducts;
        if (this.state.productos.length >= 1) {
            listProducts = this.state.productos.map((data, i) => {

                return (

                    <div key={i} id={data.productId} className="card" >
                        <img className="card-img-top" src={data.product.imagen} alt="Cardcap" />
                        <div className="card-body pt-0 pb-0">
                            <h4 className="card-title ">{data.product.nombre}</h4>
                            <p className="card-text h5">{data.product.precio} €</p><br />
                        </div>
                        <div class="card-footer pt-2 pb-2">

                            <button className="btn btn-primary" onClick={()=> this.pulsadoEvento(data.productId)}>Ver producto</button>
                        </div>
                    </div>
                );
            });
        } else if (this.state.status === 'error') {
            listProducts = <h1 className="mt-5 text-center">No hay productos para mostrar</h1>



        } else {
            listProducts =
                <h1 className="mt-5 text-center">Cargando...</h1>



        }

        /* if (this.state.identity === false) {
            return (
                <Redirect to="/tope-vision/login" />
            )
        } else { */
        return (
            <div id="tienda" className="row mt-3">
                <div id="filtros" className="col-2 ml-4">
                    <div class="form-group text-left m-2">
                        <label htmlFor="categoria">Categorias: </label>
                        <select class="form-control" name="categoria" onChange={this.onCategoriaChange}>
                            <option selected value="gafas">Gafas de sol</option>
                            <option value="lentillas">Lentillas</option>
                            <option value="limpieza">Limpieza y accesorios</option>
                        </select>
                    </div>

                    <div className="genero text-left m-2">
                        <label htmlFor="genero" >Genero: </label>
                        <div class="form-check">
                            <input type="radio" checked={this.state.genero === 'masculino'} class="form-check-input" name="masculino" value="masculino" onChange={this.onGeneroChange} />
                            <label class="form-check-label" htmlFor="masculino">Hombre</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" class="form-check-input" checked={this.state.genero === 'femenino'} name="femenino" value="femenino" onChange={this.onGeneroChange} />
                            <label class="form-check-label" htmlFor="femenino">Mujer</label>

                        </div>
                    </div>
                    <div className="edad text-left m-2">
                        <label htmlFor="edad" >Edad: </label>
                        <div class="form-check">
                            <input type="radio" checked={this.state.edad === 'adulto'} class="form-check-input" name="adulto" value="adulto" onChange={this.onEdadChange} />
                            <label class="form-check-label" htmlFor="adulto">Adulto</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" checked={this.state.edad === 'infantil'} class="form-check-input" name="infantil" value="infantil" onChange={this.onEdadChange} />
                            <label class="form-check-label" htmlFor="infantil">Infantil</label>

                        </div>
                    </div>
                </div>
                <div id="productos" className="col-7 m-2">
                    {listProducts}
                </div>


                <div id="carrito" className="col-2 m-2">
                    {/* <button>asvdavdsvds</button> */}
                    <Link to={{ pathname: "/tope-vision/carrito", state: { userId: this.userId, carrito: this.state.carrito } }} className="ircarrito btn btn-primary" >
                        {this.state.carrito !== undefined  &&
                            <span className="numeroitems">{this.state.carrito.length} </span>
                            
                        }
                        <img src={carrito} alt="icono-carrito" />
                            Ver Carrito
                        </Link>

                </div>





                {this.productaux.length === 1 &&
                    <Modal show={this.state.show} onHide={this.cerradoEvento} size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="text-center">
                                <img className="img-item" src={this.productaux[0].product.imagen} alt="iamgen-item"/>
                                <h4>{this.productaux[0].product.nombre}</h4>
                                <p><small>Id referencia: {this.productaux[0].productId}</small></p>
                                <p className="card-text h5">{this.productaux[0].product.precio} €</p><br />
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="infocitacontacto pl-3">
                                <p className="m-1 h5 ">Descripcion del producto:</p>
                                <p className="m-1 ">{this.productaux[0].product.descripcion}</p>
                                
                            </div>
                            <div className="infoactualizarcita mt-3">
                                <div className="row">
                                    <div className="col d-flex justify-content-between  mt-2 mb-2">
                                        <button className="btn btn-primary m-auto" onClick={() => this.agregarItem(this.productaux[0].productId)} >Agregar al carrito</button>
                                    </div>
                                </div>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.cerradoEvento}>
                                Cerrar
            </Button>
                        </Modal.Footer>
                    </Modal>

                }



                </div>
        );
    }

    /* } */
}

export default Tienda;