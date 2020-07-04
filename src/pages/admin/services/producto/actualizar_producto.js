import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom';

function ActualizarProducto(props) {
    const token = localStorage.getItem('token')
    const rol = parseJwt(token)

    function parseJwt(token) {
        try {
          return JSON.parse(atob(token.split('.')[1]));
        } catch (e) {
          return null;
        }
      };

    useEffect( () => {
        if(token === '' || token === null){
            props.history.push('/entrar')
        }else if(rol['rol'] !== true){
            props.history.push('/')
        }
    })
    return (
        <div>
            <h2>Estamos en Actualizar Producto</h2>
        </div>
    )
}
export default withRouter(ActualizarProducto);