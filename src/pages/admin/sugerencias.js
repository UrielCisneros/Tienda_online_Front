import React, { useState, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { Col, Row, Input, Spin, Button, Drawer, message, Space, List } from 'antd';
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
	const [ search, setSearch ] = useState('');
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
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

	const obtenerProductos = async () => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				if (!res.data.err) {
					setProductos(res.data.posts.docs);
					setLoading(false);
				} else {
					message.error({
						content: res.data.message,
						duration: 2
					});
				}
			})
			.catch((err) => {
				console.log(err);
				message.error({
					content: 'Hubo un error',
					duration: 2
				});
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
		<List.Item
			actions={[
				<Space>
					<Button
						style={{ fontSize: 16}}
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
						onChange={(e) => setSearch(e.target.value)}
						style={{ minWidth: 300, width: 400, height: 40, marginBottom: 10 }}
					/>
				</Col>
			</Row>

			<div className="">
				<List>{render}</List>
			</div>

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
