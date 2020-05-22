import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Layout } from 'antd';


export default function LayoutAdmin(props) {
	const { routes } = props;
    const { Header, Content } = Layout;


	return (
		<div>
			<Layout>
				<Layout>
					<Sidebar />
					<Layout className="site-layout">
                        <Header className="site-layout-background bg-white" style={{ padding: 0 }}></Header>
                        <Content style={{ margin: '24px 16px 0' }}>
                            <div className="site-layout-background bg-white" style={{ padding: 24, minHeight: 360 }}>
                                <LoadRoutes routes={routes} />
                            </div>
                        </Content>
                    </Layout>
				</Layout>
			</Layout>
		</div>
	);
}

function LoadRoutes({ routes }) {
	return (
		<Switch>
			{routes.map((route, index) => (
				<Route key={index} path={route.path} exact={route.exact} component={route.component} />
			))}
		</Switch>
	);
}
