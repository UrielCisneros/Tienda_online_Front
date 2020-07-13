import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import RegistrarProducto from './services/producto/registrar_producto';
import ActualizarProducto from './services/producto/actualizar_producto';
import { Card, Col, Row, Input, Spin, Button, Modal, Drawer, message } from 'antd';
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
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const token = localStorage.getItem('token');

	var decoded = Jwt(token) 
	
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

	const obtenerProductos = async () => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				setProductos(res.data.posts.docs);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		obtenerProductos();
	}, []);

	useEffect(
		() => {
			setProductosFiltrados(
				productos.filter((producto) => {
					return producto.nombre.toLowerCase().includes(search.toLowerCase());
				})
			);
		},
		[ search, productos ]
	);

	if (loading) {
		return <Spin size="large" />;
	}

	const render = productosFiltrados.map((productos) => (
		<Col span={32} key={productos.id}>
			<Card.Grid hoverable style={gridStyle}>
				<Card
					style={{ width: 300, maxHeight: 400 }}
					cover={
						<div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
							<img
								className="img-fluid"
								alt="producto"
								src={`http://localhost:4000/${productos.imagen}`}
								style={{ maxHeight: '99%', width: '99%' }}
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
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 300, height: 40, marginBottom: 10 }}
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

			<Row gutter={24} style={{ maxWidth: '90vw' }} className="mt-4">
				{render}
			</Row>
		</div>
	);
}
export default withRouter(RegistrarProductos);
