import React, { useEffect } from 'react'
import {Helmet} from "react-helmet";
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode'
import RegistroTienda from '../services/paginaTienda/RegistroTienda/RegistroTienda';
import RegistroImagenCorporativa from '../services/paginaTienda/RegistroImagenCorporativa/RegistroImagenCorporativa';
import RegistroPoliticas from '../services/paginaTienda/RegistroPoliticas/RegistroPoliticas';
import MostrarRegistroTienda from '../services/paginaTienda/RegistroTienda/MostrarRegistroTienda';

import './admin.scss';

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
            <div>
                <div>
                    <MostrarRegistroTienda />
                </div>
                <div>
                    <RegistroImagenCorporativa />
                </div>
                <div>
                    <RegistroPoliticas />
                </div>
            </div>
        </div>
    )
}

export default withRouter(Admin)