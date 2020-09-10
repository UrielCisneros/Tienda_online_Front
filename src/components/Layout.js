import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Navegacion from '../components/Navegacion/Navegacion';
import Categorias from './Categorias/Categorias';
import FooterPage from '../components/Footer/Footer';
import './Layout.scss';

export default function LayoutBasic(props) {
	const { routes } = props;
	const { Content, Footer } = Layout;

	return (
		<div>
			<Layout>
				<Layout>
					<Navegacion />
					<Categorias />
					<Content style={{ height: "auto" }}>
						<div className="site-layout-content flex">
							<LoadRoutes routes={routes} />
						</div>
					</Content>
					<Footer style={{margin:0,padding: 0}} >
						<FooterPage style={{margin:0,padding: 0}} />
					</Footer>
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
