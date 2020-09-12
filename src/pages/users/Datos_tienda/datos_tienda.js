import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../config/axios';
import Geolocalizacion from '../geolocalizacion'
import './informacion.scss'

import {Divider} from 'antd'
import {FacebookFilled, InstagramFilled, TwitterCircleFilled } from '@ant-design/icons';


export default function Datos_tienda() {
    
    const [lat] = useState("19.767980")
    const [lng] = useState("-104.358159")

    const [tienda, setTienda] = useState({})
    const [direccion, setDireccion] = useState({})

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
                setInfo(res.data[0].nombre)

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



    return (
        <div>
            <div className="container-fluid">

            <div className="" style={{height: '6 vh'}}>
                <h1 className="text-black text-center h2 m-3">Localiza nuestra tienda</h1>
            </div>

                <div className="row">
                    <div className="col-lg-10">
                        <Geolocalizacion 
                            height="35vh"
                            width="100%"
                            center={[lat, lng]}
                            titleLayer={'map'}
                            zoom={15}
                            apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                            nombreMarcador = "AB soluciones Empresariales"
                        />
                    </div>

                    <div className="col-lg-2 text-center caligra" >
                    {infor !== '' ? 
                    (
                        <div> 
                            <img
                            className="logotipo"
                            alt="imagen de base"
                            src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${tienda.imagenLogo}`}
                            />
                               
                            <p className=" font-weight-bold"> {tienda.nombre} </p>
                            <p className="">Tel: <spam className="subs">{tienda.telefono}</spam></p>
                            <p className="">Direccion: <spam className="">{direccion.calle_numero}</spam></p>
                            <p className="">Col. <spam className=""> {direccion.colonia}, {direccion.ciudad}, {direccion.estado}</spam></p>
                            <p className="fonts">CP: <spam>{direccion.cp}</spam></p> 
                        </div>
                    ):('')
                    }
                       
                      
                    </div>
                </div>
            </div>           
        </div>
    )
}

