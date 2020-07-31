import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, Upload, List, Avatar, notification, Result, Spin } from 'antd';

import './registrar_promocion.scss';
import InfiniteScroll from 'react-infinite-scroller';

const { Search } = Input;
const demo = { height: '500px', overflow: 'auto' };

const RegistrarPromocion = () => {
	const token = localStorage.getItem('token');
	const [ content, setContent ] = useState(false);
	const [ loadingButton, setLoadingButton ] = useState(false);

	const [ data, setData ] = useState([]);
	const [ hasMore, setHasMore ] = useState(true);
	const [ page, setPage ] = useState(1);
	const [ totalDocs, setTotalDocs ] = useState();

	const [ loading, setLoading ] = useState(false);
	const [ disabled, setDisabled ] = useState(true);
	const [ imagen, setImagen ] = useState([]);
	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();

	useEffect(() => {
		fetchData((res) => {
			setData(res.data.posts.docs);
			setTotalDocs(res.data.posts.totalDocs);
			setPage(res.data.posts.page + 1);
		});
	}, []);

	const fetchData = (callback) => {
		clienteAxios.get(`/productos?limit=${8}&page=${page}`).then((res) => {
			callback(res);
		});
	};

	const handleInfiniteOnLoad = () => {
		setLoading(true);
		if (data.length === totalDocs) {
			setLoading(false);
			setHasMore(false);
			return;
		}
		fetchData((res) => {
			setData(data.concat(res.data.posts.docs));
			setLoading(false);
		});
	};

	const propsUpload = {
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
		await clienteAxios.put(`/productos/promocion/${promocion._id}`, formDataImagen, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		}).then((res) => {
			setImagen(res.data.promocionBase.imagenPromocion);
			setLoadingButton(false);
			notification.success({
				message: 'Hecho!',
				description: res.data.message,
				duration: 2
			});
		}).catch((res) => {
			if (res.response.status === 404 || res.response.status === 500) {
				setLoadingButton(false);
				notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				setLoadingButton(false);
				notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
	};

	const subirPromocion = async () => {
		const formData = new FormData();
		formData.append('productoPromocion', producto._id);
		formData.append('precioPromocion', precioPromocion);
		await clienteAxios.post(`/productos/promocion/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		}).then((res) => {
			setPromocion(res.data.userStored);
			setDisabled(false);
			notification.success({
				message: 'Hecho!',
				description: res.data.message,
				duration: 2
			});
		}).catch((res) => {
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

	const obtenerProductosFiltrados = async (busqueda) => {
		setLoading(true);
		await clienteAxios
			.get(`/productos/search/${busqueda}`)
			.then((res) => {
				setData(res.data.posts);
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
						<div />
					) : data.length === 0 ? (
						<div className="w-100 d-flex justify-content-center align-items-center">
							<Result
								status="404"
								title="Articulo no encontrado"
								subTitle="Lo sentimo no pudimos encontrar lo que buscabas, intenta ingresar el nombre del producto."
							/>
						</div>
					) : (
						<div style={demo}>
							<InfiniteScroll
								initialLoad={false}
								pageStart={0}
								loadMore={handleInfiniteOnLoad}
								hasMore={!loading && hasMore}
								useWindow={false}
								threshold
								loader={<div className="d-flex justify-content-center" key={0}><Spin size="large" />Cargando...</div>}
							>
								<List
									dataSource={data}
									renderItem={(productos) => (
										<List.Item key={productos._id}
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
									)}
								>
								</List>
							</InfiniteScroll>
						</div>
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
								<Upload {...propsUpload} className="d-flex justify-content-center mt-3 mr-3">
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
