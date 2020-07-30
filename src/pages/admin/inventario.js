import React from 'react'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import InfiniteListExample from './testscroll'

function Inventario(props) {
    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 
	
	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }

    return (
        <div>
            <h1>Estamos en inventario</h1>
            <InfiniteListExample />
        </div>
    )
}
export default withRouter(Inventario)
