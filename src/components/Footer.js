import React from 'react'
import { Link } from 'react-router-dom';
import {  Button} from 'antd';

import {FacebookFilled, InstagramFilled, TwitterCircleFilled, HomeOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';
import './footer.scss';

// const { Footer } = Layout;
const Style = {fontSize:15, color: "black"};


const FooterPage = () => {
  

    return(
       
        // <Layout className="layout">
        //     <Footer  >
                <div id="foot"  className="row">
                    
                <div className="col-lg-9 text-lg-left text-center ">
                    <div className="mt-4">
                    <Link  to="/quienes_somos" >
                    <Button id="is" type="link" style={Style} ><HomeOutlined  style={{fontSize: 17}} />
                    Imagen Coorporativa</Button>
                    </Link>
                    <Link  to="/politicas">
                    <Button id="is" type="link" style={Style} ><KeyOutlined style={{fontSize: 17}}/>
                    Aviso de Privacidad</Button>
                    </Link>
                    <Link  to="/quienes_somos" >
                    <Button id="is" type="link" style={Style} ><UserOutlined style={{fontSize: 17}}/>
                    Conocenos</Button>
                    </Link>
                    </div>
                    <div className="mt-2 p-3">
                    <h2 style={{fontSize: 18}} >A&B Soluciones</h2>
                    <p>Descubrimos lo mejor de tu empresa</p>
                    <p>Nuestra Ubicacion</p>
                    </div>
                </div>

                {/* <div className="col-lg-4 d-none d-lg-block text-center text-lg-left mt-4" style={{alignItems: "center"}}>
                    Aqui estaria tu super logo, cambiar las propiedades de col-lg-5, 
                    en el div superior al agregar este div de logo              
                </div> */}

                <div className="col-lg-3 p-3" style={{textAlign:"center"}}>
                    <p style={{fontSize: 30, }}>Buscanos en:</p>
                    <Link><FacebookFilled  id="is" style={{fontSize: 45, color:"gray"}} /></Link>
                    <Link><InstagramFilled className="ml-3" id="is" style={{fontSize:  45 ,color:"gray"}} /></Link>
                    <Link><TwitterCircleFilled className="mt-3 ml-3" id="is"  style={{fontSize: 45, color:"gray"}}/></Link>
                </div>
                </div>
        //     <p style={{textAlign:"center"}}>Ant Design ©2018 Created by Ant UED</p>
        //     </Footer>
        // </Layout>
    )
}

export default FooterPage;
