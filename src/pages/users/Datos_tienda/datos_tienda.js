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
                if(res.data[0].linkInsta !== 'undefined' && res.data[0].linkInsta !== ''){
                    setInsta(res.data[0].linkInsta);
                }
                if(res.data[0].linkTweeter !== 'undefined' && res.data[0].linkTweeter !== ''){
                    setTwitter(res.data[0].linkTweeter);
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


    const styles = {fontsize: "30", alignText:"center"};

    return (
        <div>
            <div className="container-fluid">

            <div className="bg-dark" style={{height: '8vh'}}>
                <h1 className="text-white text-center h2 m-3">Localiza nuestra tienda</h1>
            </div>

                <div className="row">
                    <div className="col-lg-7">
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

                    

                    <div className="col-lg-4 text-center" style={styles}>
                    <Divider className="font-weight-bold" style={{background: "white"}}type="vertical" />
                        <img
                            width="200"
                            alt="imagen de base"
                            src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${tienda.imagenLogo}`}
                        />
                        <Divider style={{backgroundcolor: "white"}}>
                        <p className="font-weight-bold">{tienda.nombre}</p>
                        </Divider>
                        <p>Tel: <spam>{tienda.telefono}</spam></p>
                        <p>Direccion: <spam>{direccion.calle_numero}</spam></p>
                        <p><spam>Col. {direccion.colonia}, {direccion.ciudad}, {direccion.estado}</spam></p>
                        <p>CP: <spam>{direccion.cp}</spam></p>
                        
                        {/* <p style={{fontSize: 25, }}>Buscanos en:</p>

                        {face !== '' ? 
                            (
                            <a href={`https://${face}`} target="_blank">
                                <FacebookFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        }
                        {insta !== '' ? 
                            (
                            <a href={insta}>
                                <InstagramFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        }
                        {twitter !== '' ? 
                            (
                            <a href={twitter}>
                                <TwitterCircleFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        } */}
                    </div>
                </div>
            </div>           
        </div>
    )
}

