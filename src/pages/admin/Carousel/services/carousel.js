import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Upload, Button, List, Avatar, Input, Space, Result, notification } from 'antd';
import Spin from '../../../../components/Spin';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import './carousel.scss';

const { Search } = Input;

function CarouselImages() {
	const token = localStorage.getItem('token');
	const [ imagen, setImagen ] = useState();
	const [ imagenPreview, setImagenPreview ] = useState('');
	const [ loadButton, setLoadButton ] = useState(false);
	//states de obtener producto y obtener todos los productos
	const [ producto, setProducto ] = useState([]);
	const [ productos, setProductos ] = useState([]);
	//modal para crear una imagen de carousel
	const [ loading, setLoading ] = useState(false);

	const formData = new FormData();

	useEffect(() => {
		obtenerTodosProductos();
	}, []);

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoading(true);
		clienteAxios
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

	/// OBTENER DATOS DE LA BASE DE DATOS
	const obtenerTodosProductos = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/productos/`)
			.then((res) => {
				setLoading(false);
				setProductos(res.data.posts.docs);
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

	const props = {
		beforeUpload: async (file) => {
			setImagen(file);
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function() {
				setImagenPreview(reader.result);
			};
		}
	};

	const crearCarousel = async () => {
		setLoadButton(true);
		formData.append('producto', producto._id);
		formData.append('imagen', imagen);
		await clienteAxios
			.post(`/carousel/nuevo/${producto._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoadButton(false);
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
				window.location.reload();
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

	const render = productos.map((productos) => (
		<List.Item
			actions={[
				<Button
					onClick={() => {
						setProducto(productos);
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

	return (
		<div>
			<div className="row d-sm-block d-lg-flex">
				<div className="col-12 col-lg-6">
					<p>Elige un producto y despues una imagen</p>
					<Search
						placeholder="Busca un producto"
						onSearch={(value) => obtenerProductosFiltrados(value)}
						style={{ width: 350, height: 40, marginBottom: 10 }}
						enterButton="Buscar"
						size="large"
					/>
					<div className="contenedor-lista">
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
							<List className="lista">{render}</List>
						)}
					</div>
				</div>
				<div className="col-12 col-lg-6">
					<h5>{producto.nombre}</h5>
					<div className="d-flex justify-content-center align-items-center my-4">
						<Space>
							<Upload {...props}>
								<Button type="primary" disabled={producto.length !== 0 ? false : true}>
									<UploadOutlined />Subir
								</Button>
							</Upload>
							<Button
								type="primary"
								loading={loadButton}
								onClick={() => {
									crearCarousel();
								}}
								disabled={imagenPreview !== '' ? false : true}
							>
								Crear
							</Button>
						</Space>
					</div>
					<div className="shadow imagen-preview-carousel d-flex justify-content-center align-items-center">
						{imagenPreview === '' ? (
							<PictureOutlined style={{ fontSize: 80 }} />
						) : (
							<img
								className="imagen"
								src={imagenPreview}
								alt="preview-imagen"
								style={{ maxWidth: '100%', maxHeight: '100%' }}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
export default CarouselImages;
