import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../config/axios';
import { Button, Input, Space, Modal, List, Row, Col, Upload, Result, notification } from 'antd';
import Spin from '../../../components/Spin';
import {
	EyeOutlined,
	EditOutlined,
	DeleteOutlined,
	PlusCircleOutlined,
	ExclamationCircleOutlined
} from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import CarouselImages from './services/carousel';

const { Search } = Input;
const { confirm } = Modal;

function Carousel(props) {
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	const [ prodcutoCarousel, setProductoCarousel ] = useState([]);
	const [ producto, setProducto ] = useState([]);
	const [ productos, setProductos ] = useState([]);
	const [ search, setSearch ] = useState('');
	const [ loading, setLoading ] = useState(true);
	const [ loadButton, setLoadButton ] = useState(false);
	const [ productosFiltrados, setProductosFiltrados ] = useState([]);
	const [ modalVisible, setModalVisible ] = useState(false);
	const [ modalCrearVisible, setModalCrearVisible ] = useState(false);

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

	useEffect(() => {
		obtenerCarouseles();
	}, []);

	useEffect(
		() => {
			setProductosFiltrados(
				productos.filter((producto) => {
					return producto.producto.nombre.toLowerCase().includes(search.toLowerCase());
				})
			);
		},
		[ search, productos ]
	);

	///*** OBTENER DATOS DE LA BASE DE DATOS
	const obtenerCarouseles = async () => {
		await clienteAxios
			.get(`/carousel/`)
			.then((res) => {
				res.data.forEach((item) => setProductoCarousel(item.producto));
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

	///ACTUALIZAR IMAGEN
	const propsActualizar = {
		beforeUpload: async (file) => {
			const formData = new FormData();
			formData.append('imagen', file);
			await actualizarImagen(formData);
		}
	};

	const actualizarImagen = async (formdata) => {
		setLoadButton(true);
		await clienteAxios
			.put(`/carousel/${producto}/`, formdata, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerCarouseles();
				setLoadButton(false);
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoadButton(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoadButton(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	///ELIMINAR IMAGEN
	const eliminarImagen = async (productoID) => {
		await clienteAxios
			.delete(`/carousel/${productoID}/`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerCarouseles();
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

	const showModal = () => {
		setModalVisible(true);
	};
	const closeModal = () => {
		setModalVisible(false);
	};

	function closeModalCrear() {
		setModalCrearVisible(false);
	}
	function showModalCrear() {
		setModalCrearVisible(true);
	}

	function showDeleteConfirm(productoID) {
		confirm({
			title: 'estas seguro de eliminar esto?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				eliminarImagen(productoID);
			},
			onCancel() {
				console.log('Cancel');
			}
		});
	}

	const render = productosFiltrados.map((productos) => (
		<List.Item
			actions={[
				<Space>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
							setProducto(productos);
							showModal();
						}}
					>
						<EyeOutlined />
						Ver
					</Button>
					<Upload {...propsActualizar} className="d-inline">
						<Button
							className="d-flex justify-content-center align-items-center"
							style={{ fontSize: 16 }}
							type="primary"
							loading={loadButton}
							onClick={() => {
								setProducto(productos.producto._id);
							}}
						>
							<EditOutlined />
							Actualizar
						</Button>
					</Upload>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						danger
						onClick={() => {
							showDeleteConfirm(productos.producto._id);
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
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
						/>
					</div>
				}
				title={
					<div className="mt-4 titulo-producto">
						<h1 className="h5">{productos.producto.nombre}</h1>
					</div>
				}
			/>
		</List.Item>
	));

	return (
		<div>
			<p>
				En esta sección puedes subir una imagen promocional de tu producto al carrusel principal en caso de que
				no existan promociones, si no existen promociones apareceran esta imagen
			</p>
			<Row justify="center mt-5">
				<Col>
					<Search
						placeholder="Busca un producto"
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 350, height: 40, marginBottom: 10 }}
						size="large"
						enterButton="Buscar"
					/>
				</Col>
				<Col>
					<Button
						onClick={showModalCrear}
						type="primary"
						size="large"
						className="ml-3 mb-3 d-flex justify-content-center align-items-center"
						icon={<PlusCircleOutlined style={{ fontSize: 24 }} />}
					>
						Crear nueva promocion
					</Button>
				</Col>
			</Row>
			{loading ? (
				<Spin />
			) : productosFiltrados.length === 0 ? (
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
			<Modal
				title={prodcutoCarousel.nombre}
				visible={modalVisible}
				onCancel={closeModal}
				footer={false}
				width={1200}
				style={{ top: 20 }}
			>
				<img
					style={{ maxWidth: '100%', maxHeight: '100%' }}
					alt="imagen-promocion-modal"
					src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
				/>
			</Modal>

			<Modal
				title="Crear nueva promocion para el Carousel"
				visible={modalCrearVisible}
				onCancel={closeModalCrear}
				footer={false}
				centered
				width={800}
				style={{ top: 20 }}
			>
				<CarouselImages />
			</Modal>
		</div>
	);
}
export default withRouter(Carousel);
