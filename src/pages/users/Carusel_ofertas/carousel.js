import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './ofertas.scss';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';
import { Spin } from 'antd';

function CarouselOfertas(props) {
	const [ index, setIndex ] = useState(0);
	const [ loading, setLoading ] = useState(false);
	const [ carousels, setCarousels ] = useState([]);
	const [ esPromocion, setEsPromocion ] = useState(false);

	useEffect(() => {
		const obtenerCarousel = async () => {
			setLoading(true);
			await clienteAxios
				.get('/carousel/limite')
				.then((res) => {
					setLoading(false);
					setCarousels(res.data);
				})
				.catch((res) => {
					setLoading(false);
				});
		};
		const obtenerPromociones = async () => {
			setLoading(true);
			await clienteAxios
				.get('/productos/promocion/carousel')
				.then((res) => {
					if (res.data.length === 0) {
						setEsPromocion(false);
						obtenerCarousel();
					} else {
						setEsPromocion(true);
						setLoading(false);
						setCarousels(res.data);
					}
				})
				.catch((res) => {
					setLoading(false);
				});
		};
		obtenerPromociones();
	}, []);

	const handleSelect = (selectedIndex, e) => {
		setIndex(selectedIndex);
	};

	const render = carousels.map((carousel) => {
		return (
			<Carousel.Item key={carousel._id}>
				<div className="carousel-home">
					<div className="background-carousel" style={{
						backgroundImage: `url(https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${esPromocion
							? carousel.imagenPromocion
							: carousel.imagen})`
					}}/>
					<div className="contenedor-imagen-principal">
						<img
							onClick={() => props.history.push(`/vistaProductos/${esPromocion
								? carousel.productoPromocion._id
								: carousel.producto._id}`)}
							className="imagen-carousel-promociones-principal"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${esPromocion
								? carousel.imagenPromocion
								: carousel.imagen}`}
							alt="img-oferta"
						/>
					</div>
				</div>
			</Carousel.Item>
		);
	});

	return (
		<Spin spinning={loading} size="large">
			<Carousel activeIndex={index} onSelect={handleSelect}>
				{render}
			</Carousel>
		</Spin>
	);
}

export default withRouter(CarouselOfertas);
