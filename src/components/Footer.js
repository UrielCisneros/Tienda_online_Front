import React from 'react'
import { Link } from 'react-router-dom';
import { Layout} from 'antd';


const { Footer } = Layout;
const Style = {fontSize:17, color: "black"};


const FooterPage = () => {
  

    return(
       
        <Layout className="layout">
            <Footer  id="foot" >
            <p style={{textAlign:"center"}}>Ant Design ©2018 Created by Ant UED</p>
            </Footer>
        </Layout>
    )
}

export default FooterPage;
