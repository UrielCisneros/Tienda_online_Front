import React, { useState,useCallback,useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../../config/axios';
import {Spin} from 'antd';
import ActualizarUsuario from './service/ActualizarUsuario';


export default function Perfiles(props) {

    const [datosUser, setDatosUser] = useState(null)
    const [loading, setLoading] = useState(false)
    
    //Obtener token de localStorage
    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 
    
    console.log(decoded);
    //Decodificar el JWT
	function Jwt(token) {
		try {
            return jwt_decode(token);
		} catch (e) {
			return null;
		}
    }

    //Verificar el JWT
    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== false){
        props.history.push('/')
    }

      async function obtenerDatosUser() {
            if(token === null){
                return null
            }
            await clienteAxios.get(`/cliente/${decoded._id}`,{
                headers:{
                    'Content-Type': 'multipart/form-data',
                     Authorization: `bearer ${token}`
                }
            })
            .then((res) => {
                console.log(res);
                setDatosUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            setLoading(false)
      }


      useEffect(() => {
        setLoading(true)
        obtenerDatosUser();
      }, [])



    return (
        <Spin size="large" spinning={loading}>
            <div className="container col-lg-6">
                <h1 className="mt-5 text-center">Bienvenido a tu perfil</h1>
                    <div className="mt-3 px-5 mx-auto" style={{background: "white", left: "50%"}}>
                        <ActualizarUsuario datosUser={datosUser} decoded={decoded} />
                    </div>
            </div>
        </Spin>
    )
}
