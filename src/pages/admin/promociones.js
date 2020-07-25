import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import jwt_decode from 'jwt-decode';
import { Button, Spin, Col, Row, Input, Drawer, Space, Tooltip, Popconfirm, message, List } from 'antd';
import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import RegistrarPromocion from './services/promociones/registrar_promocion';
import ActualizarPromocion from './services/promociones/actualizar_promocion';
import { IdProductoContext } from './contexts/ProductoContext';
import './promociones.scss';

const { Search } = Input;

function Promociones(props) {
	const token = localStorage.getItem('token');
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ accion, setAccion ] = useState(false);
	const [ productoID, setProductoID ] = useState('');
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

	const obtenerProductos = async () => {
		setLoading(true);
		clienteAxios
			.get('/productos/promocion')
			.then((res) => {
				if (!res.data.err) {
					setProductos(res.data);
					setLoading(false);
				} else {
					message.error({
						content: res.data.message,
						duration: 2
					});
				}
			})
			.catch((err) => {
				message.error({
					content: 'Hubo un error',
					duration: 2
				});
			});
	};

	async function eliminarPromocion(idProducto) {
		const res = await clienteAxios.delete(`/productos/promocion/${idProducto}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: res.data.message,
					duration: 2
				});
				obtenerProductos();
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	}

	useEffect(() => {
		obtenerProductos();
	}, []);

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

	if (loading) {
		return <Spin size="large" />;
	}

	const render = productosFiltrados.map((productos) => (
		<List.Item
			actions={[
				<Space size="large">
					<Tooltip title="Actualizar" key={productos._id}>
						<Button
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 16}}
							type="primary"
							onClick={() => {
								setActualizar();
								setProductoID(productos._id);
							}}
						>
							<EditOutlined />
							Actualizar Promoción
						</Button>
					</Tooltip>
					<Tooltip title="Eliminar" key={productos._id}>
						<Popconfirm
							title="Estas seguro de eliminar?"
							onConfirm={() => {
								eliminarPromocion(productos._id);
							}}
							okText="Si"
							cancelText="No"
						>
							<Button
								className="d-flex justify-content-center align-items-center"
								danger
								style={{ fontSize: 16 }}
							>
								<DeleteOutlined />
								Eliminar Promoción
							</Button>
						</Popconfirm>
					</Tooltip>
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
						<h2 className="h4 precio-producto d-inline mr-2">
							$ {new Intl.NumberFormat().format(productos.productoPromocion.precio)}
						</h2>
						<h2 className="h4 precio-rebaja d-inline mr-2">
							$ {new Intl.NumberFormat().format(productos.precioPromocion)}
						</h2>
					</div>
				}
			/>
		</List.Item>
	));
	return (
		<div>
			<p style={{ fontSize: 20 }}>
				En este apartado puedes agregar ofertas especiales a tu producto y aparecer en la pagina principal
			</p>
			<Row justify="center mt-5">
				<Col>
					<Search
						placeholder="Busca un producto"
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 350, height: 40, marginBottom: 10 }}
					/>
				</Col>
				<Col>
					<Button
						type="primary"
						size="large"
						className="ml-3 mb-3 d-flex justify-content-center align-items-center"
						onClick={setRegistrar}
						icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
					>
						Crear nueva promocion
					</Button>
				</Col>
			</Row>
			<div>
				<List>{render}</List>
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
							<Button onClick={drawnerClose}>Cancelar</Button>
							<Button
								onClick={() => {
									window.location.reload();
								}}
								type="primary"
							>
								Listo
							</Button>
						</Space>
					</div>
				}
			>
				{accion === true ? (
					<IdProductoContext.Provider value={productoID}>
						<ActualizarPromocion />
					</IdProductoContext.Provider>
				) : (
					<RegistrarPromocion />
				)}
			</Drawer>
		</div>
	);
}
export default withRouter(Promociones);
