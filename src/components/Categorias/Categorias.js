import React, { useState, useEffect } from 'react';
import { Layout, Menu, Spin } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './categorias.scss';
import clienteAxios from '../../config/axios';

const { SubMenu } = Menu;

const Categorias = (props) => {
	const token = localStorage.getItem('token');
	const [ categorias, setCategorias ] = useState([]);
	const [ generos, setGeneros ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		obtenerCategorias();
		obtenerGeneros();
	}, []);

	async function obtenerCategorias() {
		setLoading(true);
		await clienteAxios
			.get('/productos/filtrosNavbar', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setCategorias(res.data);
			})
			.catch((res) => {
				console.log(res);
				setLoading(false);
			});
	}

	async function obtenerGeneros() {
		await clienteAxios
			.get('/productos/agrupar/generos')
			.then((res) => {
				setGeneros(res.data);
			})
			.catch((res) => {
				console.log(res);
			});
	}

	const categorias_nav = categorias.map((categoria) => {
		return (
			<SubMenu
				key={categoria.categoria}
				title={categoria.categoria}
				className="submenu-categoria nav-font-color-categorias"
				onTitleClick={() => props.history.push(`/searching/${categoria.categoria}`)}
			>
				{categoria.subcCategoria.map((sub) => {
					return (
						<Menu.Item
							className="nav-font-color-categorias"
							key={sub._id}
							onClick={() => props.history.push(`/searching/${sub._id}`)}
						>
							{sub._id}
						</Menu.Item>
					);
				})}
			</SubMenu>
		);
	});

	const categorias_generos = generos.map((generos) => {
		return (
			<Menu.Item
				className="nav-font-color-categorias"
				key={generos._id}
				onClick={() => props.history.push(`/searching/${generos._id}`)}
			>
				{generos._id}
			</Menu.Item>
		);
	});

	return (
		<Layout className="container-subcategorias-nav d-lg-inline">
			<Spin className="ml-5 d-inline spin-nav-categorias" spinning={loading} />
			<Menu
				className="categorias-navbar d-inline"
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
			>
				{categorias_nav}
				{loading === false ? (
					<SubMenu title="Género" className="submenu-categoria nav-font-color-categorias">
						{categorias_generos}
					</SubMenu>
				) : (
					<Menu.Item className="d-none" />
				)}
			</Menu>
		</Layout>
	);
};

export default withRouter(Categorias);
