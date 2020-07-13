import React from 'react';
import { Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';

function RightMenu() {
	const token = localStorage.getItem('token');

	return (
		<Menu defaultSelectedKeys={[ window.location.pathname ]}>
			<Menu.Item key="/">
				Home<Link to="/" />
			</Menu.Item>
			<Menu.Item key="/productos">
				Productos<Link to="/productos" />
			</Menu.Item>
			<Menu.Item key="/ofertas">
				Ofertas<Link to="/ofertas" />
			</Menu.Item>
			<Menu.Item key="/blog">
				Blog<Link to="/blog" />
			</Menu.Item>
			<Menu.Item key="/quienes_somos">
				Quiénes somos<Link to="/quienes_somos" />
			</Menu.Item>
			<Menu.Item key="/pedidos">
				Pedidos<Link to="/pedidos" />
			</Menu.Item>
			<Menu.Item key="/shopping_cart">
				Carrito<Link to="/shopping_cart" />
			</Menu.Item>

			{token === '' || token === null ? (
				<Menu.Item>
					Entrar<Link to="/entrar" />
				</Menu.Item>
			) : (
				<Button
					type="primary"
					onClick={() => {
						localStorage.removeItem('token');
						firebase.auth().signOut();
						window.location.reload();
					}}
					danger
				>
					Cerrar Sesión
				</Button>
			)}
		</Menu>
	);
}

export default RightMenu;
