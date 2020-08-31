import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Divider, Row, Col, notification, Spin } from 'antd';
import { CreditCardOutlined, ShoppingCartOutlined, TagsOutlined, BellOutlined } from '@ant-design/icons';
import Scroll from './subs/scroll';
import Sugerencia from './subs/sugerencia';
import Galeria from './Galeria_tienda/galeria';
import TallasCantidades from './subs/cantidades_y_tallas';
import InfoTienda from './Info_tienda/info-tienda';
import 'antd/dist/antd.css';
import './vistas.scss';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import DOMPurify from 'dompurify';

function VistaProductos(props) {
	const [ productos, setProductos ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const [ readMore, setReadMore ] = useState('read-less');
	const producto = props.match.params.url;

	useEffect(() => {
		obtenerProducto();
	}, []);

	function obtenerProducto() {
		setLoading(true);
		clienteAxios
			.get(`/productos/${producto}`)
			.then((res) => {
				setProductos(res.data);
				res.data.promocion.forEach((res) => setPromocion(res));
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
			<div className="container mt-5 border caracteristicas">
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
						<Divider />
						<p>
							<CreditCardOutlined style={{ fontSize: 20 }} className="mr-2" />
							Formas de Pago
						</p>
						<Divider />
						<TallasCantidades producto={productos} /> {/* Componente tallas */}
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
						<Scroll productos={productos}/>
					</Col>
				</Row>
			</div>
		</Spin>
	);
}

export default VistaProductos;
