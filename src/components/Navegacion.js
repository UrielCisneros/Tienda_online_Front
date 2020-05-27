import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const Navegacion = () => {
	const [ datos, setDatos ] = useState({
		titulo: ''
	});

	const handleInputChange = (event) => {
		console.log(event.target.value);
		setDatos({
			...datos,
			[event.target.name]: event.target.value
		});
	};

	const enviarDatos = (event) => {
		console.log(datos.titulo);
		return <Link to="productos" />;
	};

	return (
		<Layout className="layout">
			<Header>
				<Menu className="float-right" theme="dark" mode="horizontal" defaultSelectedKeys={[ '' ]}>
					<Menu.Item>
						<div>
							<form className="form-inline" onSubmit={enviarDatos}>
								<input
									className="form-control"
									name="titulo"
									type="search"
									placeholder="Search"
									onChange={handleInputChange}
								/>
								<button className="btn btn-primary my-2 my-sm-0" type="submit">
									Search
								</button>
							</form>
						</div>
					</Menu.Item>
					<Menu.Item key="1">
						Home<Link to="/" />
					</Menu.Item>
					<Menu.Item>
						Productos<Link to="/productos" />
					</Menu.Item>
					<Menu.Item>
						Ofertas<Link to="/ofertas" />
					</Menu.Item>
					<Menu.Item>
						Blog<Link to="/blog" />
					</Menu.Item>
					<Menu.Item>
						Quiénes somos<Link to="/quienes_somos" />
					</Menu.Item>
					<Menu.Item>
						Pedidos<Link to="/pedidos" />
					</Menu.Item>
					<Menu.Item>
						Carrito<Link to="/shopping_cart" />
					</Menu.Item>
					<Menu.Item>
						Entrar<Link to="/entrar" />
					</Menu.Item>
				</Menu>
			</Header>
		</Layout>
	);
};

export default Navegacion;
