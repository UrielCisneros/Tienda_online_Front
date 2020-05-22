import React from 'react'
import { Layout } from 'antd';

const { Footer } = Layout;

const FooterPage = () => {
    return(
        <Layout className="layout">
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}

export default FooterPage;
