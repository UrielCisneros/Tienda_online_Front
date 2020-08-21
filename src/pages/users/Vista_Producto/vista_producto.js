import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import ReadMoreReact from 'read-more-react';
import { InputNumber, Button, Divider, Row, Col, Form, notification, Spin } from 'antd';
import { CreditCardOutlined, ShoppingCartOutlined, TagsOutlined, BellOutlined } from '@ant-design/icons';
import Scroll from './subs/scroll';
import Sugerencia from './subs/sugerencia';
import Galeria from './subs/galeria';
import 'antd/dist/antd.css';
import './vistas.css';

import DOMPurify from 'dompurify';
/* import Parser from 'html-react-parser'; */

function VistaProductos(props) {
	const [ productos, setProductos ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ loading, setLoading ] = useState(false);
  const [ readMore, setReadMore ] = useState('read-less');
  const [ disponibilidad, setDisponibilidad ] = useState();
	const producto = props.match.params.url;

	useEffect(() => {
		async function obtenerProducto() {
			setLoading(true);
			await clienteAxios
				.get(`/productos/${producto}`)
				.then((res) => {
					console.log(res.data);
					setProductos(res.data);
					res.data.promocion.forEach((res) => setPromocion(res));
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
		obtenerProducto();
	}, []);

	const formatoMexico = (number) => {
		if (!number) {
			return null;
		} else {
			const exp = /(\d)(?=(\d{3})+(?!\d))/g;
			const rep = '$1,';
			return number.toString().replace(exp, rep);
		}
	};
	function agregarPorcentaje(precio_descuento, precio_producto) {
		var porcentaje = Math.round(precio_descuento / precio_producto * 100);
		var descuento = 100 - porcentaje;
		return descuento;
	}

	const OnClickReadMore = () => {
		if (readMore === 'read-less') {
			setReadMore('read-more');
		} else {
			setReadMore('read-less');
		}
	};

/* 	if(productos.tallas && productos.tallas.length){
    var disponible = productos.tallas.map((res) => {
      if(res.cantidad.length !== 0){
        return true
      }
    })
  }else if(productos.numeros && productos.numeros.length){
console.log("numeros")
  }else if(!productos.tallas && !productos.numeros){
    console.log("otros")
  } */


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
					</div>
					<div className="col-lg-4 border-left">
            {/* {!disponible ? 
            <p>Producto no disponible</p> :
            <p />} */}
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
								<p className="titulo-precio precio-rebaja mr-3">$ {formatoMexico(productos.precio)}</p>
								<p className="titulo-porcentaje porcentaje-descuento d-inline mr-2">
									-{agregarPorcentaje(promocion.precioPromocion, productos.precio)}$ OFF
								</p>
							</div>
						)}
						<Divider />
						<div>
							<Form>
								<Form.Item label="Cantidad">
									<InputNumber
										size="large"
										min={1}
										max={10}
										defaultValue={0}
										/* onChange={onChange} */
										style={{ width: 130 }}
									/>
								</Form.Item>
							</Form>
							<div>
								<p className="mt-3">Tallas:</p>
								<div>
									<Button type="dashed" className="talla-vista-producto">
										M
									</Button>
									<Button type="dashed" className="talla-vista-producto">
										Unitalla
									</Button>
									<Button type="dashed" className="talla-vista-producto">
										27.5
									</Button>
								</div>
							</div>
						</div>

						<Divider />

						<p>
							<CreditCardOutlined style={{ fontSize: 20 }} className="mr-2" />
							Formas de Pago
						</p>

						<Divider />
						<div className="d-flex justify-content-center">
							<div>
								<Button className="d-block" type="primary" size="large" style={{ width: 200 }}>
									<TagsOutlined style={{ fontSize: 20 }} />
									Comprar ahora
								</Button>
								<Button className="mt-3 d-block" size="large" style={{ width: 200 }}>
									<BellOutlined style={{ fontSize: 20 }} />
									Apartar
								</Button>
								<Button className="mt-3 d-block" size="large" style={{ width: 200 }}>
									<ShoppingCartOutlined style={{ fontSize: 20 }} />
									Agregar al carrito
								</Button>
							</div>
						</div>
					</div>
					<div className="descripcion-sm">
						<Divider />
						<p className="titulos-vista-productos text-center">Descripcion:</p>
						<div style={{ fontSize: 18, textAlign: 'justify' }} className="px-3">
							<ReadMoreReact
								text={
									'Mi esperanza Mi esperanza es agregar un truncamiento más inteligente al agregar un peso a cada signo de puntuación basado en desgloses promedio de oraciones, para descubrir cuándo es mejor cortar un bloque de texto. Un ejemplo de esto sería darle más peso a un punto que a una coma, de modo que un punto cercano a una coma (aunque más alejado del ideal), pueda convertirse en el punto de corte.'
								}
								min={150}
								ideal={250}
								max={1000}
								readMoreText="Ver mas..."
							/>
						</div>
					</div>
				</div>
				<Divider />
				<Sugerencia />
				{/* ### Componenete de Sugerencia */}
				<Row className="mt-5">
					<Col span={24}>
						<Scroll />
						{/* ### Componenete de productos similares */}
					</Col>
				</Row>
			</div>
		</Spin>
	);
}

export default VistaProductos;
