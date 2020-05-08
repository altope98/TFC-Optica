import React, { Component } from 'react';
import { auth } from '../db';
import { Redirect, Link } from 'react-router-dom';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';

class Tienda extends Component {

    url = Global.url
    userId = null;
    categoriaRef = React.createRef();
    generoRef = React.createRef();
    edadRef = React.createRef();

    state = {
        identity: true,
        user: {},
        status: null,
        productos: [],
        categoria:'gafas',
        edad:'adulto',
        genero:'masculino',
        generoSelected:'masculino',
        edadSelected:'adulto'
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


    changeState=()=>{
        this.setState({
            categoria: this.categoriaRef.current.selectedOptions[0].value,
            genero: this.state.generoSelected,
            edad:this.state.edadSelected
        }); 
        console.log(this.state);
        this.getProductos(); 
    }

    onEdadChange=(event)=>{
        this.setState({
            edadSelected: event.target.value
        })
        console.log(event.target.value)

        this.changeState();
    }

    onGeneroChange=(event)=>{
        this.setState({
            generoSelected: event.target.value
        })

        console.log(event.target.value)

        this.changeState();
    }

    componentDidMount(){
        this.getProductos();
    }
    

    getUser = (id) => {
        axios.get(this.url + 'getuser/' + id).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    user: response.data.user,
                })
            }
        })
    }

    getProductos = () => {
        let categoria= this.state.categoria;
        let edad= this.state.edad;
        let genero= this.state.genero;
        console.log(categoria, genero, edad);
        axios.post(this.url + 'productos', {categoria: categoria, edad: edad, genero: genero}).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    productos: response.data.productos,
                })
            }
        })
    }


    render() {

        var listProducts;
        if (this.state.productos.length >= 1) {
            listProducts = this.state.productos.map((data, i) => {

                return (

                    <div key={i} id={data.productId} className="card" >
                        <img className="card-img-top" src={data.product.imagen} alt="Cardcap" />
                        <div className="card-body">
                            <h5 className="card-title ">{data.product.nombre}</h5>
                            <small className="card-text">{data.product.precio}</small><br />
                        </div>
                        <div class="card-footer">
                            <Link to={"/tope-vision/product/" + data.productId} className="btn btn-primary">Ver Perfil</Link>
                        </div>
                    </div>
                );
            });

        } else if (this.state.productos.length === undefined && this.state.status === 'error') {
            listProducts = () => {
                return (

                    <h1 className="mt-5 text-center">No hay productos para mostrar</h1>

                );
            }

        } else {
            listProducts = () => {
                return (

                    <h1 className="mt-5 text-center">Cargando...</h1>

                );

            }
        }

        if (this.state.identity === false) {
            return (
                <Redirect to="/tope-vision/login" />
            )
        } else {
            return (
                <div id="tienda" className="col-12 mt-3">
                    <div id="filtros" className="col-2">
                        <div class="form-group text-left m-2">
                            <label for="categoria">Categorias: </label>
                            <select class="form-control" name="categoria" ref={this.categoriaRef} onChange={this.changeState}>
                                <option selected value="gafas">Gafas de sol</option>
                                <option value="lentillas">Lentillas</option>
                                <option value="limpieza">Limpieza y accesorios</option>
                            </select>
                        </div>

                        <div className="genero text-left m-2">
                            <label htmlFor="genero" >Genero: </label>
                            <div class="form-check">
                                <input type="radio" checked={this.state.generoSelected === 'masculino'}  class="form-check-input" name="masculino" value="masculino"  onChange={this.onGeneroChange} />
                                <label class="form-check-label" for="masculino">Hombre</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" class="form-check-input" checked={this.state.generoSelected === 'femenino'} name="femenino" value="femenino"  onChange={this.onGeneroChange} />
                                <label class="form-check-label" for="femenino">Mujer</label>

                            </div>
                        </div>
                        <div className="edad text-left m-2">
                            <label htmlFor="edad" >Edad: </label>
                            <div class="form-check">
                                <input type="radio" checked={this.state.edadSelected === 'adulto'}  class="form-check-input" name="adulto" value="adulto" onChange={this.onEdadChange} />
                                <label class="form-check-label" for="adulto">Adulto</label>
                            </div>
                            <div className="form-check">
                                <input type="radio" checked={this.state.edadSelected === 'infantil'} class="form-check-input" name="infantil" value="infantil" onChange={this.onEdadChange} />
                                <label class="form-check-label" for="infantil">Infantil</label>

                            </div>
                        </div>
                    </div>
                    <div id="productos" className="col-8">
                        {listProducts}
                    </div>


                    <div id="carrito" className="col-2">


                    </div>

                </div>
            );
        }

    }
}

export default Tienda;