import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, Upload, List, Spin, Avatar, message, Result } from 'antd';
import './registrar_promocion.scss';

const { Search } = Input;

const RegistrarPromocion = () => {
	const token = localStorage.getItem('token');
	const [ content, setContent ] = useState(false);
	const [ loadingButton, setLoadingButton ] = useState(false);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	const [ disabled, setDisabled ] = useState(true);
	const [ imagen, setImagen ] = useState([]);
	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();

	useEffect(() => {
		obtenerProductos();
	}, []);

	const props = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			subirImagen(formDataImagen);
		}
	};

	const obtenerCampo = (e) => {
		setPrecioPromocion(e.target.value);
	};

	const subirImagen = async (formDataImagen) => {
		setLoadingButton(true);
		const res = await clienteAxios.put(`/productos/promocion/${promocion._id}`, formDataImagen, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: 'imagen guardada',
					duration: 2
				});
				setImagen(res.data.promocionBase.imagenPromocion);
				setLoadingButton(false);
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			message.error({
				content: 'hubo un error',
				duration: 2
			});
		}
	};

	const subirPromocion = async () => {
		const formData = new FormData();
		formData.append('productoPromocion', producto._id);
		formData.append('precioPromocion', precioPromocion);
		const res = await clienteAxios.post(`/productos/promocion/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: res.data.message,
					duration: 2
				});
				setPromocion(res.data.userStored);
				setDisabled(false);
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
	};

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoading(true);
		clienteAxios
			.get(`/productos/search/${busqueda}`)
			.then((res) => {
				if (!res.data.err) {
					setProductos(res.data.posts);
					setLoading(false);
				} else {
					setLoading(false);
					message.error({
						content: res.data.message,
						duration: 2
					});
				}
			})
			.catch((err) => {
				setLoading(false);
				message.error({
					content: 'hubo un error',
					duration: 2
				});
			});
	};

	const obtenerProductos = async () => {
		setLoading(true);
		clienteAxios
			.get('/productos')
			.then((res) => {
				setProductos(res.data.posts.docs);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				message.error({
					content: 'Hubo un error al obtener productos',
					duration: 2
				});
			});
	};

	const render = productos.map((productos) => (
		<List.Item
			actions={[
				<Button
					onClick={() => {
						setProducto(productos);
						setContent(true);
					}}
				>
					Seleccionar
				</Button>
			]}
		>
			<List.Item.Meta
				avatar={
					<Avatar
						size={40}
						src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
					/>
				}
				title={productos.nombre}
			/>
		</List.Item>
	));

	return (
		<div>
			<div className="d-lg-flex d-sm-block mt-4">
				<div className="col-12 col-lg-6">
					<Search
						placeholder="Busca un producto"
						onSearch={(value) => obtenerProductosFiltrados(value)}
						style={{ width: 350, height: 40, marginBottom: 10 }}
						enterButton="Buscar"
						size="large"
					/>
					{loading ? (
						<Spin size="large" />
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
				</div>
				{content === false ? (
					<div className="col-12 col-lg-6 d-flex justify-content-center mt-5">
						<h5>Selecciona un producto</h5>
					</div>
				) : (
					<div className="col-12 col-lg-6">
						<div className="shadow">
							<div className="imagen-box shadow-sm">
								<img
									className="img-producto"
									alt="img-producto"
									src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
								/>
							</div>
							<div className="titulo-box">
								<h2>{producto.nombre}</h2>
							</div>
							<div className="precio-box">
								{promocion.length !== 0 ? (
									<div>
										<h3 className="precio-producto d-inline mr-2">
											${new Intl.NumberFormat().format(producto.precio)}
										</h3>
										<h3 className="precio-rebaja d-inline mr-2">
											${new Intl.NumberFormat().format(promocion.precioPromocion)}
										</h3>
									</div>
								) : (
									<h3 className="precio-rebaja d-inline mr-2">
										${new Intl.NumberFormat().format(producto.precio)}
									</h3>
								)}
							</div>
						</div>
						<div className="mt-4">
							<div className="d-flex justify-content-center mb-2">
								<Space>
									<Input type="number" label="Precio" onChange={obtenerCampo} />
									<Button onClick={subirPromocion}>Guardar promoción</Button>
								</Space>
							</div>
							<div className="mt-4 row">
								<p className="mt-2 texto-imagen">
									Sube una imagen para la promocion, esta imagen aparecera en el carrucel de
									promociones
								</p>
								<Upload {...props} className="d-flex justify-content-center mt-3 mr-3">
									<Button loading={loadingButton} disabled={disabled}>
										Subir
									</Button>
								</Upload>
								{imagen.length !== 0 ? (
									<div className="imagen-box-promocion shadow-sm border">
										<img
											className="img-producto-promocion"
											alt="img-producto"
											src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${imagen}`}
										/>
									</div>
								) : (
									<div />
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default RegistrarPromocion;
