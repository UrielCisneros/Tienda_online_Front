import React from 'react'
import { Link } from 'react-router-dom';
import { Layout, Button, Input, Modal} from 'antd';

import {FacebookFilled, InstagramFilled, TwitterCircleFilled, PhoneOutlined, UserOutlined, KeyOutlined } from '@ant-design/icons';

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
