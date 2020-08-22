import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Card, Col, Row, Spin, notification, Result } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import { Link } from 'react-router-dom';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import './productos.scss';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function ConsultaProductos(props) {
	const { location, history } = props.propiedades;
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(
		() => {
			obtenerProductos(20, page);
		},
		[ page ]
	);

	async function obtenerProductos(limit, page) {
		setLoading(true);
		await clienteAxios
			.get(`/productos?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setProductosPaginacion(res.data.posts);
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

	const render = productos.map((productos) => (
		<Col span={32} key={productos._id}>
			<Link to={`/vista_producto/${productos._id}`}>
				<Card.Grid hoverable style={gridStyle} className="border contenedor-card-producto-principal">
					<Card
						bodyStyle={{ padding: 22, backgroundColor: '#F7F7F7' }}
						className="contenedor-card-body"
						cover={
							<div className="contenedor-imagen-producto-principal">
								<img
									className="imagen-producto-principal"
									alt="producto"
									src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
								/>
							</div>
						}
					>
						{!productos.todos.length ? (
							<div className="contenedor-titulos-productos">
								<h1 className="titulo-producto">{productos.nombre}</h1>
								<h2 className="h5 precio-rebaja">${formatoMexico(productos.precio)}</h2>
							</div>
						) : (
							productos.todos.map((promo) => {
								return (
									<div className="contenedor-titulos-productos" key={promo._id}>
										<h1 className="titulo-producto">{productos.nombre}</h1>
										<h2 className="h5 precio-producto d-inline mr-1">
											${formatoMexico(productos.precio)}
										</h2>
										<h2 className="h5 precio-rebaja d-inline mr-1">
											${formatoMexico(promo.precioPromocion)}
										</h2>
										<p className="h4 porcentaje-descuento d-inline">
											-{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
										</p>
									</div>
								);
							})
						)}
					</Card>
				</Card.Grid>
			</Link>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<div className="principal-productos">NUESTROS PRODUCTOS</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={32} style={{ maxWidth: '90vw' }} className="mt-4">
						{productos.length ? (
							render
						) : (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="Articulo no encontrado" />
							</div>
						)}
					</Row>
				</div>
			</div>
			<Pagination blogs={productosPaginacion} location={location} history={history} />
		</Spin>
	);
}

export default ConsultaProductos;
