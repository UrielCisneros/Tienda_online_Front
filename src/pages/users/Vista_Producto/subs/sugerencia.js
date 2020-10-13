import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../../config/axios';
import { notification, Spin, Button, Select, Card, Form, InputNumber, Modal, Alert } from 'antd';
import { IssuesCloseOutlined } from '@ant-design/icons';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction';
import { AgregarPedido } from './servicesSugerencia';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';

const { Option } = Select;
const { Meta } = Card;
const { confirm } = Modal;

function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

const Sugerencia = (props) => {
	const [ loading, setLoading ] = useState(false);
	const [ total, setTotal ] = useState(0);
	const idproducto = props.producto;
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	///PRODUCTO
	const [ producto, setProducto ] = useState([]);
	const [ productoPromocion, setProductoPromocion ] = useState([]);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ medida, setMedida ] = useState([]);
	const [ cantidadFinalProducto, setCantidadFinalProducto ] = useState(1);
	const [ disponibilidad, setDisponibilidad ] = useState('');

	function selectTallaProducto(value) {
		setMedida(value);
	}
	function obtenerCantidadProducto(cantidad) {
		if (cantidad <= 0 || cantidad > producto.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinalProducto(cantidad);
		}
	}
	function obtenerCantidadMedidaProducto(cantidad) {
		if (cantidad <= 0 || cantidad > medida[1]) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinalProducto(cantidad);
		}
	}

	///SUGERENCIA
	const [ sugerencia, setSugerencia ] = useState([]);
	const [ sugerenciaPromocion, setSugerenciaPromocion ] = useState([]);
	const [ validateStatusSug, setValidateStatusSug ] = useState('validating');
	const [ medidaSugerencia, setMedidaSugerencia ] = useState([]);
	const [ cantidadFinalSugerencia, setCantidadFinalSugerencia ] = useState(1);
	const [ disponibilidadSugerencia, setDisponibilidadSugerencia ] = useState('');
	const [ disabled, setDisabled ] = useState(false);

	function selectTallaSugerencia(value) {
		setMedidaSugerencia(value);
	}
	function obtenerCantidadSugerencia(cantidad) {
		if (cantidad <= 0 || cantidad > producto.cantidad) {
			setValidateStatusSug('error');
		} else {
			setValidateStatusSug('validating');
			setCantidadFinalSugerencia(cantidad);
		}
	}
	function obtenerCantidadMedidaSugerencia(cantidad) {
		if (cantidad <= 0 || cantidad > medidaSugerencia[1]) {
			setValidateStatusSug('error');
		} else {
			setValidateStatusSug('validating');
			setCantidadFinalSugerencia(cantidad);
		}
	}

	useEffect(() => {
		obtenerSugerencia();
	}, []);
	useEffect(
		() => {
			obtenerTotal();
			obtenerDisponibilidad();
		},
		[ obtenerSugerencia ]
	);
	function obtenerTotal() {
		if (sugerencia.length !== 0) {
			if (productoPromocion.length !== 0 && sugerenciaPromocion.length !== 0) {
				setTotal(
					productoPromocion.precioPromocion * cantidadFinalProducto +
						sugerenciaPromocion.precioPromocion * cantidadFinalSugerencia
				);
			} else if (productoPromocion.length !== 0 && sugerenciaPromocion.length === 0) {
				setTotal(
					productoPromocion.precioPromocion * cantidadFinalProducto +
						sugerencia.precio * cantidadFinalSugerencia
				);
			} else if (productoPromocion.length === 0 && sugerenciaPromocion.length !== 0) {
				setTotal(
					producto.precio * cantidadFinalProducto +
						sugerenciaPromocion.precioPromocion * cantidadFinalSugerencia
				);
			} else if (productoPromocion.length === 0 && sugerenciaPromocion.length === 0) {
				setTotal(producto.precio * cantidadFinalProducto + sugerencia.precio * cantidadFinalSugerencia);
			}
		}
	}
	function obtenerDisponibilidad() {
		///disponibilidad Productos
		if (producto && producto.activo === false) {
			setDisponibilidad('Producto no disponible');
			setDisabled(true);
		}

		//// Disponibilidad Sugerencias
		if (sugerencia && sugerencia.activo === false) {
			setDisponibilidadSugerencia('Producto no disponible');
			setDisabled(true);
		}
	}

	async function obtenerSugerencia() {
		setLoading(true);
		await clienteAxios
			.get(`/sugerencia/${idproducto}`)
			.then((res) => {
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
						description: 'Hubo un error con las sugerencias',
						duration: 2
					});
				}
			});
	}

	async function Pedido() {
		////AGREGAR PEDIDO
		AgregarPedido(
			decoded._id,
			producto._id,
			sugerencia._id,
			producto.tipoCategoria,
			sugerencia.tipoCategoria,
			cantidadFinalProducto,
			cantidadFinalSugerencia,
			medida[0],
			medidaSugerencia[0],
			total,
			token
		);
	}

	function showConfirm() {
		if (!token) {
			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			if (!medida[0] || !medidaSugerencia[0]) {
				notification.info({
					message: 'Selecciona una talla',
					duration: 2
				});
			} else {
				confirm({
					title: 'Comprar los siguientes articulos:',
					icon: <IssuesCloseOutlined />,
					okText: 'Continuar con la compra',
					content: (
						<div>
							<p>{producto.nombre}</p>
							<p>{sugerencia.nombre}</p>
							<p>Precio total: ${formatoMexico(total.toFixed(2))} + envio</p>
						</div>
					),
					onOk() {
						Pedido();
					}
				});
			}
		}
	}

	return (
		<Spin spinning={loading}>
			<div className="row mw-100">
				{!producto || !sugerencia ? (
					<div />
				) : (
					<div className="col-lg-12">
						<p className="my-3 text-center titulos-vista-productos">¡Llevalos juntos!</p>
						<div className="row" style={{ justifyContent: 'center' }}>
							<div className="d-lg-flex d-sm-block px-5">
								<div className="d-sm-block">
									<Card
										className="shadow"
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
										actions={[
											producto.tipoCategoria !== 'otros' ? (
												<Select
													defaultValue="Talla"
													style={{ width: 120 }}
													onChange={selectTallaProducto}
												>
													{producto.tallas && producto.tallas.length !== 0 ? (
														producto.tallas.map(
															(res) =>
																res.cantidad > 0 ? (
																	<Option
																		key={res._id}
																		value={[ res.talla, res.cantidad ]}
																	>
																		{res.talla}
																	</Option>
																) : (
																	<Option key={res._id} disabled>
																		{res.talla}
																	</Option>
																)
														)
													) : producto.numeros && producto.numeros.length !== 0 ? (
														producto.numeros.map(
															(res) =>
																res.cantidad > 0 ? (
																	<Option
																		key={res._id}
																		value={[ res.numero, res.cantidad ]}
																	>
																		{res.numero}
																	</Option>
																) : (
																	<Option key={res._id} disabled>
																		{res.numero}
																	</Option>
																)
														)
													) : (
														<Option />
													)}
												</Select>
											) : (
												<p>-</p>
											),
											<div>
												<Form initialValues={{ cantidad: 1 }}>
													{producto.tipoCategoria !== 'otros' ? (
														<Form.Item
															name="cantidad"
															validateStatus={validateStatus}
															help={
																producto.tipoCategoria !== 'otros' &&
																medida.length !== 0 ? (
																	<p>Solo hay {medida[1]} disponibles</p>
																) : (
																	<p>Elige una cantidad</p>
																)
															}
														>
															<InputNumber
																type="number"
																placeholder="Cantidad"
																min={1}
																max={medida[1]}
																defaultValue={1}
																onChange={obtenerCantidadMedidaProducto}
																style={{ width: 130 }}
																disabled={medida.length !== 0 ? false : true}
															/>
														</Form.Item>
													) : (
														<Form.Item
															validateStatus={validateStatus}
															help={<p>Solo hay {producto.cantidad} disponibles</p>}
														>
															<InputNumber
																type="number"
																placeholder="Cantidad"
																min={1}
																max={producto.cantidad}
																defaultValue={1}
																onChange={obtenerCantidadProducto}
																style={{ width: 130 }}
															/>
														</Form.Item>
													)}
												</Form>
											</div>
										]}
									>
										<Meta
											onClick={() => (window.location.href = `/vista_producto/${producto._id}`)}
											style={{ width: 250, cursor: 'pointer' }}
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
													<h6 className="disponibilidad">{disponibilidad}</h6>
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
										className="shadow"
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
										actions={[
											sugerencia.tipoCategoria !== 'otros' ? (
												<Select
													defaultValue="Talla"
													style={{ width: 120 }}
													onChange={selectTallaSugerencia}
												>
													{sugerencia.tallas && sugerencia.tallas.length !== 0 ? (
														sugerencia.tallas.map(
															(res) =>
																res.cantidad > 0 ? (
																	<Option
																		key={res._id}
																		value={[ res.talla, res.cantidad ]}
																	>
																		{res.talla}
																	</Option>
																) : (
																	<Option key={res._id} disabled>
																		{res.talla}
																	</Option>
																)
														)
													) : sugerencia.numeros && sugerencia.numeros.length !== 0 ? (
														sugerencia.numeros.map(
															(res) =>
																res.cantidad > 0 ? (
																	<Option
																		key={res._id}
																		value={[ res.numero, res.cantidad ]}
																	>
																		{res.numero}
																	</Option>
																) : (
																	<Option key={res._id} disabled>
																		{res.numero}
																	</Option>
																)
														)
													) : (
														<Option />
													)}
												</Select>
											) : (
												<p>-</p>
											),
											<div>
												<Form initialValues={{ cantidad: 1 }}>
													{sugerencia.tipoCategoria !== 'otros' ? (
														<Form.Item
															name="cantidad"
															validateStatus={validateStatusSug}
															help={
																sugerencia.tipoCategoria !== 'otros' &&
																medidaSugerencia.length !== 0 ? (
																	<p>Solo hay {medidaSugerencia[1]} disponibles</p>
																) : (
																	<p>Elige una cantidad</p>
																)
															}
														>
															<InputNumber
																type="number"
																placeholder="Cantidad"
																min={1}
																max={medidaSugerencia[1]}
																defaultValue={1}
																onChange={obtenerCantidadMedidaSugerencia}
																style={{ width: 130 }}
																disabled={medidaSugerencia.length !== 0 ? false : true}
															/>
														</Form.Item>
													) : (
														<Form.Item
															validateStatus={validateStatus}
															help={<p>Solo hay {sugerencia.cantidad} disponibles</p>}
														>
															<InputNumber
																type="number"
																placeholder="Cantidad"
																min={1}
																max={sugerencia.cantidad}
																defaultValue={1}
																onChange={obtenerCantidadSugerencia}
																style={{ width: 130 }}
															/>
														</Form.Item>
													)}
												</Form>
											</div>
										]}
									>
										<Meta
											onClick={() => (window.location.href = `/vista_producto/${sugerencia._id}`)}
											style={{ width: 250, cursor: 'pointer' }}
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
													<h6 className="disponibilidad">{disponibilidadSugerencia}</h6>
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
									{decoded && decoded.rol === true ? (
										<Alert
											description="Como Administrador tienes desabilitadas las opciones de comprar, apartar y agregar al carrito"
											type="info"
											showIcon
										/>
									) : (
										<Button
											disabled={disabled}
											type="primary"
											size="large"
											className="d-block m-1"
											onClick={() => showConfirm()}
										>
											Comprar
										</Button>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</Spin>
	);
};

export default withRouter(Sugerencia);
