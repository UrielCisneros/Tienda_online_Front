import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, notification, Modal, List, Avatar, Card, Result } from 'antd';
import Spin from '../../../../components/Spin';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './sugerencia.scss';

const { Search } = Input;
const { Meta } = Card;

const Sugerencia = () => {
	const [ loadingPrincipal, setLoadingPrincipal ] = useState(false);
	const productoContext = useContext(IdProductoContext);
	//states de obtener producto y obtener todos los productos
	const [ producto, setProducto ] = useState([]);
	const [ productos, setProductos ] = useState([]);
	//states de obtener productos sugeridos de base, crear producto sugerido y para mapear el producto sugerido
	const [ sugerencia, setSugerencia ] = useState([]);
	const [ productoSugerido, setProductoSugerido ] = useState([]);
	//modal para crear un producto sugerido
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ loading, setLoading ] = useState(false);

	///state para saber si va a actualizar o registrar
	const [ actualizar, setActualizar ] = useState(false);
	//token
	const token = localStorage.getItem('token');

	useEffect(
		() => {
			obtenerProducto();
			obtenerTodosProductos();
			obtenerSugerencia();
		},
		[ productoContext ]
	);

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoadingPrincipal(true);
		await clienteAxios
			.get(`/productos/search/${busqueda}`)
			.then((res) => {
				setProductos(res.data.posts);
				setLoadingPrincipal(false);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoadingPrincipal(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoadingPrincipal(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};
	///*** OBTENER DATOS DE LA BASE DE DATOS
	const obtenerTodosProductos = async () => {
		setLoadingPrincipal(true);
		await clienteAxios
			.get(`/productos/`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setLoadingPrincipal(false);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoadingPrincipal(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoadingPrincipal(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	const obtenerProducto = async () => {
		await clienteAxios
			.get(`/productos/${productoContext}`)
			.then((res) => {
				setProducto(res.data);
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
	};

	const obtenerSugerencia = async () => {
		setLoadingPrincipal(true);
		await clienteAxios
			.get(`/sugerencia/${productoContext}`)
			.then((res) => {
				res.data.sugerencias.forEach((item) => setSugerencia(item.producto));
				setLoadingPrincipal(false);
				console.log(res)
			})
			.catch((res) => {
				if (res.response.status === 404) {
					setLoadingPrincipal(false);
					setSugerencia('No hay sugerencia')
				} else if (res.response.status === 500) {
					setLoadingPrincipal(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoadingPrincipal(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};
	///// CREAR, ACTUALIZAR Y ELIMINAR SUGERENCIAS DE LA BASE DE DATOS
	const crearSugerencia = async () => {
		setLoading(true);
		const datos = {
			producto: productoContext,
			sugerencias: [
				{
					producto: productoSugerido
				}
			]
		};
		await clienteAxios
			.post(`/sugerencia/nueva/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setModalVisible(false);
				obtenerSugerencia();
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
	};

	const actualizarSugerencia = async () => {
		setLoading(true);
		const datos = {
			producto: productoContext,
			sugerencias: [
				{
					producto: productoSugerido
				}
			]
		};
		await clienteAxios
			.put(`/sugerencia/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setModalVisible(false);
				obtenerSugerencia();
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
	};

	const eliminarSugerencia = async () => {
		await clienteAxios
			.delete(`/sugerencia/${productoContext}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerSugerencia();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
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
	};

	/////MODAL
	const showModal = (accion) => {
		if (accion === 'actualizar') {
			setModalVisible(true);
			setActualizar(true);
		} else {
			setModalVisible(true);
		}
	};
	const handleCancel = () => {
		setModalVisible(false);
	};

	const render = productos.map((productos) => (
		<List.Item
			actions={[
				<Button
					onClick={() => {
						setProductoSugerido(productos);
					}}
				>
					Seleccionar
				</Button>
			]}
		>
			<List.Item.Meta
				avatar={
					<Avatar src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`} />
				}
				title={productos.nombre}
			/>
		</List.Item>
	));

	if (loadingPrincipal) {
		return <Spin />;
	}

	return (
		<div>
			<Modal
				title="Sugerencias de producto"
				visible={modalVisible}
				footer={[
					<Button key="back" onClick={handleCancel}>
						Salir
					</Button>,
					actualizar === false ? (
						<Button key="crear" type="primary" loading={loading} onClick={crearSugerencia}>
							Crear
						</Button>
					) : (
						<Button key="crear" type="primary" loading={loading} onClick={actualizarSugerencia}>
							Actualizar
						</Button>
					)
				]}
			>
				<p>Elige un producto que quieres sugerir</p>
				<Search
					placeholder="Busca un producto"
					onSearch={(value) => obtenerProductosFiltrados(value)}
					style={{ width: 350, height: 40, marginBottom: 10 }}
					enterButton="Buscar"
					size="large"
				/>
				{loadingPrincipal ? (
					<Spin />
				) : productos.length === 0 ? (
					<div className="w-100 d-flex justify-content-center align-items-center">
						<Result
							status="404"
							title="Articulo no encontrado"
							subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
						/>
					</div>
				) : loadingPrincipal ? (
					<Spin size="large" />
				) : (
					<List className="contenedor-lista">{render}</List>
				)}
			</Modal>
			<div>
				<p className="text-center" style={{ fontSize: 20 }}>
					En esta sección puedes agregar una de otro producto a tu producto
				</p>
				{sugerencia === 'No hay sugerencia' ? (
					<p className="text-center" style={{ fontSize: 18 }}>
						En este momento no tienes sugerencia para tu producto
					</p>
				) : (
					<p />
				)}
			</div>

			{sugerencia === 'No hay sugerencia' ? (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Button onClick={showModal}>Nueva sugerencia</Button>
				</div>
			) : (
				<div className="d-flex justify-content-center align-items-center mt-3">
					<Space>
						<Button
							onClick={() => {
								showModal('actualizar');
							}}
						>
							Actualizar sugerencia
						</Button>
						<Button onClick={eliminarSugerencia}>Quitar sugerencia</Button>
					</Space>
				</div>
			)}
			<div className="d-lg-flex d-sm-block justify-content-center mt-4">
				<Card
					className="shadow"
					style={{ width: 300 }}
					cover={
						<div class="contenedor-imagen-sugerencia">
							<img
								className="imagen-producto-sugerencia"
								alt="producto actual"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
							/>
						</div>
					}
				>
					<Meta title={producto.nombre} />
				</Card>
				<div className="contenedor-span d-flex justify-content-center align-items-center">
					<span>+</span>
				</div>
				{sugerencia === 'No hay sugerencia' ? (
					<div />
				) : (
					<Card
						className="shadow"
						style={{ width: 300 }}
						cover={
							<div class="contenedor-imagen-sugerencia">
								<img
									className="imagen-producto-sugerencia"
									alt="producto sugerido"
									src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${sugerencia.imagen}`}
								/>
							</div>
						}
					>
						<Meta title={sugerencia.nombre} />
					</Card>
				)}
			</div>
		</div>
	);
};

export default Sugerencia;
