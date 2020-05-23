import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Layout } from 'antd';
import Navegacion from '../components/Navegacion';
import FooterPage from '../components/Footer';

export default function LayoutBasic(props) {
	const { routes } = props;
	const { Content, Footer } = Layout;

	return (
		<div>
			<Layout>
				<Layout>
					<Navegacion />
					<Content style={{ height: "auto" }}>
						<div className="site-layout-content flex">
							<LoadRoutes routes={routes} />
						</div>
					</Content>
					<Footer>
						<FooterPage />
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
