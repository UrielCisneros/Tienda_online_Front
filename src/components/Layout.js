import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Navegacion from '../components/Navegacion/Navegacion';
import FooterPage from '../components/Footer/Footer';
import { MenuProvider } from '../context/carritoContext';

export default function LayoutBasic(props) {
	const { routes } = props;
	const { Content, Footer } = Layout;

	return (
		<div>
			<Layout>
				<Layout>
					<MenuProvider >
					<Navegacion />
					<Content style={{ height: "auto" }}>
						<div className="site-layout-content flex">
							<LoadRoutes routes={routes} />
						</div>
					</Content>
					</MenuProvider>
				</Layout>
			</Layout>
			<Footer style={{margin:0,padding: 0}} >
				<FooterPage style={{margin:0,padding: 0}} />
			</Footer>
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
