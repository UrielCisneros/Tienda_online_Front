import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Slider, Upload, List, Avatar, notification, Result, Spin, Form, Col } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import './registrar_promocion.scss';
import InfiniteScroll from 'react-infinite-scroller';

const { Search } = Input;
const demo = { height: '500px', overflow: 'auto' };

const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return number.toString().replace(exp, rep);
	}
};

const RegistrarPromocion = (props) => {
	const token = localStorage.getItem('token');
	const [ content, setContent ] = useState(false);

	const [ data, setData ] = useState([]);
	const [ hasMore, setHasMore ] = useState(true);
	const [ page, setPage ] = useState(1);
	const [ totalDocs, setTotalDocs ] = useState();
	const [ reloadData, setReloadData ] = useState(false);
	const [ visible, setVisible ] = useState('d-none');

	const [ loading, setLoading ] = useState(false);
	const [ loadingList, setLoadingList ] = useState(true);
	const [ disabled, setDisabled ] = useState(true);
	const [ imagen, setImagen ] = useState([]);
	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();
	const [ disabledSumit, setDisabledSumit ] = useState(true);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ inputValue, setInputValue ] = useState(0);
	const [ form ] = Form.useForm();
	const reload = props.reload;

	useEffect(
		() => {
			if (reload) {
				setPage(1);
				setHasMore(true);
				setProducto([]);
				setContent(false);
				setInputValue(0);
				setPromocion([]);
				setPrecioPromocion();
				setDisabledSumit(true);
				form.resetFields();
			}
			obtenerProductos((res) => {
				setData(res.data.posts.docs);
				setTotalDocs(res.data.posts.totalDocs);
				setPage(res.data.posts.nextPage);
			});
		},
		[ reload, reloadData, form ]
	);

	const obtenerProductos = (callback) => {
		setReloadData(false);
		setVisible('d-none');
		setLoadingList(true);
		clienteAxios
			.get(`/productos?limit=${10}&page=${page}`)
			.then((res) => {
				callback(res);
				setLoadingList(false);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoadingList(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoadingList(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	};

	const handleInfiniteOnLoad = () => {
		setLoadingList(true);
		if (data.length === totalDocs) {
			setLoadingList(false);
			setHasMore(false);
			return;
		}
		obtenerProductos((res) => {
			setData(data.concat(res.data.posts.docs));
		});
	};

	const propsUpload = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			subirImagen(formDataImagen);
		}
	};

	const formatter = (value) => `${value}%`;

	const onChange = (value) => {
		setInputValue(value);
		var porcentaje = 100 - value;
		var descuento = Math.round(producto.precio * porcentaje / 100);
		if (descuento >= producto.precio || descuento <= 0) {
			setValidateStatus('error');
			setDisabledSumit(true);
			form.setFieldsValue({ precio: descuento });
		} else {
			form.setFieldsValue({ precio: descuento });
			setPrecioPromocion(descuento);
			setValidateStatus('validating');
			setDisabledSumit(false);
		}
	};

	const obtenerCampo = (e) => {
		if (e.target.value >= producto.precio || e.target.value <= 0) {
			setValidateStatus('error');
			setDisabledSumit(true);
		} else {
			setPrecioPromocion(e.target.value);
			setValidateStatus('validating');
			setDisabledSumit(false);
			var porcentaje = Math.round(e.target.value / producto.precio * 100);
			var descuento = 100 - porcentaje;
			setInputValue(descuento);
		}
	};

	const subirImagen = async (formDataImagen) => {
		setLoading(true);
		await clienteAxios
			.put(`/productos/promocion/${promocion._id}`, formDataImagen, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setImagen(res.data.promocionBase.imagenPromocion);
				setLoading(false);
				setDisabled(true);
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

	const subirPromocion = async () => {
		setLoading(true);
		const formData = new FormData();
		formData.append('productoPromocion', producto._id);
		formData.append('precioPromocion', precioPromocion);
		await clienteAxios
			.post(`/productos/promocion/`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setPromocion(res.data.userStored);
				setDisabled(false);
				setDisabledSumit(true);
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

	const obtenerProductosFiltrados = async (busqueda) => {
		if (!busqueda) {
			setVisible('d-none');
			notification.info({
				message: 'Escribe algo en el buscador',
				duration: 4
			});
		} else {
			setVisible('ml-1 d-flex justify-content-center align-items-center');
			setLoadingList(true);
			await clienteAxios
				.get(`/productos/search?nombre=${busqueda}&categoria=${busqueda}&subcategoria=${busqueda}`)
				.then((res) => {
					setData(res.data.posts);
					setLoadingList(false);
				})
				.catch((res) => {
					if (res.response.status === 404 || res.response.status === 500) {
						setLoadingList(false);
						notification.error({
							message: 'Error',
							description: res.response.data.message,
							duration: 2
						});
					} else {
						setLoadingList(false);
						notification.error({
							message: 'Error',
							description: 'Hubo un error',
							duration: 2
						});
					}
				});
		}
	};

	return (
		<Spin size="large" spinning={loading}>
			<div className="d-lg-flex d-sm-block mt-4">
				<div className="col-12 col-lg-6  border-bottom">
					<Spin size="large" spinning={loadingList}>
						<div className="row justify-content-center">
							<Search
								placeholder="Busca un producto"
								onSearch={(value) => obtenerProductosFiltrados(value)}
								style={{ width: 350, height: 40, marginBottom: 10 }}
								enterButton="Buscar"
								size="large"
							/>
							<Button
								type="primary"
								size="large"
								className={visible}
								onClick={() => {
									setPage(1);
									setHasMore(true);
									setReloadData(true);
								}}
								icon={<RollbackOutlined style={{ fontSize: 24 }} />}
							>
								Volver
							</Button>
						</div>
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
									threshold={5}
								>
									<List
										className="m-1"
										dataSource={data}
										renderItem={(productos) => (
											<List.Item
												className={producto._id === productos._id ? 'list-item-promocion' : ''}
												key={productos._id}
												actions={[
													!productos.todos.length ? (
														<Button
															onClick={() => {
																setProducto(productos);
																setContent(true);
															}}
														>
															Seleccionar
														</Button>
													) : (
														<Button className="button-disabled-promocion" disabled>
															Promoción activa
														</Button>
													)
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
									/>
								</InfiniteScroll>
							</div>
						)}
					</Spin>
				</div>
				{content === false ? (
					<div className="col-12 col-lg-6 d-flex justify-content-center mt-5">
						
					</div>
				) : (
					<div className="col-12 col-lg-6">
						<List className="shadow contenedor-articulo-detalles">
							<List.Item>
								<List.Item.Meta
									className="list-item-producto"
									avatar={
										<div
											className="d-flex justify-content-center align-items-center mr-2"
											style={{ width: 100, height: 100 }}
										>
											<img
												className="imagen-promocion-principal"
												alt="producto"
												src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
											/>
										</div>
									}
									title={
										<div className="precio-box">
											<div className="titulo-box">
												<h2>{producto.nombre}</h2>
											</div>
											{promocion.length !== 0 || disabledSumit === false ? (
												<div>
													<p className="precio-producto d-inline mr-2">
														${formatoMexico(producto.precio)}
													</p>
													<p className="precio-rebaja d-inline mr-2">
														${formatoMexico(precioPromocion)}
													</p>
													<p className="porcentaje-descuento d-inline">{inputValue}%OFF</p>
												</div>
											) : (
												<p className="precio-rebaja d-inline">
													${formatoMexico(producto.precio)}
												</p>
											)}
										</div>
									}
								/>
							</List.Item>
						</List>
						<div className="mt-5">
							<div className="d-flex justify-content-center">
								<Col>
									<Slider
										min={0}
										max={100}
										tipFormatter={formatter}
										onChange={onChange}
										value={typeof inputValue === 'number' ? inputValue : 0}
										tooltipVisible
										marks={{ 0: '0%', 50: '50%', 100: '100%' }}
									/>
									<Form form={form}>
										<Form.Item
											name="precio"
											validateStatus={validateStatus}
											help="La promoción no debe ser mayor al precio del producto"
										>
											<Input
												prefix="$"
												type="number"
												label="Precio"
												onChange={obtenerCampo}
												min={0}
												max={producto.precio}
											/>
										</Form.Item>
										<Form.Item className="text-center">
											<Button disabled={disabledSumit} onClick={subirPromocion}>
												Guardar promoción
											</Button>
										</Form.Item>
									</Form>
								</Col>
							</div>
							<div className="row">
								<p className="mt-2 texto-imagen">
									Sube una imagen para la promoción, esta imagen aparecerá en el carrucel de
									promociones
								</p>
								<Upload {...propsUpload} className="d-flex justify-content-center mt-3 mr-3">
									<Button disabled={disabled}>Subir</Button>
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
		</Spin>
	);
};

export default RegistrarPromocion;
