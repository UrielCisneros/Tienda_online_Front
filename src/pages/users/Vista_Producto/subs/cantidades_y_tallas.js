import React, { useState, useEffect } from 'react';
import { InputNumber, Button, Form, Badge, Divider, notification, Modal, Select, Spin } from 'antd';
import { ShoppingCartOutlined, TagsOutlined, BellOutlined, IssuesCloseOutlined } from '@ant-design/icons';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../../../config/axios';
import { AgregarCarrito, AgregarApartado, AgregarPedido } from './services';
import { formatoMexico } from '../../../../config/reuserFunction';

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
const { confirm } = Modal;

function TallasCantidades(props) {
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
	const [ disponibilidad, setDisponibilidad ] = useState('');
	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	useEffect(
		() => {
			if (productos.promocion && productos.promocion.length) {
				productos.promocion.forEach((res) => setPromocion(res.precioPromocion));
			}
			if (productos.tipoCategoria === 'calzado') {
				productos.numeros.forEach((numeros, index) => {
					if(numeros.cantidad === 0 && numeros.cantidad === index ){
						setDisponibilidad('Producto no disponible');
					}
				})
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
				productos.tallas.forEach((tallas, index) => {
					if(tallas.cantidad === 0 && tallas.cantidad === index ){
						setDisponibilidad('Producto no disponible');
					}
				})
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
				if(productos.cantidad === 0 ){
					setDisponibilidad('Producto no disponible');
				}
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
	};
	const handleOk = (e) => {
		if(!tipoEnvio){
			notification.info({
				message: 'Selecciona un tipo de envio',
				duration: 2
			});
		}else{
			setVisible(false);
			Apartado();
		}
	};

	const handleCancel = (e) => {
		setVisible(false);
	};

	function showConfirm() {
		if (categoria === 'calzado' && !numeros.numero) {
			notification.info({
				message: 'Selecciona una talla',
				duration: 2
			});
		}else if(categoria === 'ropa' && !tallas.talla){
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
						<p>{productos.nombre}</p>
						<p>Cantiad: {cantidadFinal}</p>
						{categoria !== 'otros' && !tallas.talla ? 
						<p>Talla: {numeros.numero}</p> :
						<p>Talla: {tallas.talla}</p>
						}
						{!productos.promocion ? (
							<p>Precio total: ${formatoMexico(productos.precio)} + envio</p>
						) : (
							productos.promocion.map((res) => {
								return (
									<div key={res._id} className="mb-3">
										<h6 className="d-inline">Precio: </h6>
										<p>Precio total: ${formatoMexico(res.precioPromocion)} + envio</p>
									</div>
								);
							})
						)}
					</div>
				),
				onOk() {
					Pedido();
				},
				onCancel() {
					console.log('Cancel');
				}
			});
		}
	}

	async function Carrito() {
		////AGREGAR CARRITO
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
				AgregarCarrito(decoded._id, productos._id, cantidadFinal, talla, numeros.numero, token);
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
				AgregarCarrito(decoded._id, productos._id, cantidadFinal, tallas.talla, numero, token);
			}
		} else if (categoria === 'otros') {
			const talla = '';
			const numero = '';
			AgregarCarrito(decoded._id, productos._id, cantidadFinal, talla, numero, token);
			setLoading(false);
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
					var total = cantidadFinal * promocion;
				} else {
					var total = cantidadFinal * productos.precio;
				}
				AgregarPedido(decoded._id, productos._id, cantidadFinal, talla, numeros.numero, total, token);
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
					var total = cantidadFinal * promocion;
				} else {
					var total = cantidadFinal * productos.precio;
				}
				setLoading(false);
				AgregarPedido(decoded._id, productos._id, cantidadFinal, tallas.talla, numero, total, token);
			}
		} else if (categoria === 'otros') {
			const talla = '';
			const numero = '';
			if (promocion.length !== 0) {
				var total = cantidadFinal * promocion;
			} else {
				var total = cantidadFinal * productos.precio;
			}
			AgregarPedido(decoded._id, productos._id, cantidadFinal, talla, numero, total, token);
			setLoading(false);
		}
	}

	return (
		<Spin spinning={loading}>
			<div className="contenedor-p-seleccion-compra">
				<div className="contenedor-p-seleccion-compra mb-4">
					<h3 className="disponibilidad">{disponibilidad}</h3>
					{categoria !== 'otros' ? <p className="mb-3">Tallas:</p> : <p />}
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
								size="large"
								min={1}
								max={categoria === 'ropa' ? tallas.cantidad : numeros.cantidad}
								defaultValue={1}
								onChange={categoria === 'ropa' ? obtenerCantidadTalla : obtenerCantidadNumero}
								style={{ width: 130 }}
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
				<div className="d-flex justify-content-center">
					<div>
						<Button
							className="d-block"
							type="primary"
							size="large"
							style={{ width: 200 }}
							onClick={() => showConfirm()}
						>
							<TagsOutlined style={{ fontSize: 20 }} />
							Comprar ahora
						</Button>
						<Button
							className="mt-3 d-block"
							size="large"
							style={{ width: 200 }}
							onClick={() => showModal()}
						>
							<BellOutlined style={{ fontSize: 20 }} />
							Apartar
						</Button>
						<Button className="mt-3 d-block" size="large" style={{ width: 200 }} onClick={() => Carrito()}>
							<ShoppingCartOutlined style={{ fontSize: 20 }} />
							Agregar al carrito
						</Button>
					</div>
				</div>
			</div>
			<Modal
				title="Nuevo Apartado"
				visible={visible}
				onOk={handleOk}
				onCancel={handleCancel}
				cancelText="Cancelar"
				okText="Apartar"
			>
				<div className="row">
					<div className="col-12 col-lg-6">
						<div className="mb-3">
							<h6 className="d-inline">Porducto: </h6>
							<p className="d-inline">{productos.nombre}</p>
						</div>

						{numeros.length !== 0 ? (
							<div className="mb-3">
								<h6 className="d-inline">Medida: </h6>
								<p className="d-inline">{numeros.numero}</p>
							</div>
						) : tallas.length !== 0 ? (
							<div className="mb-3">
								<h6 className="d-inline">Talla: </h6>
								<p className="d-inline">{tallas.talla}</p>
							</div>
						) : (
							<p className="d-inline" />
						)}
						<div className="mb-3">
							<h6 className="d-inline">Cantidad: </h6>
							<p className="d-inline">{cantidadFinal}</p>
						</div>
						{!productos.promocion ? (
							<div className="mb-3">
								<h6 className="d-inline">Precio: </h6>
								<p className="d-inline">${formatoMexico(productos.precio)}</p>
							</div>
						) : (
							productos.promocion.map((res) => {
								return (
									<div key={res._id} className="mb-3">
										<h6 className="d-inline">Precio: </h6>
										<p className="d-inline">${formatoMexico(res.precioPromocion)}</p>
									</div>
								);
							})
						)}
						<div className="mb-3">
							<h6>Elegir tipo de envío: </h6>
							<Select style={{ width: 200 }} placeholder="Select a person" onChange={obtenerTipoEnvio}>
								<Option value="ENVIO">Envio por paqueteria</Option>
								<Option value="REGOGIDO">Recoger a sucursal</Option>
							</Select>
						</div>
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
			</Modal>
		</Spin>
	);
}
export default TallasCantidades;
