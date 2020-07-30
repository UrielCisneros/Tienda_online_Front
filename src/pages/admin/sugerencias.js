import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { Col, Row, Input, Button, Drawer, notification, Space, List, Result } from 'antd';
import Spin from '../../components/Spin';
import { IdProductoContext } from './contexts/ProductoContext';
import jwt_decode from 'jwt-decode';
import Sugerencia from './services/sugerencias/sugerencia';

const { Search } = Input;

function Sugerencias(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	const [ productoID, setProductoID ] = useState('');
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);

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
	function drawnerOpen() {
		setVisible(true);
	}

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoading(true);
		await clienteAxios
			.get(`/productos/search/${busqueda}`)
			.then((res) => {
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

	const obtenerProductos = async () => {
		setLoading(true);
		await clienteAxios
			.get('/productos')
			.then((res) => {
				setProductos(res.data.posts.docs);
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

	useEffect(() => {
		obtenerProductos();
	}, []);

	const render = productos.map((productos) => (
		<List.Item
			className="d-flex justify-content-center align-items-center mt-3"
			actions={[
				<Space>
					<Button
						className="mt-3"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
							drawnerOpen();
							setProductoID(productos._id);
						}}
					>
						Ver / Crear Sugerencia
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
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
						/>
					</div>
				}
				title={
					<div className="mt-4 titulo-producto">
						<h1 className="h5">{productos.nombre}</h1>
					</div>
				}
			/>
		</List.Item>
	));

	return (
		<div>
			<p style={{ fontSize: 20 }}>En este apartado puedes agregar sugerencias de otro producto a un producto</p>
			<Row justify="center mt-5">
				<Col>
					<Search
						placeholder="Busca un producto"
						onSearch={(value) => obtenerProductosFiltrados(value)}
						style={{ width: 300, height: 40, marginBottom: 10 }}
						enterButton="Buscar"
						size="large"
					/>
				</Col>
			</Row>
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
			) : (
				<List>{render}</List>
			)}
			<Drawer
				title={'Sugerencias'}
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
				<IdProductoContext.Provider value={productoID}>
					<Sugerencia />
				</IdProductoContext.Provider>
			</Drawer>
		</div>
	);
}
export default withRouter(Sugerencias);
