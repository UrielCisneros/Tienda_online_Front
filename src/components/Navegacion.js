import React, { useState } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge } from 'antd';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { MenuOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode'

import RightMenu from './RightMenu';

const { Search } = Input;
const { Header } = Layout;

const Navegacion = () => {
	const [ visible, setVisible ] = useState(false);
	const token = localStorage.getItem('token');
	var decoded = Jwt(token) 
	
	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}
	

	const showDrawer = () => {
		setVisible(true);
	};
	const onClose = () => {
		setVisible(false);
	};

	return (
		<Layout className="layout">
			<Header>
				<div className="d-none">{/* LOGO */}</div>

				<div className="menuCon" style={{ backgroundColor: 'white' }}>
					<div className="row">
						<Menu
							className="top-menu-responsive w-100"
							theme="light"
							mode="horizontal"
							defaultSelectedKeys={[ window.location.pathname ]}
						>
							<Menu.Item className="pr-2">
								<Button
									type="link"
									className="mb-3 pr-2 d-flex justify-content-center align-items-center barsMenu"
									onClick={showDrawer}
								>
									<MenuOutlined style={{ fontSize: 22, color: 'black' }} />
								</Button>
							</Menu.Item>
							<Search
								className="search"
								placeholder="input search text"
								onSearch={(value) => console.log(value)}
								style={{ width: 240 }}
							/>
							<Badge count={1} className="ml-2">
								<ShoppingCartOutlined style={{ fontSize: 28 }} />
								<Link to="/shopping_cart" />
							</Badge>
						</Menu>
					</div>
					<Menu
						className="top-menu float-right"
						theme="light"
						mode="horizontal"
						defaultSelectedKeys={[ window.location.pathname ]}
					>
						<Search
							placeholder="input search text"
							onSearch={(value) => console.log(value)}
							style={{ width: 350 }}
						/>
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

						{decoded && decoded['rol'] === true ? 
							<Menu.Item>
							Panel de Administrador<Link to="/admin" />
							</Menu.Item> : <i></i>
						}

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
					<Drawer title="LOGO" placement="left" closable={false} onClose={onClose} visible={visible}>
						<RightMenu />
					</Drawer>
				</div>
			</Header>
		</Layout>
	);
};

export default Navegacion;
