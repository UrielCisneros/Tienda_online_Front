import React, { useState, useEffect } from 'react';
import { Menu, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import * as firebase from 'firebase/app';
import './navegacion.scss';
import 'firebase/auth';
import 'firebase/firestore';
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../config/axios';

const { SubMenu } = Menu;

function RightMenu(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	const { ofertas, tienda } = props;

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	return (
		<Menu defaultSelectedKeys={[ window.location.pathname ]}>
			<Menu.Item key="/">
				Inicio<Link to="/" />
			</Menu.Item>
			<Menu.Item key="/productos">
				Productos<Link to="/productos" />
			</Menu.Item>
			{ofertas.length ? (
				<Menu.Item key="/ofertas">
					Ofertas<Link to="/ofertas" />
				</Menu.Item>
			) : (
				<Menu.Item className="d-none" />
			)}
			<Menu.Item key="/blog">
				Blog<Link to="/blog" />
			</Menu.Item>
			{tienda.length === 0 ? (
				<Menu.Item className="d-none" />
			) : (
				<Menu.Item key="/quienes_somos">
					Quiénes somos<Link to="/quienes_somos" />
				</Menu.Item>
			)}
			{!decoded || decoded.rol === true ? (
				<Menu.Item className="d-none" />
			) : (
				<Menu.Item key="/pedidos">
					Mis pedidos<Link to="/pedidos" />
				</Menu.Item>
			)}
			{token && decoded['rol'] === false ? (
				<SubMenu
					className="nav-font-color nav-border-color"
					icon={
						!decoded.imagen && !decoded.imagenFireBase ? (
							<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
								<p>{decoded.nombre.charAt(0)}</p>
							</Avatar>
						) : decoded.imagenFireBase ? (
							<Avatar size="large" src={decoded.imagenFireBase} />
						) : (
							<Avatar
								size="large"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${decoded.imagen}`}
							/>
						)
					}
				>
					<Menu.Item className=" nav-border-color">
						<SettingOutlined />Mi cuenta<Link to="/perfiles" />
					</Menu.Item>
					<Menu.Item>
						<p
							className="text-danger"
							onClick={() => {
								localStorage.removeItem('token');
								firebase.auth().signOut();
								setTimeout(() => {
									window.location.reload();
								}, 1000);
							}}
						>
							<LogoutOutlined />Cerrar Sesión
						</p>
					</Menu.Item>
				</SubMenu>
			) : decoded && decoded['rol'] === true ? (
				<SubMenu
					className="nav-font-color nav-border-color"
					icon={
						!decoded.imagen ? (
							<Avatar size="large" style={{ backgroundColor: '#87d068' }}>
								<p>{decoded.nombre.charAt(0)}</p>
							</Avatar>
						) : (
							<Avatar
								size="large"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${decoded.imagen}`}
							>
								{/* <p>{decoded.nombre.charAt(0)}</p> */}
							</Avatar>
						)
					}
				>
					<Menu.Item className=" nav-border-color">
						<SettingOutlined />Panel de administrador<Link to="/admin" />
					</Menu.Item>
					<Menu.Item className="nav-font-color nav-border-color">
						<p
							className="text-danger"
							onClick={() => {
								localStorage.removeItem('token');
								firebase.auth().signOut();
								setTimeout(() => {
									window.location.reload();
								}, 1000);
							}}
						>
							<LogoutOutlined />Cerrar Sesión
						</p>
					</Menu.Item>
				</SubMenu>
			) : (
				<Menu.Item className="d-none" />
			)}

			{token === '' || token === null ? (
				<Menu.Item>
					Entrar<Link to="/entrar" />
				</Menu.Item>
			) : (
				<Menu.Item className="d-none" />
			)}
		</Menu>
	);
}

export default RightMenu;
