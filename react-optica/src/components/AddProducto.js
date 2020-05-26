import React, { Component } from 'react';
import axios from "axios";
import Global from "../Global";
import swal from 'sweetalert';

class AddProducto extends Component {
    state = {
        producto: {} 
    }

    nombreRef = React.createRef();
    categoriaRef = React.createRef();
    descripcionRef = React.createRef();
    generoRef = React.createRef();
    imagenRef = React.createRef();
    precioRef = React.createRef();
    tamañoRef = React.createRef();

    url = Global.url;


    changeState = () => {
        this.setState({
            producto: {
                nombre: this.nombreRef.current.value,
                categoria: this.categoriaRef.current.value,
                genero: this.generoRef.current.value,
                descripcion: this.descripcionRef.current.value,
                imagen: this.imagenRef.current.value,
                precio: this.precioRef.current.value,
                tamaño:this.tamañoRef.current.value
            }
        });

    }
    add=()=>{
        this.changeState();

        let producto=this.state.producto

        axios.post(this.url + 'producto', { producto }).then((response) => {
            if (response.data.status === 'success') {
                this.setState({
                    status: 'success'
                });
                swal(
                    'prodcuto registrado',
                    'producto registrado correctamente',
                    'success'
                );
            } else {
                this.setState({
                    status: 'failed'
                });
                swal(
                    'Error',
                    'Error',
                    'failed'
                );
            }
        });
    }



    render() { 
        return ( 
        <div >
            <h1>Producto add</h1>

            <div className="form-group text-left">
                        <label htmlFor="nombre" className="ml-2" >Nombre</label>
                        <input id="nombre" className="form-control mr-2 ml-2" type="text" name="nombre" ref={this.nombreRef} onChange={this.changeState} required />
                        
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="categoria" className="ml-2">categoria</label>
                        <input className="form-control mr-2 ml-2" type="text" name="categoria" ref={this.categoriaRef} onChange={this.changeState} required />
                        
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="genero" className="ml-2">genero</label>
                        <input className="form-control mr-2 ml-2" type="text" name="genero" ref={this.generoRef} onChange={this.changeState} maxLength="9" required />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="imagen" className="ml-2">imagen</label>
                        <input className="form-control mr-2 ml-2" type="text" name="imagen" ref={this.imagenRef} onChange={this.changeState} onBlur={this.changeState} required />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="descripcion" className="ml-2">descripcion</label>
                        <input className="form-control mr-2 ml-2" type="text" name="descripcion" ref={this.descripcionRef} onChange={this.changeState} onBlur={this.changeState} required />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="precio" className="ml-2">precio</label>
                        <input className="form-control mr-2 ml-2" type="numeric" name="precio" ref={this.precioRef} onChange={this.changeState} onBlur={this.changeState} required />
                    </div>
                    <div className="form-group text-left">
                        <label htmlFor="tamaño" className="ml-2">tamaño</label>
                        <input className="form-control mr-2 ml-2" type="text" name="tamaño" ref={this.tamañoRef} onChange={this.changeState} onBlur={this.changeState} required />
                    </div>
                    

                    <div className="clearfix"></div>
                    <input type="submit"  onClick={this.add} value="Registro" className="btn btn-success" />




        </div> );
    }
}
 
export default AddProducto;