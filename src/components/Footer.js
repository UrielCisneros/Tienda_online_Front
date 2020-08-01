import React from 'react'
import { Link } from 'react-router-dom';
import { Layout, Button, Input, Modal} from 'antd';

import {FacebookFilled, InstagramFilled, TwitterCircleFilled, PhoneOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import './footer.scss';

const { Footer } = Layout;
const Style = {fontSize:17, color: "black"};


const FooterPage = () => {
  

    return(
       
        <Layout className="layout">
            <Footer  id="foot" >
                <div className="row">
                
               
                <div className="text-center text-lg-left col-lg-4">
                <img alt="example" width="110" height="130" id="is"
                    className="d-none d-lg-block"
                    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" 
                    />
                    <h4>A&B Soluciones</h4>
                    <p>Descubrimos lo mejor de tu empresa</p>
                    <p>Nuestra Ubicacion</p>
                </div>

                <div className="col-lg-3" style={{textAlign:"center"}}>
                    <p style={{fontSize: 30, marginTop: 15}}>Buscanos en:</p>
                    <FacebookFilled style={{fontSize: 45}} />
                    <InstagramFilled style={{fontSize:  45, marginLeft: 10}} />
                    <TwitterCircleFilled  style={{fontSize: 45, marginLeft: 10}}/>
                </div>


                <div className="col-lg-5 text-center text-lg-left" style={{borderLeftStyle: "solid", marginTop: 20}}>
                    <br/>
                    <Link  to="/quienes_somos" >
                    <Button type="link" style={Style} ><PhoneOutlined style={{fontSize: 25}} />
                    Contactanos</Button>
                    </Link>
                    <Link  to="/quienes_somos">
                    <Button type="link" style={Style} ><KeyOutlined style={{fontSize: 25}}/>
                    Aviso de Privacidad</Button>
                    </Link>
                    <Link  to="/quienes_somos" >
                    <Button type="link" style={Style} ><UserOutlined style={{fontSize: 25}}/>
                    Conocenos</Button>
                    </Link>
                    <p style={{fontSize: 16, marginTop: 15}} className="d-none d-lg-block" >
                        <br/>
                        Deja tu correo nosotros, nos contactaremos contigo:
                        <Input placeholder="correo.123@hotmail.com" style={{width: "70%"}} />
                        <Button type="primary" danger>
                            Enviar
                        </Button>
                    </p>
                   
                </div>

                </div>
            <p style={{textAlign:"center"}}>Ant Design ©2018 Created by Ant UED</p>
            </Footer>
        </Layout>
    )
}

export default FooterPage;
