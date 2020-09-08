import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import '../vistas.scss';
import ImageScroller from 'react-image-scroller';
import { Card, Col, Spin } from 'antd';
import { formatoMexico, agregarPorcentaje } from '../../../../config/reuserFunction'

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };
const properties = {
	hideScrollbar: false,
	scrollOnClick: false,
	scrollWithArrows: true
};

function Scroll(props) {
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);
	const producto = props.productos;

	useEffect(() => {
		setLoading(true);
		clienteAxios
			.get(`/productos/search?nombre=${producto.nombre}&categoria=${producto.categoria}&subcategoria=${producto.subCategoria}`)
			.then((res) => {
				setProductos(res.data.posts);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [producto]);

	const render = productos.map((productos) => (
		<Col span={32} key={productos._id}>
				<Card.Grid hoverable style={gridStyle}>
					<Card
						onClick={() => (window.location.href = `/vista_producto/${productos._id}`)}
						bodyStyle={{ padding: 22, backgroundColor: '#F7F7F7' }}
						style={{ maxHeight: 300, width: 300, cursor: 'pointer' }}
						cover={
							<div className="d-flex justify-content-center align-items-center" style={{ height: 220 }}>
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
										<h2 className="h5 precio-producto d-inline mr-2">
											${formatoMexico(productos.precio)}
										</h2>
										<h2 className="h5 precio-rebaja d-inline mr-2">
											${formatoMexico(promo.precioPromocion)}
										</h2>
										<p className="h4 porcentaje-descuento d-inline mr-2">
											{agregarPorcentaje(promo.precioPromocion, productos.precio)}%OFF
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
		<Spin spinning={loading}>
			<div className="mt-5">
				<p className="titulos-vista-productos">Tambien te pueden interesar:</p>
				<div>
					<ImageScroller {...properties}>{render}</ImageScroller>
				</div>
			</div>
		</Spin>
	);
}

export default Scroll;
