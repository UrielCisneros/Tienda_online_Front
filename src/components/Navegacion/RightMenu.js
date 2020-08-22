import React, { useState, useEffect } from 'react';
import { Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { LogoutOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../config/axios';

const { SubMenu } = Menu;

function RightMenu() {
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

	useEffect(() => {
		const obtenerQuienesSomos = async () => {
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
		obtenerQuienesSomos();
	}, []);

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
			{!tienda ? (
				<span />
			) : (
				<Menu.Item key="/quienes_somos">
					Quiénes somos<Link to="/quienes_somos" />
				</Menu.Item>
			)}
			{!decoded ? (
				<span />
			) : (
				<Menu.Item key="/pedidos">
					Pedidos<Link to="/pedidos" />
				</Menu.Item>
			)}
			{token ? (
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
						Mi cuenta<Link to="/" />
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
						Panel de administrador<Link to="/admin" />
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
				<span />
			)}

			{token === '' || token === null ? (
				<Menu.Item>
					Entrar<Link to="/entrar" />
				</Menu.Item>
			) : (
				<span />
			)}
		</Menu>
	);
}

export default RightMenu;
