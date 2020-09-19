import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../config/axios';
import Geolocalizacion from '../geolocalizacion'
import './informacion.scss'

import {Divider} from 'antd'
import {FacebookFilled, InstagramFilled, TwitterCircleFilled } from '@ant-design/icons';


export default function Datos_tienda() {
    
    const [tienda, setTienda] = useState({})
    const [direccion, setDireccion] = useState({})
    const [ubicacion, setUbicacion] = useState({})

    const [infor, setInfo] = useState('')
    

    function peticionDireccion(){
        clienteAxios.get('/tienda/')
                .then((res) => {
                    setDireccion(res.data[0].direccion[0]);
                })
                .catch((err) => {
                    console.log("No funciona");
                });
    }

    function peticionTienda(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                setTienda(res.data[0]);
                setInfo(res.data[0].nombre);
                // if(res.data[0].nombre !== 'undefined' && res.data[0].nombre !== ''){
                //    setInfo(res.data[0].nombre);
                // }
               
			})
			.catch((err) => {
                console.log("No funciona");
			});
    }

    useEffect(() => {
        peticionTienda();
        peticionDireccion();
    }, []);

    const [lat] = useState("19.767980")
    const [lng] = useState("-104.358159")

    return (
        <div>
            <div className="container-fluid mt-5">

            <div className="bg-dark" style={{height: '6 vh'}}>
                <h1 className="text-white text-center h2 m-3">Localiza nuestra tienda</h1>
            </div>
                {infor !== '' ? 
                    (
                    <div className="row">
                        <div className="col-lg-10">
                            <Geolocalizacion 
                                height="38vh"
                                width="100%"
                                center={[tienda.ubicacion[0].lat, tienda.ubicacion[0].lng]}
                                titleLayer={'map'}
                                zoom={15}
                                apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                                nombreMarcador = "AB soluciones Empresariales"
                            />
                        </div>

                        <div className="col-lg-2 text-center caligra" >
                            <img
                                className="logotipo"
                                alt="imagen de base"
                                src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${tienda.imagenLogo}`}
                            />
                                
                            <p className="h6 font-weight-bold"> {tienda.nombre} </p>
                            <p className="h6">Tel: <spam className="subs h6">{tienda.telefono}</spam></p>
                            <p className="h6">Direccion: <spam className="h6">{direccion.calle_numero}</spam></p>
                            <p className="h6">Col. <spam className="h6"> {direccion.colonia}, {direccion.ciudad}, {direccion.estado}</spam></p>
                            <p className="h6">CP: <spam>{direccion.cp}</spam></p> 
                        </div>
                    </div>
                ):('')
                }
            </div>           
        </div>
    )
}

