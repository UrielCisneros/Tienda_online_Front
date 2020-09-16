import React, { useState, useEffect} from 'react';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../../config/axios';

import {useParams} from 'react-router-dom'
import {Spin} from 'antd';

import Traer_pedido from "./services/traer_pedido";
import Traer_datos from "./services/traer_datos";

import "./confirmacion.scss";

export default function Confirmacion_compra() {

    const {url} = useParams();
    const [datosUser, setDatosUser] = useState(null);
    const [datosPedido, setPedido] = useState([]);
    const [loading, setLoading] = useState(false);
    const [accion, setAccion] = useState(false);
    
    //Obtener token de localStorage
    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 

    //Decodificar el JWT
	function Jwt(token) {
		try {
            return jwt_decode(token);
		} catch (e) {
			return null;
		}
    }

      async function obtenerDatosUser() {
            if(token === null){
                return null
            }
            await clienteAxios.get(`/pedidos/pedido/${url}`,{
                headers:{
                     Authorization: `bearer ${token}`
                }
            })
            .then((res) => {
                setDatosUser(res.data.cliente);
            })
            .catch((err) => {
                console.log(err);
            })
            setLoading(false)
      }

      async function obtenerPedido() {
        if(token === null){
            return null
        }
        await clienteAxios.get(`/pedidos/pedido/${url}`,{
            headers:{
                 Authorization: `bearer ${token}`
            }
        })
        .then((res) => {
            setPedido(res.data.pedido);
        })
        .catch((err) => {
            console.log(err);
        })
        setLoading(false)
  }


       
    useEffect(() => {
        setLoading(true)
        obtenerDatosUser();
        obtenerPedido();
        setAccion(false);
      }, [accion])


    return (
        <Spin size="large" spinning={loading}>
        <div >
        <h1 className="text-center mt-4" >Termina de realizar tu compra:</h1>
        <div className="container prinpales" style={{background: "white"}}>
            <div className="row">
                <div className="col-lg-5 mt-4">

                    <Traer_datos datosUser={datosUser} decoded={decoded} />
                    
                </div>
                
                <div className="col-lg-7 mt-4">
                    
                    <Traer_pedido datosPedido={datosPedido} />
                    
                </div>
            </div>
        </div>
        </div>
        </Spin>
    )
    
}
