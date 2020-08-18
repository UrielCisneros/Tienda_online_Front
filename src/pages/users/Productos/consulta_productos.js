import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Card, Col, Row, Spin, notification, Result } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import './productos.scss';

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

function ConsultaProductos(props) {
    const { location, history } = props.propiedades
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(() => {
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
		obtenerProductos(20, page);
	}, [page]);

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
					<div className="contenedor-titulos-productos">
						<h1 className="titulo-producto">{productos.nombre}</h1>
						<h2 className="h5 text-success">{formatoMexico(productos.precio)}</h2>
					</div>
				</Card>
			</Card.Grid>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<div className="principal-productos">NUESTROS PRODUCTOS</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={45} style={{ maxWidth: '90vw' }} className="mt-4">
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
