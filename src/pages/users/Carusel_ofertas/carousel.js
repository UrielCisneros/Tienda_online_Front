import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './ofertas.scss';
import clienteAxios from '../../../config/axios';
import { withRouter } from 'react-router-dom';

function CarouselOfertas(props) {
	const [ index, setIndex ] = useState(0);
	const [ carousels, setCarousels ] = useState([]);
	const [ esPromocion, setEsPromocion ] = useState(false);

	useEffect(() => {
		const obtenerCarousel = async () => {
			await clienteAxios
				.get('/carousel/limite')
				.then((res) => {
					setCarousels(res.data);
				})
				.catch((res) => {
				});
		};
		const obtenerPromociones = async () => {
			await clienteAxios
				.get('/productos/promocion/carousel')
				.then((res) => {
					if (res.data.length === 0) {
						setEsPromocion(false);
						obtenerCarousel();
					} else {
						setEsPromocion(true);

						setCarousels(res.data);
					}
				})
				.catch((res) => {
					console.log(res)
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
					<div className="contenedor-imagen-principal-promociones">
						<img
							onClick={() => props.history.push(`/vista_producto/${esPromocion
								? carousel.productoPromocion._id
								: carousel.producto._id}`)}
							className="imagen-carousel-promociones-principal"
							src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${esPromocion
								? carousel.imagenPromocion
								: carousel.imagen}`}
							alt="img-oferta"
							style={{cursor: 'pointer'}}
						/>
					</div>
				</div>
			</Carousel.Item>
		);
	});

	return (
		<Carousel activeIndex={index} onSelect={handleSelect}>
			{render}
		</Carousel>
	);
}

export default withRouter(CarouselOfertas);
