import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { Button, Col, Row, Input, Drawer, Space, Modal, notification, List, Result, Spin } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import RegistrarPromocion from './services/registrar_promocion';
import ActualizarPromocion from './services/actualizar_promocion';
import { IdProductoContext } from '../contexts/ProductoContext';
import './promociones.scss';

const { Search } = Input;
const { confirm } = Modal;

const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return number.toString().replace(exp, rep);
	}
};

function Promociones(props) {
	const token = localStorage.getItem('token');
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const [ productoID, setProductoID ] = useState('');
	const [ reload, setReload ] = useState(false);
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

	useEffect(
		() => {
			obtenerProductos();
			setReload(false);
		},
		[ reload ]
	);

	useEffect(
		() => {
			setProductosFiltrados(
				productos.filter((producto) => {
					return producto.productoPromocion.nombre.toLowerCase().includes(search.toLowerCase());
				})
			);
		},
		[ search, productos ]
	);

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
	function agregarPorcentaje(precio_descuento, precio_producto) {
		var porcentaje = Math.round(precio_descuento / precio_producto * 100);
		var descuento = 100 - porcentaje;
		return descuento;
	}

	const obtenerProductos = async () => {
		setLoading(true);
		await clienteAxios
			.get('/productos/promocion')
			.then((res) => {
				setProductos(res.data);
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

	async function eliminarPromocion(idProducto) {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/promocion/${idProducto}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerProductos();
				setLoading(false);
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
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

	function showDeleteConfirm(productoID) {
		confirm({
			title: 'estas seguro de eliminar esto?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarPromocion(productoID);
			}
		});
	}

	const render = productosFiltrados.map((productos) => (
		<List.Item
			key={productos._id}
			className="d-flex justify-content-center align-items-center"
			actions={[
				<Space>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
							setActualizar();
							setProductoID(productos._id);
						}}
					>
						<EditOutlined />
						Actualizar
					</Button>

					<Button
						className="d-flex justify-content-center align-items-center"
						danger
						style={{ fontSize: 16 }}
						onClick={() => {
							showDeleteConfirm(productos._id);
						}}
					>
						<DeleteOutlined />
						Eliminar
					</Button>
				</Space>
			]}
		>
			<List.Item.Meta
				avatar={
					<div
						className="d-flex justify-content-center align-items-center mr-2"
						style={{ width: 100, height: 100 }}
					>
						<img
							className="imagen-promocion-principal"
							alt="producto"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos
								.productoPromocion.imagen}`}
						/>
					</div>
				}
				title={
					<div className="mt-4 titulo-producto">
						<h1 className="h5">{productos.productoPromocion.nombre}</h1>
						<p className="h4 precio-producto d-inline mr-2">
							$ {formatoMexico(productos.productoPromocion.precio)}
						</p>
						<p className="h4 precio-rebaja d-inline mr-2">$ {formatoMexico(productos.precioPromocion)}</p>
						<p className="h4 porcentaje-descuento d-inline mr-2">
							{agregarPorcentaje(productos.precioPromocion, productos.productoPromocion.precio)}%OFF
						</p>
					</div>
				}
			/>
		</List.Item>
	));
	return (
		<Spin size="large" spinning={loading}>
			<div>
				<p style={{ fontSize: 20 }}>
					En este apartado puedes agregar ofertas especiales a tu producto y aparecer en la pagina principal
				</p>
				<Row justify="center mt-5">
					<div >
						<Search
							placeholder="Busca un producto"
							onChange={(e) => setSearch(e.target.value)}
							style={{ width: 350, height: 40, marginBottom: 10 }}
							size="large"
							enterButton="Buscar"
						/>
					</div>
					<div>
						<Button
							type="primary"
							size="large"
							className="ml-3 mb-3 d-flex justify-content-center align-items-center"
							onClick={setRegistrar}
							icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
						>
							Crear nueva promocion
						</Button>
					</div>
				</Row>
				<div>
					{productos.length === 0 || productosFiltrados.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result
								status="404"
								title="Articulo no encontrado"
								subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
							/>
						</div>
					) : (
						<List>{render}</List>
					)}
				</div>

				<Drawer
					title={accion === true ? 'Actualizar promocion' : 'Registrar nueva promocion'}
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
							<Space>
								<Button type="primary" onClick={drawnerClose}>
									Cerrar
								</Button>
							</Space>
						</div>
					}
				>
					{accion === true ? (
						<IdProductoContext.Provider value={productoID}>
							<ActualizarPromocion reload={reload} />
						</IdProductoContext.Provider>
					) : (
						<RegistrarPromocion reload={reload} />
					)}
				</Drawer>
			</div>
		</Spin>
	);
}
export default withRouter(Promociones);
