import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import RegistrarProducto from './services/producto/registrar_producto';
import ActualizarProducto from './services/producto/actualizar_producto';
import { Card, Col, Row, Input, Button, Modal, Drawer, Result, notification } from 'antd';
import Spin from '../../components/Spin';
import Pagination from '../../components/Pagination/pagination';
import { StepsContext, StepsProvider } from '../admin/contexts/stepsContext';
import { IdProductoContext } from './contexts/ProductoContext';
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import queryString from 'query-string';

const { Search } = Input;
const { confirm } = Modal;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function RegistrarProductos(props) {
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ productoID, setProductoID ] = useState('');
	const [ disabled, setDisabled ] = useContext(StepsContext);
	const [ productos, setProductos ] = useState([]);
	const [ productosRender, setProductosRender ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const [ reload, setReload ] = useState(false);
	const token = localStorage.getItem('token');

	var decoded = Jwt(token);

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

	function drawnerClose() {
		setVisible(false);
		setReload(true);
	}
	function setActualizar() {
		setAccion(true);
		setVisible(true);
	}
	function setRegistrar() {
		setAccion(false);
		setVisible(true);
	}

	function closeConfirm() {
		confirm({
			title: 'Estás seguro de cerrar esta ventana?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				drawnerClose();
			}
		});
	}

	function showDeleteConfirm(idproducto) {
		confirm({
			title: 'Estas seguro de eliminar este articulo?',
			icon: <ExclamationCircleOutlined />,
			content: 'Este articulo sera borrado permanentemente',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			async onOk() {
				await clienteAxios
					.delete(`/productos/${idproducto}`, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						obtenerProductos(8, page);
						notification.success({
							message: res.data.message,
							duration: 2
						});
					})
					.catch((res) => {
						if (res.response.status === 404 || res.response.status === 500) {
							notification.error({
								message: 'Error',
								description: res.response.data.message,
								duration: 2
							});
						} else {
							notification.error({
								message: 'Error',
								description: 'Hubo un error',
								duration: 2
							});
						}
					});
			}
		});
	}

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoading(true);
		await clienteAxios
			.get(`/productos/search/${busqueda}`)
			.then((res) => {
				setProductosRender(res.data.posts);
				setProductos(res.data.posts);
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
	};

	const obtenerProductos = async (limit, page) => {
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductosRender(res.data.posts.docs);
				setProductos(res.data.posts);
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
	};

	useEffect(
		() => {
			obtenerProductos(8, page);
			setReload(false);
		},
		[ page, reload ]
	);

	const render = productosRender.map((productos) => (
		<Col span={32} key={productos.id}>
			<Card.Grid hoverable style={gridStyle}>
				<Card
					style={{ width: 300, maxHeight: 400 }}
					cover={
						<div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
							<img
								className="img-fluid"
								alt="producto"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
								style={{ maxHeight: '99%', maxWidth: '99%' }}
							/>
						</div>
					}
					actions={[
						<Button
							type="link"
							onClick={() => {
								setActualizar();
								setProductoID(productos._id);
							}}
							className="text-decoration-none"
						>
							<EditOutlined style={{ fontSize: 22 }} />Actualizar
						</Button>,

						<Button
							type="link"
							onClick={() => showDeleteConfirm(productos._id)}
							className="text-decoration-none"
						>
							<DeleteOutlined style={{ fontSize: 22 }} />Eliminar
						</Button>
					]}
				>
					<div style={{ height: 100 }}>
						<h1 className="h4">{productos.nombre}</h1>
						<h2 className="h5">{new Intl.NumberFormat('es-MX').format(productos.precio)}</h2>
					</div>
				</Card>
			</Card.Grid>
		</Col>
	));

	return (
		<div>
			<Drawer
				title={accion === true ? 'Actualizar un producto' : 'Registra un nuevo producto'}
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={closeConfirm}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={closeConfirm} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
				{accion === true ? (
					<IdProductoContext.Provider value={productoID}>
						<ActualizarProducto reloadProductos={[ reload, setReload ]} />
					</IdProductoContext.Provider>
				) : (
					<StepsProvider value={[ disabled, setDisabled ]}>
						<RegistrarProducto reloadProductos={[ reload, setReload ]} />
					</StepsProvider>
				)}
			</Drawer>
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
						className="ml-3 d-flex justify-content-center align-items-center"
						onClick={setRegistrar}
						icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
					>
						Registrar un producto
					</Button>
				</Col>
			</Row>

			<Row gutter={8} style={{ maxWidth: '90vw' }} className="mt-4 d-flex justify-content-center">
				{loading ? (
					<Spin />
				) : productos.length === 0 ? (
					<div className="w-100 d-flex justify-content-center align-items-center">
						<Result
							status="404"
							title="Articulo no encontrado"
							subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
						/>
					</div>
				) : loading ? (
					<Spin size="large" />
				) : (
					render
				)}
			</Row>
			<Pagination blogs={productos} location={location} history={history} />
		</div>
	);
}
export default withRouter(RegistrarProductos);
