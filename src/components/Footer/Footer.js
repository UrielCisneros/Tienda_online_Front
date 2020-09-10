import React, { useState, useEffect } from 'react'
import clienteAxios from '../../config/axios';
import { Link } from 'react-router-dom';
import {  Button,  Layout} from 'antd';

import {FacebookFilled, InstagramFilled, TwitterCircleFilled, UserOutlined, KeyOutlined } from '@ant-design/icons';
import './footer.scss';

 const { Footer } = Layout;
const Style = {fontSize:15, color: "black"};



const FooterPage = () => {

    const [face, setFace] = useState('')
    const [insta, setInsta] = useState('')
    const [twitter, setTwitter] = useState('')
    const [imagenCorp, setImagenCorp] = useState('')
    const [nombreCorp, setNombreCorp] = useState('')
    const [politicas, setPoliticas] = useState('')
    const [telefono, setTelefono] = useState('')
    const [accion, setAccion] = useState(false)

    

    function peticionRedes(){
		clienteAxios.get('/tienda/')
			.then((res) => {
                console.log(res)
                if(res.data[0]){
                    console.log("entro");
                    setImagenCorp(res.data[0].imagenCorp)
                    setNombreCorp(res.data[0].nombre)
                    setPoliticas(res.data[0].politicas)
                    setTelefono(res.data[0].telefono)
                    if(res.data[0].linkFace !== 'undefined' && res.data[0].linkFace !== ''){
                        setFace(res.data[0].linkFace);
                        setAccion(true);
                    }
                    if(res.data[0].linkInsta !== 'undefined' && res.data[0].linkInsta !== ''){
                        setInsta(res.data[0].linkInsta);
                        setAccion(true);
                    }
                    if(res.data[0].linkTweeter !== 'undefined' && res.data[0].linkTweeter !== ''){
                        setTwitter(res.data[0].linkTweeter);
                        setAccion(true);
                    }
                }
			})
			.catch((err) => {
                console.log("No funciona");
			});
    }

    useEffect(() => {
        peticionRedes();
        setAccion(false)
    }, []);
    



    return(
       
         <Layout className="layout">
             <Footer >
                <div end="xs" id="foot"  className="row">  
                    <div className="col-lg-9 text-lg-left text-center ">
                        <div className="m-4 footer-border">
                            {console.log(imagenCorp)}
                            {imagenCorp !== '' ? (
                                <Link  to="/quienes_somos" >
                                    <Button id="is" type="link" style={Style} ><UserOutlined style={{fontSize: 17}}/>
                                        Conocenos
                                    </Button>
                                </Link>
                            ): ""}

                            {politicas !== '' ? (
                                <Link  to="/politicas">
                                    <Button id="is" type="link" style={Style} ><KeyOutlined style={{fontSize: 17}}/>
                                        Aviso de Privacidad
                                    </Button>
                                </Link>
                            ): ""}
                        </div>

                        <div className="mt-2 p-3">
                            <h2 style={{fontSize: 18}} >{nombreCorp !== '' ? nombreCorp : ""}</h2>
                            {telefono !== '' ? (<p>Telefono: {telefono} </p>): ""}
                        </div>
                    </div>

                    <div className="col-lg-3 p-3" style={{textAlign:"center"}}>
                        {accion ? (<p style={{fontSize: 30, }}>Buscanos en:</p>):""}
                        

                        {face !== '' ? 
                            (
                            <a href={`https://${face}`} target="_blank">
                                <FacebookFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        
                        }
                        {insta !== '' ? 
                            (
                            <a href={`https://${insta}`} target="_blank">
                                <InstagramFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        }
                        
                        {twitter !== '' ? 
                            (
                            <a href={`https://${twitter}`} target="_blank">
                                <TwitterCircleFilled  id="is" style={{fontSize: 45, color:"gray"}} />
                            </a>
                            ):('')
                        }
                        
                    </div>
                </div>
             {/* <p style={{textAlign:"center"}}>Ant Design ©2018 Created by Ant UED</p> */}
             </Footer>
         </Layout>
    )
}

export default FooterPage;
