import React from 'react'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function SistemaApartado(props) {
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
            <h1>Estamos en sistema de apartado</h1>
        </div>
    )
}
export default withRouter(SistemaApartado);
