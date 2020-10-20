import React, { useState, useEffect, useContext } from 'react';
import { InputNumber, Button, Form, Badge, Divider, notification, Modal, Select, Spin, Alert } from 'antd';
import { ShoppingCartOutlined, TagsOutlined, BellOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import { AgregarCarrito, AgregarApartado, AgregarPedido } from './services';
import { formatoMexico } from '../../../../config/reuserFunction';
import { withRouter } from 'react-router-dom';
import { MenuContext } from '../../../../context/carritoContext';
import DatosCliente from './datos_cliente';
import clienteAxios from '../../../../config/axios';

const formItemLayout = {
	labelCol: {
		xs: { span: 24 },
		sm: { span: 8 }
	},
	wrapperCol: {
		xs: { span: 24 },
		sm: { span: 16 }
	}
};
const { Option } = Select;

function TallasCantidades(props) {
	const { active, setActive } = useContext(MenuContext);
	const productos = props.producto;
	const [ categoria, setCategoria ] = useState();
	/* 	const [ cantidad, setCantidad ] = useState(); */
	const [ promocion, setPromocion ] = useState('');
	const [ tallas, setTallas ] = useState([]);
	const [ numeros, setNumeros ] = useState([]);
	const [ render, setRender ] = useState([]);
	const [ validateStatus, setValidateStatus ] = useState('validating');
	const [ cantidadFinal, setCantidadFinal ] = useState(1);
	const [ tipoEnvio, setTipoEnvio ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ visible, setVisible ] = useState(false);
	const [ disabled, setDisabled ] = useState(false);
	const [ datosUser, setDatosUser ] = useState([]);

	const token = localStorage.getItem('token');
	var decoded = Jwt(token);
	var total = 0;
	var precio = 0;

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	async function obtenerDatosUser() {
		if (!decoded) {
			return null;
		}
		await clienteAxios
			.get(`/cliente/${decoded._id}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setDatosUser(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}

	useEffect(() => {
		if (token) {
			obtenerDatosUser();
		}
	}, []);

	useEffect(
		() => {
			if (productos.promocion && productos.promocion.length) {
				productos.promocion.forEach((res) => setPromocion(res.precioPromocion));
			}
			if (productos.tipoCategoria === 'calzado') {
				setCategoria('calzado');
				setRender(
					productos.numeros.map((numeros) => {
						return numeros.cantidad > 0 ? (
							<Badge key={numeros._id} count={numeros.cantidad} style={{ backgroundColor: '#1890FF' }}>
								<Button
									type="dashed"
									className="talla-vista-producto d-inline-block"
									onClick={() => setNumeros(numeros)}
								>
									{numeros.numero}
								</Button>
							</Badge>
						) : (
							<Badge
								key={numeros._id}
								showZero
								count={numeros.cantidad}
								style={{ backgroundColor: '#F5F5F5', color: '#7D7D7D' }}
							>
								<Button type="dashed" disabled className="talla-vista-producto d-inline-block">
									{numeros.numero}
								</Button>
							</Badge>
						);
					})
				);
			} else if (productos.tipoCategoria === 'ropa') {
				setCategoria('ropa');
				setRender(
					productos.tallas.map((tallas) => {
						return tallas.cantidad > 0 ? (
							<Badge key={tallas._id} count={tallas.cantidad} style={{ backgroundColor: '#1890FF' }}>
								<Button
									type="dashed"
									className="talla-vista-producto d-inline-block"
									onClick={() => setTallas(tallas)}
								>
									{tallas.talla}
								</Button>
							</Badge>
						) : (
							<Badge
								key={tallas._id}
								count={tallas.cantidad}
								showZero
								style={{ backgroundColor: '#F5F5F5', color: '#7D7D7D' }}
							>
								<Button type="dashed" disabled className="talla-vista-producto d-inline-block">
									{tallas.talla}
								</Button>
							</Badge>
						);
					})
				);
			} else if (productos.tipoCategoria === 'otros') {
				setCategoria('otros');
			}
			if (productos && productos.activo === false) {
				setDisabled(true);
			}
		},
		[ productos ]
	);

	function obtenerCantidad(cantidad) {
		if (cantidad <= 0 || cantidad > productos.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad);
		}
	}
	function obtenerCantidadNumero(cantidad) {
		if (cantidad <= 0 || cantidad > numeros.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad);
		}
	}
	function obtenerCantidadTalla(cantidad) {
		if (cantidad <= 0 || cantidad > tallas.cantidad) {
			setValidateStatus('error');
		} else {
			setValidateStatus('validating');
			setCantidadFinal(cantidad);
		}
	}

	function obtenerTipoEnvio(value) {
		setTipoEnvio(value);
	}

	const showModal = () => {
		if (!token) {
			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			if (categoria === 'ropa' && !tallas.talla) {
				notification.info({
					message: 'Selecciona una talla',
					duration: 2
				});
			} else if (categoria === 'calzado' && !numeros.numero) {
				notification.info({
					message: 'Selecciona una talla',
					duration: 2
				});
			} else {
				setVisible(true);
			}
		}
	};

	const handleOk = (e) => {
		if (!tipoEnvio) {
			notification.info({
				message: 'Selecciona un tipo de envio',
				duration: 2
			});
		} else {
			if (datosUser.telefono.length === 0 || datosUser.direccion.length === 0) {
				notification.info({
					message: 'Completa tus datos',
					duration: 2
				});
			} else {
				setVisible(false);
				Apartado();
			}
		}
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	async function Carrito() {
		////AGREGAR CARRITO
		if (!token) {
			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			setLoading(true);
			if (categoria === 'calzado') {
				if (!numeros.numero) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const talla = '';
					if (AgregarCarrito(decoded._id, productos._id, cantidadFinal, talla, numeros.numero, token)) {
						setActive(!active);
					}
					setLoading(false);
				}
			} else if (categoria === 'ropa') {
				if (!tallas.talla) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const numero = '';
					setLoading(false);
					if (AgregarCarrito(decoded._id, productos._id, cantidadFinal, tallas.talla, numero, token)) {
						setActive(!active);
					}
				}
			} else if (categoria === 'otros') {
				const talla = '';
				const numero = '';
				if (AgregarCarrito(decoded._id, productos._id, cantidadFinal, talla, numero, token)) {
					setActive(!active);
				}
				setLoading(false);
			}
		}
	}

	async function Apartado() {
		////AGREGAR APARTADO
		setLoading(true);
		if (categoria === 'calzado') {
			const talla = '';
			AgregarApartado(decoded._id, productos._id, cantidadFinal, talla, numeros.numero, tipoEnvio, token);
			setLoading(false);
		} else if (categoria === 'ropa') {
			const numero = '';
			setLoading(false);
			AgregarApartado(decoded._id, productos._id, cantidadFinal, tallas.talla, numero, tipoEnvio, token);
		} else if (categoria === 'otros') {
			const talla = '';
			const numero = '';
			AgregarApartado(decoded._id, productos._id, cantidadFinal, talla, numero, tipoEnvio, token);
			setLoading(false);
		}
	}

	async function Pedido() {
		////AGREGAR PEDIDO
		if (!token) {
			props.history.push('/entrar');
			notification.info({
				message: 'inicia sesión para poder realizar tus compras',
				duration: 2
			});
		} else {
			setLoading(true);
			if (categoria === 'calzado') {
				if (!numeros.numero) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const talla = '';
					if (promocion.length !== 0) {
						total = cantidadFinal * promocion;
						precio = promocion;
					} else {
						total = cantidadFinal * productos.precio;
						precio = productos.precio;
					}
					AgregarPedido(
						decoded._id,
						productos._id,
						cantidadFinal,
						talla,
						numeros.numero,
						precio,
						total,
						token
					);
					setLoading(false);
				}
			} else if (categoria === 'ropa') {
				if (!tallas.talla) {
					setLoading(false);
					notification.info({
						message: 'Selecciona una talla',
						duration: 2
					});
				} else {
					const numero = '';
					if (promocion.length !== 0) {
						total = cantidadFinal * promocion;
						precio = promocion;
					} else {
						total = cantidadFinal * productos.precio;
						precio = productos.precio;
					}
					setLoading(false);
					AgregarPedido(
						decoded._id,
						productos._id,
						cantidadFinal,
						tallas.talla,
						numero,
						precio,
						total,
						token
					);
				}
			} else if (categoria === 'otros') {
				const talla = '';
				const numero = '';
				if (promocion.length !== 0) {
					total = cantidadFinal * promocion;
					precio = promocion;
				} else {
					total = cantidadFinal * productos.precio;
					precio = productos.precio;
				}
				AgregarPedido(decoded._id, productos._id, cantidadFinal, talla, numero, precio, total, token);
				setLoading(false);
			}
		}
	}

	return (
		<Spin spinning={loading}>
			<div className="contenedor-p-seleccion-compra">
				<div className="contenedor-p-seleccion-compra mb-4">
					{disabled ? (
						<p className="disponibilidad-p mb-3">En este momento no hay articulos disponibles</p>
					) : (
						<p className="disponibilidad-p-disponible mb-3">¡Articulos disponibles!</p>
					)}
					{categoria !== 'otros' ? <p className="mb-3 font-weight-bold">Tallas:</p> : <p />}
					<div>{render}</div>
				</div>

				<Form initialValues={{ cantidad: 1 }} {...formItemLayout}>
					{categoria !== 'otros' ? (
						<Form.Item
							name="cantidad"
							label="Cantidad"
							validateStatus={validateStatus}
							help={
								categoria === 'ropa' && tallas.length !== 0 ? (
									<p>Solo hay {tallas.cantidad} disponibles</p>
								) : categoria === 'calzado' && numeros.length !== 0 ? (
									<p>Solo hay {numeros.cantidad} disponibles</p>
								) : (
									<p>Elige una talla</p>
								)
							}
						>
							<InputNumber
								type="number"
								size="middle"
								min={1}
								max={categoria === 'ropa' ? tallas.cantidad : numeros.cantidad}
								defaultValue={1}
								onChange={categoria === 'ropa' ? obtenerCantidadTalla : obtenerCantidadNumero}
								style={{ width: 70 }}
								disabled={tallas.length !== 0 || numeros.length !== 0 ? false : true}
							/>
						</Form.Item>
					) : (
						<Form.Item
							label="Cantidad"
							validateStatus={validateStatus}
							help={<p>Solo hay {productos.cantidad} disponibles</p>}
						>
							<InputNumber
								size="large"
								min={1}
								max={productos.cantidad}
								defaultValue={1}
								onChange={obtenerCantidad}
								style={{ width: 130 }}
							/>
						</Form.Item>
					)}
				</Form>

				<Divider />
				{decoded && decoded.rol === true ? (
					<Alert
						description="Como Administrador tienes desabilitadas las opciones de comprar, apartar y agregar al carrito"
						type="info"
						showIcon
					/>
				) : (
					<div className="contenedor-button-vista">
						<div>
							<Button
								className="d-block size-button-vista"
								type="primary"
								size="large"
								onClick={() => Pedido()}
								disabled={disabled}
							>
								<TagsOutlined style={{ fontSize: 20 }} />
								Comprar ahora
							</Button>
							<Button
								className="mt-3 d-block size-button-vista boton-compras-secun"
								size="large"
								onClick={() => showModal()}
								disabled={disabled}
							>
								<BellOutlined style={{ fontSize: 20 }} />
								Apartar
							</Button>
							<Button
								className="mt-3 d-block size-button-vista boton-compras-secun"
								size="large"
								disabled={disabled}
								onClick={() => Carrito()}
							>
								<ShoppingCartOutlined style={{ fontSize: 20 }} />
								Agregar al carrito
							</Button>
						</div>
					</div>
				)}
			</div>
			<Modal
				title="Aparta tu producto"
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				cancelText="Cancelar"
				okText="Apartar ahora"
				width={700}
			>
				<div className="row">
					<div className="col-12 col-lg-6">
						<div className="mb-3">
							<h6 className="d-inline font-weight-bold">Producto: </h6>
							<p className="d-inline">{productos.nombre}</p>
						</div>

						{numeros.length !== 0 ? (
							<div className="mb-3">
								<h6 className="d-inline font-weight-bold">Medida: </h6>
								<p className="d-inline">{numeros.numero}</p>
							</div>
						) : tallas.length !== 0 ? (
							<div className="mb-3">
								<h6 className="d-inline font-weight-bold">Talla: </h6>
								<p className="d-inline">{tallas.talla}</p>
							</div>
						) : (
							<p className="d-inline" />
						)}
						<div className="mb-3">
							<h6 className="d-inline font-weight-bold">Cantidad: </h6>
							<p className="d-inline">{cantidadFinal}</p>
						</div>
						{!productos.promocion ? (
							<div className="mb-3">
								<h6 className="d-inline font-weight-bold">Precio: </h6>
								<p className="d-inline">${formatoMexico(productos.precio)}</p>
							</div>
						) : (
							productos.promocion.map((res) => {
								return (
									<div key={res._id} className="mb-3">
										<h6 className="d-inline font-weight-bold">Precio: </h6>
										<p className="d-inline">${formatoMexico(res.precioPromocion)}</p>
									</div>
								);
							})
						)}
						<div className="mb-3">
							<h6 className="font-weight-bold">Elegir tipo de envío: </h6>
							<Select style={{ width: 200 }} placeholder="Selecciona un tipo" onChange={obtenerTipoEnvio}>
								<Option value="ENVIO">Envío por paquetería</Option>
								<Option value="REGOGIDO">Recoger a sucursal</Option>
							</Select>
						</div>
						<Alert
							description="Para apartar un producto completa tus datos."
							type="info"
							showIcon
						/>
					</div>
					<div className="col-12 col-lg-6">
						<div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
							<img
								className="imagen-producto-principal"
								alt="producto"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
							/>
						</div>
					</div>
				</div>
				<Divider>Tus datos</Divider>
				{decoded && decoded._id ? (
					<DatosCliente token={token} clienteID={decoded._id} tipoEnvio={tipoEnvio} />
				) : (
					<div />
				)}
			</Modal>
		</Spin>
	);
}
export default withRouter(TallasCantidades);
