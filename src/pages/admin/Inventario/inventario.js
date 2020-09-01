import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Table, Tag, Input, notification, Badge, Spin, Col, Row, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import './inventario.scss';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';

const { Search } = Input;

function Inventario(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ loading, setLoading ] = useState(false);
	const [ productos, setProductos ] = useState([]);
	const [ productosRender, setProductosRender ] = useState([]);
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
			obtenerProductos(20, page);
		},
		[ page ]
	);

	const columns = [
		{
			title: 'Producto',
			dataIndex: 'nombre',
			key: 'nombre',
			fixed: 'left',
			render: (text) => <p>{text}</p>
		},
		{
			title: 'Código',
			dataIndex: 'codigo',
			key: 'codigo',
			render: (text) => (!text ? <p>-</p> : <p>{text}</p>)
		},
		/* {
			title: 'tipo de Categoria',
			dataIndex: 'tipoCategoria',
			key: 'tipoCategoria',
			render: (text) => !text ? <p>-</p> : <p>{text.toLowerCase()}</p>
		}, */
		{
			title: 'Categoria',
			dataIndex: 'categoria',
			key: 'categoria',
			render: (text) => !text ? <p>-</p> : <p>{text.toLowerCase()}</p>
		},
		{
			title: 'Subcategoria',
			dataIndex: 'subCategoria',
			key: 'subCategoria',
			render: (text) => !text ? <p>-</p> : <p>{text.toLowerCase()}</p>
		},
		{
			title: 'Cantidad',
			dataIndex: 'cantidad',
			key: 'cantidad',
			render: (text) =>
				text === null ? (
					<p>-</p>
				) : text === 0 ? (
					<Badge count={text} showZero />
				) : (
					<Badge style={{ backgroundColor: '#52c41a' }} count={text} />
				)
		},
		{
			title: 'Talla y Cantidad',
			dataIndex: 'tallas',
			key: 'tallas',
			render: (tallas) => (
				<div>
					{!tallas.length ? (
						<p>-</p>
					) : (
						tallas.map((talla) => {
							return (
								<Badge
									className="badge-inventario"
									key={talla._id}
									count={talla.cantidad}
									showZero
									style={
										talla.cantidad !== 0 ? (
											{ backgroundColor: '#52c41a' }
										) : (
											{ backgroundColor: '#FF4D4F' }
										)
									}
								>
									<p>{talla.talla}</p>
								</Badge>
							);
						})
					)}
				</div>
			)
		},
		{
			title: 'Numero y Cantidad',
			dataIndex: 'numeros',
			key: 'numeros',
			render: (numeros) => (
				<div>
					{!numeros.length ? (
						<p>-</p>
					) : (
						numeros.map((numero) => {
							return (
								<Badge
									className="badge-inventario"
									key={numero._id}
									count={numero.cantidad}
									showZero
									style={
										numero.cantidad !== 0 ? (
											{ backgroundColor: '#52c41a' }
										) : (
											{ backgroundColor: '#FF4D4F' }
										)
									}
								>
									<p>{numero.numero}</p>
								</Badge>
							);
						})
					)}
				</div>
			)
		},
		{
			title: 'Estado',
			dataIndex: 'activo',
			key: 'activo',
			render: (estado) => (
				<div>{estado ? <Tag color="green">Activo</Tag> : <Tag color="processing">Pausado</Tag>}</div>
			)
		}
	];

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
            setVisible('d-none');
            notification.info({
                message: 'Escribe algo en el buscador',
                duration: 4
            });
		} else {
			setVisible('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}`)
				.then((res) => {
					setProductosRender(res.data.posts);
					setProductos(res.data.posts);
					setLoading(false);
				})
				.catch((res) => {
					if (res.response.status === 404 || res.response.status === 500 ) {
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

	const obtenerProductos = async (limit, page) => {
		setVisible('d-none');
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductosRender(res.data.posts.docs);
				setProductos(res.data.posts);
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
	};

	return (
		<Spin size="large" spinning={loading}>
			<Row justify="center">
				<Col>
					<Search
						placeholder="Busca un producto"
						onSearch={(value) => obtenerProductosFiltrados(value)}
						style={{ width: 350, height: 40, marginBottom: 10 }}
						enterButton="Buscar"
						size="large"
					/>
				</Col>
				<Col>
					<Button
						type="primary"
						size="large"
						className={visible}
						onClick={() => obtenerProductos(20, page)}
						icon={<RollbackOutlined style={{ fontSize: 24 }} />}
					>
						Volver
					</Button>
				</Col>
			</Row>
			<Table
				className="tabla-inventario"
				columns={columns}
				dataSource={productosRender}
				pagination={false}
				rowKey={(producto) => producto._id}
				scroll={{ x: 1200 }}
			/>
			<div className="mt-5">
				<Pagination blogs={productos} location={location} history={history} />
			</div>
		</Spin>
	);
}
export default withRouter(Inventario);
