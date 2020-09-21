import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Input, Drawer, Badge, Avatar } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { MenuOutlined, ShoppingCartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../config/axios';
import RightMenu from './RightMenu';
import { MenuContext } from '../../context/carritoContext';
import { act } from 'react-dom/test-utils';

const { Search } = Input;
const { Header } = Layout;
const { SubMenu } = Menu;

const Navegacion = (props) => {
	const {active} = useContext(MenuContext)
	const [ visible, setVisible ] = useState(false);
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const [ tienda, setTienda ] = useState([]);
	const [ carrito, setCarrito ] = useState(0);
	const [ ofertas, setOfertas ] = useState([]);

	useEffect(() => {
		obtenerOfertas();
		obtenerQuienesSomos();
		if (token) {
			obtenerCarrito();
		}
	}, [ token, active]);

	async function obtenerCarrito() {
		await clienteAxios
			.get(`/carrito/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setCarrito(res.data.articulos.length);
			})
			.catch((res) => {
				setCarrito(0);
			});
	};
	async function obtenerQuienesSomos() {
		await clienteAxios
			.get('/tienda')
			.then((res) => {
				res.data.forEach((datos) => {
					setTienda(datos);
				});
			})
			.catch((res) => {
				console.log(res);
			});
	};
	async function obtenerOfertas() {
		await clienteAxios
			.get('/productos/promocion')
			.then((res) => {
				setOfertas(res.data);
			})
			.catch((res) => {
				console.log(res);
			});
	};

	const showDrawer = () => {
		setVisible(true);
	};
	const onClose = () => {
		setVisible(false);
	};

	return (
		<Layout className="layout">
			<Header>
				<div className="menuCon" style={{ backgroundColor: 'white' }}>
					<div className="top-menu row">
						<div className="col-lg-6">
							<div className="row">
								{!tienda.imagenLogo ? (
									<></>
								) : (
									<div className="col-3 contenedor-logo">
										<img
											className="imagen-logo-principal"
											alt="logotipo-tienda"
											src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${tienda.imagenLogo}`}
										/>
									</div>
								)}
								<div className="col-9">
									<Search
										placeholder="Busca un producto"
										onSearch={(value) => props.history.push(`/searching/${value}`)}
										style={{ width: '70%' }}
										size="large"
									/>
								</div>
							</div>
						</div>
						<div className="col-lg-6 nav-menu-enlaces">
							<Menu
								className="float-right"
								theme="light"
								mode="horizontal"
								defaultSelectedKeys={[ window.location.pathname ]}
								inlineIndent={0}
							>
								<Menu.Item key="/">
									Home<Link to="/" />
								</Menu.Item>
								<Menu.Item key="/productos">
									Productos<Link to="/productos" />
								</Menu.Item>
								{
									ofertas.length ?
									<Menu.Item key="/ofertas">
										Ofertas<Link to="/ofertas" />
									</Menu.Item>:
									<></>
								}
								<Menu.Item key="/blog">
									Blog<Link to="/blog" />
								</Menu.Item>
								{tienda.length !== 0 ? (
									<Menu.Item key="/quienes_somos">
										Quiénes somos<Link to="/quienes_somos" />
									</Menu.Item>
								) : (
									<></>
								)}
								{!decoded ? (
									<></>
								) : (
									<Menu.Item key="/pedidos">
										Pedidos<Link to="/pedidos" />
									</Menu.Item>
								)}
								{!decoded ? (
									<></>
								) : (
									<Menu.Item key="/shopping_cart">
										<Badge count={carrito}>
											<ShoppingCartOutlined style={{ fontSize: 25 }} />
											<Link to="/shopping_cart" />
										</Badge>
									</Menu.Item>
								)}
								{token && decoded['rol'] === false ? (
									<SubMenu
										icon={
											!decoded.imagen && !decoded.imagenFireBase ? (
											<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
												<p>{decoded.nombre.charAt(0)}</p>
											</Avatar>
											) : decoded.imagenFireBase ? (
											<Avatar size="large" src={decoded.imagenFireBase} />
											 ) : (
											<Avatar size="large" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${decoded.imagen}`} />
											 )
										}
									>
										<Menu.Item>
											<SettingOutlined />Mi cuenta<Link to="/perfiles" />
										</Menu.Item>
										<Menu.Item>
											<p
												className="text-danger"
												onClick={() => {
													localStorage.removeItem('token');
													firebase.auth().signOut();
													window.location.reload();
												}}
											>
												<LogoutOutlined />Cerrar Sesión
											</p>
										</Menu.Item>
									</SubMenu>
								) : decoded && decoded['rol'] === true ? (
									<SubMenu
										icon={
											!decoded.imagen ? (
												<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
													<p>{decoded.nombre.charAt(0)}</p>
												</Avatar>
											) : (
												<Avatar size="large" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${decoded.imagen}`}>
													{/* <p>{decoded.nombre.charAt(0)}</p> */}
												</Avatar>
											)
										}
									>
										<Menu.Item>
											<SettingOutlined />Panel de administrador<Link to="/admin" />
										</Menu.Item>
										<Menu.Item>
											<p
												className="text-danger"
												onClick={() => {
													localStorage.removeItem('token');
													firebase.auth().signOut();
													window.location.reload();
												}}
											>
												<LogoutOutlined />Cerrar Sesión
											</p>
										</Menu.Item>
									</SubMenu>
								) : (
									<></>
								)}

								{token === '' || token === null ? (
									<Menu.Item>
										Entrar<Link to="/entrar" />
									</Menu.Item>
								) : (
									<></>
								)}
							</Menu>
						</div>
					</div>
					<div className="mt-3 top-menu-responsive">
						<Button type="link" className="barsMenu" onClick={showDrawer}>
							<MenuOutlined style={{ fontSize: 22, color: 'black' }} />
						</Button>
						<Search
							className="search"
							placeholder="input search text"
							onSearch={(value) => console.log(value)}
							style={{ width: 270 }}
						/>
						{!decoded ? (
							<></>
						) : (
							<Badge count={carrito}>
								<ShoppingCartOutlined style={{ fontSize: 28 }} />
								<Link to="/shopping_cart" />
							</Badge>
						)}
					</div>
					<Drawer title="LOGO" placement="left" closable={false} onClose={onClose} visible={visible}>
						<RightMenu />
					</Drawer>
				</div>
			</Header>
		</Layout>
	);
};

export default withRouter(Navegacion);
