import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Card, Col, Row, Spin, notification, Result } from 'antd';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return number.toString().replace(exp, rep);
	}
};

function ResultadoBusqueda(props) {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const url = props.match.params.url;

	useEffect(
		() => {
			async function obtenerProductosFiltrados() {
				setLoading(true);
				await clienteAxios
					.get(`/productos/search/${url}`)
					.then((res) => {
						setProductos(res.data.posts);
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
			obtenerProductosFiltrados();
		},
		[ url ]
	);

	function agregarPorcentaje(precio_descuento, precio_producto) {
		var porcentaje = Math.round(precio_descuento / precio_producto * 100);
		var descuento = 100 - porcentaje;
		return descuento;
	}

	const render = productos.map((productos) => (
		<Col span={32} key={productos._id}>
			<Card.Grid hoverable style={gridStyle}>
				<Card
					style={{ width: 300, maxHeight: 400 }}
					cover={
						<div className="d-flex justify-content-center align-items-center" style={{ height: 250 }}>
							<img
								className="img-fluid"
								alt="producto"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos.imagen}`}
								style={{ maxHeight: '99%', maxWidth: '99%' }}
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
									<h2 className="h5 precio-producto d-inline mr-2">${formatoMexico(productos.precio)}</h2>
									<h2 className="h5 precio-rebaja d-inline mr-2">${formatoMexico(promo.precioPromocion)}</h2>
									<p className="h4 porcentaje-descuento d-inline mr-2">
										{agregarPorcentaje(
											promo.precioPromocion,
											productos.precio
										)}%OFF
									</p>
								</div>
							);
						})
					)}
				</Card>
			</Card.Grid>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<h3 className="ml-5 mt-4 mb-4">
				{productos.length} Resultados de la busqueda "{url}"
			</h3>
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
		</Spin>
	);
}

export default ResultadoBusqueda;
