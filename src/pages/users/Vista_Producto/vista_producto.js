import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Divider, Row, Col, Tag, Spin, Alert } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import Scroll from './subs/scroll';
import Sugerencia from './subs/sugerencia';
import Galeria from './Galeria_tienda/galeria';
import TallasCantidades from './subs/cantidades_y_tallas';
import InfoTienda from './Info_tienda/info-tienda';
import 'antd/dist/antd.css';
import './vistas.scss';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import DOMPurify from 'dompurify';
import { withRouter } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTruck} from '@fortawesome/free-solid-svg-icons'

function VistaProductos(props) {
	const [ productos, setProductos ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ readMore, setReadMore ] = useState('read-less');
	const producto = props.match.params.url;
	const [ costoEnvio, setCostoEnvio ] = useState([]);

	useEffect(() => {
		obtenerProducto();
		obtenerPoliticasEnvio();
		window.scrollTo(0, 0);
	}, []);

	async function obtenerPoliticasEnvio() {
		await clienteAxios
			.get('/politicasEnvio/')
			.then((res) => {
				setCostoEnvio(res.data);
			})
			.catch((res) => {
				console.log(res);
			});
	}

	async function obtenerProducto() {
		setLoading(true);
		await clienteAxios
			.get(`/productos/${producto}`)
			.then((res) => {
				setProductos(res.data);
				res.data.promocion.forEach((res) => setPromocion(res));
				setLoading(false);
			})
			.catch((res) => {
				console.log(res);
				props.history.push('/error500');
			});
	}

	const OnClickReadMore = () => {
		if (readMore === 'read-less') {
			setReadMore('read-more');
		} else {
			setReadMore('read-less');
		}
	};

	return (
		<Spin size="large" spinning={loading}>
			<div className="container mt-5 shadow caracteristicas ">
				<div className="row mt-5">
					<div className="col-lg-8 imagen-gallery-vista zoom">
						<div id="zoom-render" />
						<div className="mb-5">
							<Galeria id={producto} />
						</div>
						<div className="descripcion-lg">
							<p className="titulos-vista-productos">Descripcion:</p>
							<div
								className={readMore}
								dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productos.descripcion) }}
							/>
							{readMore === 'read-less' ? (
								<p className="texto-ver-mas" onClick={OnClickReadMore}>
									Ver más...
								</p>
							) : (
								<p className="texto-ver-mas" onClick={OnClickReadMore}>
									Ver menos
								</p>
							)}
						</div>
						<Divider />
						{/* ### Componenete de Sugerencia */}
						<div className="descripcion-lg">
							<Sugerencia producto={producto} />
						</div>
					</div>
					<div className="col-lg-4 border-left">
						<h1 className="titulo-principal">{productos.nombre}</h1>
						{promocion.length === 0 ? (
							<p className="titulo-precio-tachado precio-rebaja titulo-precio">
								$ {formatoMexico(productos.precio)}
							</p>
						) : (
							<div>
								<p className="titulo-precio-tachado precio-producto">
									$ {formatoMexico(productos.precio)}
								</p>
								<p className="titulo-precio precio-rebaja d-inline mr-3">
									$ {formatoMexico(promocion.precioPromocion)}
								</p>
								<p className="titulo-porcentaje porcentaje-descuento d-inline mr-2">
									{agregarPorcentaje(promocion.precioPromocion, productos.precio)}% OFF
								</p>
							</div>
						)}
						{costoEnvio ? (
							<div>
								<p style={{ fontSize: 20 }}><FontAwesomeIcon icon={faTruck} style={{fontSize: 20, marginRight: 10}} />Envío: <strong>${costoEnvio.costoEnvio}</strong></p>
								{costoEnvio.promocionEnvio ? (
									<Alert
										message={`Si supera $${costoEnvio.promocionEnvio} en su compra, se le descontraran $${costoEnvio.descuento} en su compra`}
										type="success"
										showIcon
									/>
								) : (
									<div />
								)}
							</div>
						) : (
							<div className="d-none" />
						)}
						<Divider />
						<TallasCantidades producto={productos} /> {/* Componente tallas */}
						<Divider />
						<p className="mb-3" style={{ fontSize: 20 }}>
							<CreditCardOutlined style={{ fontSize: 25 }} className="mr-2" />
							Formas de Pago
						</p>
						<div className="contenedor-img-tarjetas">
							<img
								alt="tarjetas de credito"
								className="img-tarjetas"
								src="https://www.paymentmedia.com/gallery/5b927b5d6fc472000px-Mastercard-logo.svg.jpg"
							/>
							<img
								alt="tarjetas de credito"
								className="img-tarjetas"
								src="https://logos-marcas.com/wp-content/uploads/2020/04/Visa-Logo.png"
							/>
						</div>
						<Divider />
						<div className="descripcion-sm">
							<Divider />
							<p className="titulos-vista-productos text-center">Descripcion:</p>
							<div style={{ fontSize: 18, textAlign: 'justify' }} className="px-3">
								<div
									className={readMore}
									dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(productos.descripcion) }}
								/>
								{readMore === 'read-less' ? (
									<p className="texto-ver-mas" onClick={OnClickReadMore}>
										Ver más...
									</p>
								) : (
									<p className="texto-ver-mas" onClick={OnClickReadMore}>
										Ver menos
									</p>
								)}
							</div>
						</div>
						<Divider />
						<InfoTienda />
						{/* Componente informacion de la tienda */}
					</div>
					<div className="descripcion-sm">
						<Sugerencia producto={producto} />
					</div>
				</div>
				{/* ### Componenete de productos similares */}
				<Row className="mt-5">
					<Col span={24}>
						<Scroll productos={productos} />
					</Col>
				</Row>
			</div>
		</Spin>
	);
}

export default withRouter(VistaProductos);
