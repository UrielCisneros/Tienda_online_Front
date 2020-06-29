import React, { useEffect } from 'react'
import {Helmet} from "react-helmet";
import { withRouter } from 'react-router-dom';

function Admin(props) {

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
            <Helmet>
                <meta charSet="utf-8" />
                <title>Panel Principal</title>
            </Helmet>
            <h1>Estamos en admin home</h1>
        </div>
    )
}

export default withRouter(Admin)