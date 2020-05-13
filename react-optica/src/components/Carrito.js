import React, { Component } from 'react';


class Carrito extends Component {

    

    state = {  }

    componentDidMount () {
        var userId=this.props.location.state.userId;
        var carrito=this.props.location.state.carrito;

        
        
    }
    render() { 
        return (  <div>CArrito   </div>
            );
    }
}

export default Carrito;