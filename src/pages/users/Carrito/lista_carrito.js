import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import './carrito.scss';
import { List, InputNumber, Space, Button, Select, Form, Tag, Modal, Input } from 'antd';
import { ShoppingCartOutlined, ExportOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import { CarritoContext } from './context_carrito/context-carrito';
import { MenuContext } from '../../../context/carritoContext';
import { obtenerDisponibilidad } from './services/obtenerStock';
import { actualizarCantidad } from './services/consultasCarrito';
import { AgregarPedido, EliminarArticuloCarrito } from './services/consultas_individuales';
import ModalApartado from './modal_apartado';

const { Option } = Select;
const styles = { fontSize: 20 };
const { confirm } = Modal;

function ListaCarrito(props) {
	const [ medida, setMedida ] = useState([]);
	const [ cantidad, setCantidad ] = useState();
	const [ disponible, setDisponible ] = useState('');
	const { carrito, cliente, token } = props;
	const [ medidaDisponible, setMedidaDisponible ] = useState('');
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const { activador, setActivador, setValidacion } = useContext(CarritoContext);
	const { active, setActive } = useContext(MenuContext);
	const [ visible, setVisible ] = useState(false);

	useEffect(() => {
		setCantidad(carrito.cantidad);
		if (carrito.idarticulo.tallas.length !== 0) {
			carrito.idarticulo.tallas.map((tallas) => {
				if (carrito.medida) {
					carrito.medida.map((medida) => {
						if (medida.talla === tallas.talla) {
							setMedida([ medida.talla, tallas.cantidad ]);
						}
						if (medida.talla === tallas.talla && tallas.cantidad === 0) {
							setValidateStatus('error');
							setMedidaDisponible('No esta disponible');
							setValidacion(true);
						}
					});
				}
			});
		} else if (carrito.idarticulo.numeros.length !== 0) {
			carrito.idarticulo.numeros.map((numeros) => {
				if (carrito.medida) {
					carrito.medida.map((medida) => {
						if (medida.numero === numeros.numero) {
							setMedida([ medida.numero, numeros.cantidad ]);
						}
						if (medida.numero === numeros.numero && numeros.cantidad === 0) {
							setValidateStatus('error');
							setMedidaDisponible('No esta disponible');
							setValidacion(true);
						}
					});
				}
			});
		}
		const disponible = obtenerDisponibilidad(carrito);
		if (disponible) {
			setDisponible(disponible);
		}
	}, []);

	function medidaChange(medida) {
		setCantidad(carrito.cantidad);
		setMedida(medida);
		setValidateStatus('validating');
		setMedidaDisponible('');
		setValidateStatus('warning');
		setMedidaDisponible('Guarda los cambios');
	}
	function cantidadChange(cantidad) {
		setCantidad(cantidad);
		if (cantidad !== 0) {
			setValidateStatus('warning');
			setMedidaDisponible('Guarda los cambios');
		}
	}

	function actualizar(articulo, categoria) {
		if (actualizarCantidad(cliente._id, articulo, categoria, cantidad, medida[0], token)) {
			setActivador(!activador);
			setValidacion(false);
			setValidateStatus('validating');
			setMedidaDisponible('');
		}
	}
	function comprar() {
		if (carrito.promocion) {
			var precio = carrito.promocion.precioPromocion;
		} else {
			var precio = carrito.idarticulo.precio;
		}
		AgregarPedido(
			cliente._id,
			carrito.idarticulo._id,
			carrito.idarticulo.tipoCategoria,
			carrito.cantidad,
			carrito.medida,
			precio,
			carrito.subtotal,
			token
		);
	}

	function eliminar() {
		console.log(carrito);
		confirm({
			title: 'Eliminar articulo?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Si',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				if (EliminarArticuloCarrito(cliente._id, carrito._id, token)) {
					setActivador(!activador);
					setActive(!active);
				}
			}
		});
	}

	function apartado() {
		setVisible(true);
	}

	return (
		<List.Item className="d-block p-4" key={carrito._id}>
			<div className={`row ${disponible}`}>
				<div className="col-lg-3">
					<div className="contenedor-imagen-vista-carrito">
						<img
							className="imagen-vista-carrito"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${carrito.idarticulo
								.imagen}`}
						/>
					</div>
				</div>

				<div className="col-lg-9">
					<div className="row">
						<div className="col-lg-8">
							<div>
								<Link to={`/vista_producto/${carrito.idarticulo._id}`}>
									<h3>{carrito.idarticulo.nombre}</h3>
								</Link>
								{!carrito.promocion ? (
									<p className="precio-carrito">${formatoMexico(carrito.idarticulo.precio)}</p>
								) : (
									<div>
										<p className="precio-anterior-carrito">
											${formatoMexico(carrito.idarticulo.precio)}
										</p>
										<p className="precio-promocion-carrito mr-2">
											${formatoMexico(carrito.promocion.precioPromocion)}
										</p>
										<p className="porcentaje-promocion-carrito">
											{agregarPorcentaje(
												carrito.promocion.precioPromocion,
												carrito.idarticulo.precio
											)}% OFF
										</p>
									</div>
								)}
								<div className="d-block d-lg-flex">
									<Tag className="detalles-carrito">Categoria: {carrito.idarticulo.categoria}</Tag>
									<Tag className="detalles-carrito">Género: {carrito.idarticulo.genero}</Tag>
									<Tag className="detalles-carrito mt-1">Color: {carrito.idarticulo.color}</Tag>
									<Tag
										style={{ backgroundColor: carrito.idarticulo.colorHex, height: 30, width: 30 }}
									/>
								</div>
								{disponible.length ? (
									<p className="titulo-disponible">Producto no disponible</p>
								) : (
									<p />
								)}
							</div>
						</div>
						<div className="col-lg-4">
							<div className="row justify-content-center">
								<div className="col">
									<Form initialValues={{ cantidad: carrito.cantidad }}>
										<Form.Item
											className="inputs-carrito"
											labelCol={{ offset: 1, span: 10 }}
											label="Cantidad"
											name="cantidad"
											id={carrito.idarticulo._id}
											help={medidaDisponible}
											validateStatus={validateStatus}
										>
											{carrito.idarticulo.tipoCategoria !== 'otros' ? (
												<InputNumber
													id={carrito.idarticulo._id}
													size="large"
													min={1}
													max={medida[1]}
													onChange={cantidadChange}
												/>
											) : (
												<InputNumber
													id={carrito.idarticulo._id}
													size="large"
													min={1}
													max={carrito.idarticulo.cantidad}
													onChange={cantidadChange}
												/>
											)}
										</Form.Item>
										{carrito.idarticulo.tipoCategoria !== 'otros' ? (
											<Form.Item
												className="inputs-carrito-talla"
												label="Talla"
												labelCol={{ offset: 1, span: 10 }}
												validateStatus={validateStatus}
											>
												<Select
													defaultValue={carrito.medida.map((res) => {
														return res.talla ? res.talla : res.numero;
													})}
													size="large"
													style={{ width: 90 }}
													onChange={medidaChange}
												>
													{carrito.idarticulo.tallas.length !== 0 ? (
														carrito.idarticulo.tallas.map((res) => {
															return res.cantidad !== 0 ? (
																<Option
																	key={res._id}
																	value={[ res.talla, res.cantidad ]}
																>
																	{res.talla}
																</Option>
															) : (
																<Option key={res._id} disabled value={res.talla}>
																	{res.talla}
																</Option>
															);
														})
													) : carrito.idarticulo.numeros.length !== 0 ? (
														carrito.idarticulo.numeros.map((res) => {
															return res.cantidad !== 0 ? (
																<Option
																	key={res._id}
																	value={[ res.numero, res.cantidad ]}
																>
																	{res.numero}
																</Option>
															) : (
																<Option key={res._id} disabled value={res.numero}>
																	{res.numero}
																</Option>
															);
														})
													) : (
														<Option>-</Option>
													)}
												</Select>
											</Form.Item>
										) : (
											<Form.Item className="d-none" />
										)}
										<Form.Item
											wrapperCol={{ offset: 10, span: 10 }}
											className="inputs-carrito text-center"
										>
											<Button
												type="primary" 
												ghost
												size="large"
												onClick={() =>
													actualizar(carrito._id, carrito.idarticulo.tipoCategoria)}
											>
												Modificar
											</Button>
										</Form.Item>
										<Form.Item
											label="Subtotal"
											labelCol={{ offset: 1, span: 10 }}
											className="inputs-carrito"
										>
											<p className="precio-vista-carrito">${formatoMexico(carrito.subtotal)}</p>
										</Form.Item>
									</Form>

									<div className="float-right" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="d-flex justify-content-center">
				{disponible.length !== 0 ? (
					<Space
						size={window.screen.width > 768 ? 'middle' : 'small'}
						direction={window.screen.width > 768 ? 'horizontal' : 'vertical'}
					>
						<Button type="link" className="d-block d-lg-inline" onClick={() => eliminar()}>
							<DeleteOutlined style={styles} />Eliminar producto
						</Button>
					</Space>
				) : (
					<Space
						size={window.screen.width > 768 ? 'middle' : 'small'}
						direction={window.screen.width > 768 ? 'horizontal' : 'vertical'}
					>
						<Button
							type="link"
							className="d-block d-lg-inline"
							onClick={() => comprar()}
							disabled={medidaDisponible !== '' ? true : false}
						>
							<ShoppingCartOutlined style={styles} />Comprar ahora
						</Button>
						<Button type="link" className="d-block d-lg-inline" onClick={() => eliminar()}>
							<DeleteOutlined style={styles} />Eliminar producto
						</Button>
						<Button
							type="link"
							className="d-block d-lg-inline"
							onClick={() => apartado()}
							disabled={medidaDisponible !== '' ? true : false}
						>
							<ExportOutlined style={styles} />Apartar
						</Button>
					</Space>
				)}
			</div>
			<ModalApartado visible={[ visible, setVisible ]} carrito={carrito} cliente={cliente} token={token} />
		</List.Item>
	);
}
export default ListaCarrito;
