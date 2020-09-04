import React, { useState, useEffect } from 'react'
import clienteAxios from '../../../config/axios';
import Geolocalizacion from '../geolocalizacion'
import {Divider} from 'antd'
import {FacebookFilled, InstagramFilled, TwitterCircleFilled } from '@ant-design/icons';


export default function Datos_tienda() {
    
    const [lat] = useState("19.767980")
    const [lng] = useState("-104.358159")

    const [tienda, setTienda] = useState({})
    const [direccion, setDireccion] = useState({})

    const [face, setFace] = useState('')
    const [insta, setInsta] = useState('')
    const [twitter, setTwitter] = useState('')

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
                if(res.data[0].linkFace !== 'undefined' && res.data[0].linkFace !== ''){
                    setFace(res.data[0].linkFace);
                }
               
			})
			.catch((err) => {
                console.log("No funciona");
			});
    }

    useEffect(() => {
        peticionTienda();
        peticionDireccion();
    }, []);


    const styles = {fontSize: 25};

    return (
        <div>
            <div className="container-fluid">

            <div className="bg-dark" style={{height: '8vh'}}>
                <h1 className="text-white text-center h2 m-3">Localiza nuestra tienda</h1>
            </div>

                <div className="row">
                    <div className="col-lg-6">
                    <Geolocalizacion 
                        height="60vh"
                        width="100%"
                        center={[lat, lng]}
                        titleLayer={'map'}
                        zoom={15}
                        apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                        nombreMarcador = "AB soluciones Empresariales"
                    />
                    </div>

                    <div className="col-lg-5 mt-5 text-center"X >
                      
                        <p style={styles} className="font-weight-bold mt-5">{tienda.nombre}</p>
                        <p style={styles} className="mt-3">Tel: <spam>{tienda.telefono}</spam></p>
                        <p style={styles}>Direccion: <spam>{direccion.calle_numero}</spam></p>
                        <p style={styles}><spam>Col. {direccion.colonia}, {direccion.ciudad}, {direccion.estado}</spam></p>
                        <p style={styles}>CP: <spam>{direccion.cp}</spam></p>
                        
                    </div>
                </div>
            </div>           
        </div>
    )
}

