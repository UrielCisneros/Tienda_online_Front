import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Table, Input, notification, Avatar, Spin, Col, Row, Button } from 'antd';
import { RollbackOutlined, UserOutlined } from '@ant-design/icons';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import './clientes.scss'

const { Search } = Input;

function Clientes(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ loading, setLoading ] = useState(false);
	const [ clientes, setClientes ] = useState([]);
	const [ clientesPaginados, setClientesPaginados ] = useState([]);
	const [ visible, setVisible ] = useState('d-none');

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	if (token === '' || token === null) {
		props.history.push('/entrar');
	} else if (decoded['rol'] !== true) {
		props.history.push('/');
	}

	useEffect(
		() => {
			obtenerClientes(20, page);
		},
		[ page ]
	);

	const columns = [
		{
			title: 'Imagen',
			dataIndex: 'imagen',
			key: 'imagen',
			render: (imagen) => {
				return !imagen ? (
					<Avatar icon={<UserOutlined />} />
				) : imagen.includes('https') ? (
					<Avatar src={imagen} />
				) : (
					<Avatar src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagen}`} />
				);
			}
		},
		{
			title: 'Nombre',
			dataIndex: 'nombre',
			key: 'nombre',
			fixed: 'left',
			render: (nombre) => <p>{nombre}</p>
		},
		{
			title: 'Apellido',
			dataIndex: 'apellido',
			key: 'apellido',
			render: (apellido) => (!apellido ? <p>-</p> : <p>{apellido}</p>)
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
			render: (email) => <p>{email}</p>
		},
		{
			title: 'Dirección',
			dataIndex: 'direccion',
			key: 'direccion',
			render: (direccion) => {
				return direccion.map((res) => {
					return (
						<div key={res._id}>
							<p>
								{res.calle_numero}, {res.colonia}
							</p>
						</div>
					);
				});
			}
		},
		{
			title: 'Ciudad',
			dataIndex: 'direccion',
			key: 'direccion',
			render: (ciudad) => {
				return ciudad.map((res) => {
					return (
						<div key={res._id}>
							<p>
								{res.ciudad}, {res.estado}, {res.pais}
							</p>
						</div>
					);
				});
			}
		}
	];

	async function obtenerClientes(limit, page) {
		setVisible('d-none');
		setLoading(true);
		await clienteAxios
			.get(`/cliente?limit=${limit}&page=${page}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setClientes(res.data.posts.docs);
				setClientesPaginados(res.data.posts);
				setLoading(false);
			})
			.catch((res) => {
				console.log(res);
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	}

	const obtenerClientesFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			obtenerClientes(10, page);
		} else {
			setVisible('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(`/cliente/filtrados?nombre=${busqueda}&apellido=${busqueda}&direccion=${busqueda}`, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					console.log(res);
					setClientesPaginados(res.data.posts);
					setClientes(res.data.posts);
					setLoading(false);
				})
				.catch((res) => {
					if (res.response.status === 404 || res.response.status === 500) {
						setLoading(false);
						notification.error({
							message: 'Error',
							description: res.response.data.message,
							duration: 2
						});
					} else {
						setLoading(false);
						notification.error({
							message: 'Error',
							description: 'Hubo un error',
							duration: 2
						});
					}
				});
		}
	};

	return (
		<Spin size="large" spinning={loading}>
			<Row justify="center">
				<Search
					placeholder="Buscar un cliente"
					onSearch={(value) => obtenerClientesFiltrados(value)}
					style={{ height: 40, marginBottom: 10 }}
					enterButton="Buscar"
					size="large"
					className="search-width"
				/>

				<Button
					type="primary"
					size="large"
					className={visible}
					onClick={() => obtenerClientes(10, page)}
					icon={<RollbackOutlined style={{ fontSize: 24 }} />}
				>
					Volver
				</Button>
			</Row>
			<Table
				className="tabla-inventario mt-5"
				columns={columns}
				dataSource={clientes}
				pagination={false}
				rowKey={(clientes) => clientes._id}
				scroll={{ x: 1200 }}
			/>
			<div className="mt-5">
				<Pagination blogs={clientesPaginados} location={location} history={history} limite={20}/>
			</div>
		</Spin>
	);
}

export default Clientes;
