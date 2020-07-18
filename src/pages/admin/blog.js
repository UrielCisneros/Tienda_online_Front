import React from 'react'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

function BlogAdmin(props) {
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
            <h2>Estamos en blog admin</h2>
        </div>
    )
}
export default withRouter(BlogAdmin);