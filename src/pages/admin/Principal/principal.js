import React from 'react'
import {Helmet} from "react-helmet";
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode'

function Admin(props) {
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
            <Helmet>
                <meta charSet="utf-8" />
                <title>Panel Principal</title>
            </Helmet>
            <h1>Estamos en admin home</h1>
        </div>
    )
}

export default withRouter(Admin)