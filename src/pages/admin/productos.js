import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import RegistrarProducto from './services/producto/registrar_producto';
import ActualizarProducto from './services/producto/actualizar_producto';
import { Card, Col, Row, Input, Spin, Button, Modal, Drawer, message, Result } from 'antd';
import { StepsContext, StepsProvider } from '../admin/contexts/stepsContext';
import { IdProductoContext } from './contexts/ProductoContext';
import { ExclamationCircleOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';

const { Search } = Input;
const { confirm } = Modal;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function RegistrarProductos(props) {
	const [ productoID, setProductoID ] = useState('');
	const [ disabled, setDisabled ] = useContext(StepsContext);
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
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
	}
	function setActualizar() {
		setAccion(true);
		setVisible(true);
	}
	function setRegistrar() {
		setAccion(false);
		setVisible(true);
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
				const respuesta = await clienteAxios.delete(`/productos/${idproducto}`, {
					headers: {
						Authorization: `bearer ${token}`
					}
				});
				try {
					if (!respuesta.data.err) {
						obtenerProductos();
						message.success({
							content: respuesta.data.message,
							duration: 3
						});
					} else {
						message.error({
							content: respuesta.data.message,
							duration: 3
						});
					}
				} catch (error) {
					message.error({
						content: 'Hubo un error',
						duration: 3
					});
				}
			}
		});
	}

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoading(true);
		clienteAxios
			.get(`/productos/search/${busqueda}`)
			.then((res) => {
				if (!res.data.err) {
					setProductos(res.data.posts);
					setLoading(false);
				} else {
					setLoading(false);
					message.error({
						content: res.data.message,
						duration: 2
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				message.error({
					content: 'hubo un error',
					duration: 2
				});
			});
	};

	const obtenerProductos = async () => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				if (!res.data.err) {
					setProductos(res.data.posts.docs);
					setLoading(false);
				} else {
					setLoading(false);
					message.error({
						content: res.data.message,
						duration: 2
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				message.error({
					content: 'hubo un error',
					duration: 2
				});
			});
	};

	useEffect(() => {
		obtenerProductos();
	}, []);

	const render = productos.map((productos) => (
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
						<h2 className="h5">{new Intl.NumberFormat().format(productos.precio)}</h2>
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
				onClose={drawnerClose}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={drawnerClose} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
				{accion === true ? (
					<IdProductoContext.Provider value={productoID}>
						<ActualizarProducto />
					</IdProductoContext.Provider>
				) : (
					<StepsProvider value={[ disabled, setDisabled ]}>
						<RegistrarProducto />
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

			<Row gutter={8} style={{ maxWidth: '90vw' }} className="mt-4">
				{loading ?  <Spin size="large" /> : 
				productos.length === 0 ? (
					<div className="w-100 d-flex justify-content-center align-items-center">
						<Result
						status="404"
						title="Articulo no encontrado"
						subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
					/>
					</div>
				) : (
					loading ? <Spin size="large" /> : render
				)
				}

			</Row>
		</div>
	);
}
export default withRouter(RegistrarProductos);
