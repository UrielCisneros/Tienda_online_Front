import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { Button, Input, Space, message, Modal, List, Spin, Row, Col, Upload } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import CarouselImages from './services/carousel/carousel';

const { Search } = Input;

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
		const res = await clienteAxios.get(`/carousel/`);
		try {
			res.data.forEach((item) => setProductoCarousel(item.producto));
			setProductos(res.data);
			setLoading(false);
		} catch (err) {
			setLoading(false);
			message.error({
				content: 'Hubo un error al obtener productos',
				duration: 2
			});
		}
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
		const res = await clienteAxios.put(`/carousel/${producto}/`, formdata, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				if (!res.data.message) {
					obtenerCarouseles();
					setLoadButton(false);
					message.success({
						content: 'Imagen actualizada!',
						duration: 2
					});
				} else {
                    setLoadButton(false);
					message.error({
						content: res.data.message,
						duration: 2
					});
				}
			} else {
                setLoadButton(false);
				message.error({
					content: res.data.message,
					duration: 3
				});
			}
		} catch (error) {
            setLoadButton(false);
			message.error({
				content: 'Hubo un error',
				duration: 3
			});
		}
	};

	///ELIMINAR IMAGEN
	const eliminarImagen = async (productoID) => {
		const res = await clienteAxios.delete(`/carousel/${productoID}/`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerCarouseles();
				message.success({
					content: res.data.message,
					duration: 1
				});
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
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
							Actualizar Imagen
						</Button>
					</Upload>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						danger
						onClick={() => {
							eliminarImagen(productos.producto._id);
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

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div>
			<p>
				En esta sección puedes subir una imagen promocional de tu producto al carrusel principal en caso
				de que no existan promociones, si no existen promociones apareceran esta imagen
			</p>
			<Row justify="center mt-5">
				<Col>
					<Search
						placeholder="Busca un producto"
						onChange={(e) => setSearch(e.target.value)}
						style={{ width: 300, height: 40, marginBottom: 10 }}
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
			<List>{render}</List>

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
