import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../../config/axios';
import { notification, Spin, Button } from 'antd';
import { Link } from 'react-router-dom';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction';

import { Card } from 'antd';

const { Meta } = Card;

const Sugerencia = (props) => {
	const [ loading, setLoading ] = useState(false);
	const [ producto, setProducto ] = useState([]);
	const [ sugerencia, setSugerencia ] = useState([]);
	const [ productoPromocion, setProductoPromocion ] = useState([]);
	const [ sugerenciaPromocion, setSugerenciaPromocion ] = useState([]);
	const [ total, setTotal ] = useState(0);
	const idproducto = props.producto;

	useEffect(() => {
		obtenerSugerencia();
	}, []);

	async function obtenerSugerencia() {
		setLoading(true);
		await clienteAxios
			.get(`/sugerencia/${idproducto}`)
			.then((res) => {
				console.log(res)
				setProducto(res.data.producto);
				if (res.data.sugerencias) {
					res.data.sugerencias.forEach((element) => setSugerencia(element.producto));
					if (res.data.promocionProducto.length !== 0 && res.data.promocionSugerencia.length === 0) {
						res.data.promocionProducto.forEach((element) => setProductoPromocion(element));
					} else if (res.data.promocionSugerencia.length !== 0 && res.data.promocionProducto.length === 0) {
						res.data.promocionSugerencia.forEach((element) => setSugerenciaPromocion(element));
					} else if (res.data.promocionProducto.length !== 0 && res.data.promocionSugerencia.length !== 0) {
						res.data.promocionProducto.forEach((element) => setProductoPromocion(element));
						res.data.promocionSugerencia.forEach((element) => setSugerenciaPromocion(element));
					}
				}
				setLoading(false);
			})
			.catch((res) => {
				console.log(res)
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
	}

	useEffect(
		() => {
			if(sugerencia.length !== 0){
				if (productoPromocion.length !== 0 && sugerenciaPromocion.length !== 0) {
					setTotal(productoPromocion.precioPromocion + sugerenciaPromocion.precioPromocion);
				} else if (productoPromocion.length !== 0 && sugerenciaPromocion.length === 0) {
					setTotal(productoPromocion.precioPromocion + sugerencia.precio);
				} else if (productoPromocion.length === 0 && sugerenciaPromocion.length !== 0) {
					setTotal(producto.precio + sugerenciaPromocion.precioPromocion);
				} else if (productoPromocion.length === 0 && sugerenciaPromocion.length === 0) {
					setTotal(producto.precio + sugerencia.precio);
				}
			}
		},
		[ obtenerSugerencia ]
	);

	return (
		<Spin spinning={loading}>
			<div className="row">
				{!producto || !sugerencia ? (
					<div />
				) : (
					<div className="col-lg-12">
						<p className="my-3 text-center titulos-vista-productos">¡Llevalos juntos!</p>
						<div className="row" style={{ justifyContent: 'center' }}>
							<div className="d-lg-flex d-sm-block px-5">
								<div className="d-sm-block">
									<Card
										onClick={() => window.location.href = `/vista_producto/${producto._id}`}
										className="shadow"
										style={{ width: 250, cursor: 'pointer' }}
										cover={
											<div
												className="d-flex justify-content-center align-items-center"
												style={{ height: 200 }}
											>
												<img
													className="imagen-producto-sugerencia"
													alt="producto actual"
													src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
												/>
											</div>
										}
									>
										<Meta
											title={producto.nombre}
											description={
												<div>
													{productoPromocion.length === 0 ? (
														<p className="titulo-precio-tachado precio-rebaja titulo-precio">
															$ {formatoMexico(producto.precio)}
														</p>
													) : (
														<div>
															<p className="titulo-precio-tachado precio-producto">
																$ {formatoMexico(producto.precio)}
															</p>
															<p
																className="titulo-precio precio-rebaja mr-2"
																style={{ fontSize: 18 }}
															>
																$ {formatoMexico(productoPromocion.precioPromocion)}
															</p>
															<p
																className="titulo-porcentaje-sugerencia porcentaje-descuento d-inline"
																style={{ fontSize: 18 }}
															>
																{agregarPorcentaje(
																	productoPromocion.precioPromocion,
																	producto.precio
																)}% OFF
															</p>
														</div>
													)}
												</div>
											}
										/>
									</Card>
								</div>
								<div className="d-lg-flex justify-content-center align-items-center d-sm-block">
									<p className="display-1 text-center mx-4">+</p>
								</div>
								<div className="d-sm-block">
									<Card
										onClick={() => window.location.href = `/vista_producto/${sugerencia._id}`}
										className="shadow"
										style={{ width: 250, cursor: 'pointer' }}
										cover={
											<div
												className="d-flex justify-content-center align-items-center"
												style={{ height: 200 }}
											>
												<img
													className="imagen-producto-sugerencia"
													alt="producto actual"
													src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${sugerencia.imagen}`}
												/>
											</div>
										}
									>
										<Meta
											title={sugerencia.nombre}
											description={
												<div>
													{sugerenciaPromocion.length === 0 ? (
														<p className="titulo-precio-tachado precio-rebaja titulo-precio">
															$ {formatoMexico(sugerencia.precio)}
														</p>
													) : (
														<div>
															<p className="titulo-precio-tachado precio-producto">
																$ {formatoMexico(sugerencia.precio)}
															</p>
															<p
																className="titulo-precio precio-rebaja mr-2"
																style={{ fontSize: 18 }}
															>
																$ {formatoMexico(sugerenciaPromocion.precioPromocion)}
															</p>
															<p
																className="titulo-porcentaje-sugerencia porcentaje-descuento d-inline"
																style={{ fontSize: 18 }}
															>
																{agregarPorcentaje(
																	sugerenciaPromocion.precioPromocion,
																	sugerencia.precio
																)}% OFF
															</p>
														</div>
													)}
												</div>
											}
										/>
									</Card>
								</div>
							</div>
							<div className="mt-3">
								<div className="d-block">
									<p className="titulos-vista-productos">
										Precio total: ${formatoMexico(total.toFixed(2))}
									</p>
								</div>
								<div className="d-flex justify-content-center align-items-center mt-4">
									<Button type="primary" size="large" className="d-block m-1">
										Comprar
									</Button>
									<Button size="large" className="d-block m-1">
										Agregar al carrito
									</Button>
									<Button size="large" className="d-block m-1">
										Apartar
									</Button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</Spin>
	);
};

export default Sugerencia;
