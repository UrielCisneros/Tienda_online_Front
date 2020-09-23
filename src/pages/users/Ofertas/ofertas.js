import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import { Card, Spin, Result, Col, Row } from 'antd';
import Pagination from '../../../components/Pagination/pagination';
import queryString from 'query-string';
import { Link, withRouter } from 'react-router-dom';
import { formatoMexico, agregarPorcentaje } from '../../../config/reuserFunction';
import './ofertas.scss';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };

function Ofertas(props) {
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);
	const [ productosPaginacion, setProductosPaginacion ] = useState([]);

	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

	useEffect(
		() => {
            obtenerProductos(40, page);
            window.scrollTo(0, 0);
		},
		[ page ]
	);

	async function obtenerProductos(limit, page) {
		setLoading(true);
		await clienteAxios
			.get(`/productos/promociones?limit=${limit}&page=${page}`)
			.then((res) => {
				setProductos(res.data.posts.docs);
				setProductosPaginacion(res.data.posts);
				setLoading(false);
			})
			.catch((res) => {
				console.log(res)
				props.history.push('/error500');
			});
	}
{/* <div className="contenedor-card-ofertas" key={productos._id}> */}
	const render = productos.map((productos) => (
		<Col span={window.screen.width < 768 ? 12 : 4} key={productos._id}>
			<Link to={`/vista_producto/${productos.productoPromocion._id}`}>
				<Card.Grid hoverable style={gridStyle} className="contenedor-card-producto-principal">
					<Card
						bodyStyle={{ padding: 10, backgrounddivor: '#F7F7F7' }}
						className="contenedor-card-body"
						cover={
							<div className="contenedor-imagen-producto-principal">
								<img
									className="imagen-producto-principal"
									alt="producto"
									src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${productos
										.productoPromocion.imagen}`}
								/>
							</div>
						}
					>
						<div className="contenedor-titulos-productos titulo-elipsis">
							<h1 className="titulo-producto">{productos.productoPromocion.nombre}</h1>
						</div>
						<div className="contenedor-precios-productos">
							<h2 className="h5 precio-producto rebajado mr-2">${formatoMexico(productos.productoPromocion.precio)}</h2>
							<h2 className="h5 precio-rebaja d-inline mr-1">${formatoMexico(productos.precioPromocion)}</h2>
							<p className="h4 porcentaje-descuento d-inline">
								{agregarPorcentaje(productos.precioPromocion, productos.productoPromocion.precio)}%OFF
							</p>
						</div>
					</Card>
				</Card.Grid>
			</Link>
		</Col>
	));

	return (
		<Spin size="large" spinning={loading}>
			<div className="principal-ofertas">APROVECHA NUESTROS DESCUENTOS!</div>
			<div className="d-flex justify-content-center align-items-center">
				<div className="">
					<Row gutter={8} style={{ maxWidth: '90vw' }} className=" mt-4">
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

export default withRouter(Ofertas);
