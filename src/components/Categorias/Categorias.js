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
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
		obtenerCategorias();
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

	const render = categorias.map((categoria) => {
		return (
			<SubMenu
				key={categoria.categoria}
				title={categoria.categoria}
				className="submenu-categoria"
				onTitleClick={() => props.history.push(`/searching/${categoria.categoria}`)}
			>
				{categoria.subcCategoria.map((sub) => {
					return (
						<Menu.Item key={sub._id} onClick={() => props.history.push(`/searching/${sub._id}`)}>
							{sub._id}
						</Menu.Item>
					);
				})}
			</SubMenu>
		);
	});

	return (
		<div className="container-subcategorias-nav">
			<Spin className="ml-5 d-inline" spinning={loading} />
			<Menu
				className="categorias-navbar d-inline"
				theme="light"
				mode="horizontal"
				defaultSelectedKeys={[ window.location.pathname ]}
			>
				{render}
			</Menu>
		</div>
	);
};

export default withRouter(Categorias);
