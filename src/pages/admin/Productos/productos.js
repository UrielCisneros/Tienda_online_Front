import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import RegistrarProducto from './services/registrar_producto';
import ActualizarProducto from './services/actualizar_producto';
import { Card, Col, Row, Input, Button, Modal, Drawer, Result, notification, Spin } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
/* import { StepsContext, StepsProvider } from '../contexts/stepsContext'; */
import { IdProductoContext } from '../contexts/ProductoContext';
import {
	ExclamationCircleOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
	RollbackOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import queryString from 'query-string';
import './productos.scss';

const { Search } = Input;
const { confirm } = Modal;
const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return number.toString().replace(exp, rep);
	}
};

function RegistrarProductos(props) {
	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);

	const [ productoID, setProductoID ] = useState('');
	/* const [ disabled, setDisabled ] = useContext(StepsContext); */
	const [ disabled, setDisabled ] = useState(true);
	const [ productos, setProductos ] = useState([]);
	const [ productosRender, setProductosRender ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const [ reload, setReload ] = useState(false);
	const token = localStorage.getItem('token');
	const [ reloadData, setReloadData ] = useState(false);
	const [ visibleButton, setVisibleButton ] = useState('d-none');

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

	const eventoCloseConfirm = () => {
		if (accion) {
			drawnerClose();
		} else {
			closeConfirm();
		}
	};

	function showDeleteConfirm(idproducto) {
		confirm({
			title: 'Estas seguro de eliminar este articulo?',
			icon: <ExclamationCircleOutlined />,
			content: 'Este articulo sera borrado permanentemente',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			async onOk() {
				setLoading(true);
				await clienteAxios
					.delete(`/productos/${idproducto}`, {
						headers: {
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setLoading(false);
						obtenerProductos(20, page);
						notification.success({
							message: res.data.message,
							duration: 2
						});
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
		});
	}

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisibleButton('d-none');
			notification.info({
				message: 'Escribe algo en el buscador',
				duration: 4
			});
		} else {
			setVisibleButton('ml-3 d-flex justify-content-center align-items-center');
			setLoading(true);
			await clienteAxios
				.get(`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subCategoria=${busqueda}&genero=${busqueda}`)
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
		}
	};

	const obtenerProductos = async (limit, page) => {
		setReloadData(false);
		setVisibleButton('d-none');
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
			obtenerProductos(20, page);
			setReload(false);
		},
		[ page, reload, reloadData ]
	);


	const render = productosRender.map((productos) => (
		<Col span={32} key={productos._id}>
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
					<div className="contenedor-titulos-productos">
						<h1 className="titulo-producto">{productos.nombre}</h1>
						<h2 className="h5">$ {formatoMexico(productos.precio)}</h2>
					</div>
				</Card>
			</Card.Grid>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<Drawer
				forceRender
				title={accion === true ? 'Actualizar un producto' : 'Registra un nuevo producto'}
				width={window.screen.width > 768 ? 1000 : window.screen.width}
				placement={'right'}
				onClose={eventoCloseConfirm}
				visible={visible}
				bodyStyle={{ paddingBottom: 80 }}
				footer={
					<div
						style={{
							textAlign: 'right'
						}}
					>
						<Button onClick={eventoCloseConfirm} type="primary">
							Cerrar
						</Button>
					</div>
				}
			>
				{accion === true ? (
					<IdProductoContext.Provider value={productoID}>
						<ActualizarProducto reloadProductos={reload} />
					</IdProductoContext.Provider>
				) : (
					<RegistrarProducto reloadProductos={reload} disabledButtons={[ disabled, setDisabled ]} />
					/* <StepsProvider value={[ disabled, setDisabled ]}>
						<RegistrarProducto reloadProductos={reload} disabledButtons={[ disabled, setDisabled ]} />
					</StepsProvider> */
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
							className={visibleButton}
							onClick={() => {
								obtenerProductos(20, page);
							}}
							icon={<RollbackOutlined style={{ fontSize: 24 }} />}
						>
						Volver
					</Button>
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
				{productos.length === 0 ? (
					<div className="w-100 d-flex justify-content-center align-items-center">
						<Result
							status="404"
							title="Articulo no encontrado"
							subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
						/>
					</div>
				) : (
					render
				)}
			</Row>
			<Pagination blogs={productos} location={location} history={history} />
		</Spin>
	);
}
export default withRouter(RegistrarProductos);
