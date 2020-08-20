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

function VistaProductos(props) {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const producto = props.match.params.url;

	useEffect(() => {
		async function obtenerProducto() {
			setLoading(true);
			await clienteAxios
				.get(`/productos/${producto}`)
				.then((res) => {
					setProductos(res.data);
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
		obtenerProducto();
  }, []);

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
							<div style={{ fontSize: 18 }}>
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
					<div className="col-lg-4 border-left">
						<h1 className="titulo-principal">Productos 100% mexicanos de Mexico</h1>
						<p className="titulo-precio">$ 1,500</p>
						<Divider />
						<p className="">Producto Disponible</p>
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
