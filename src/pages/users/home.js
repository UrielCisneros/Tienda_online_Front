/* eslint-disable react/jsx-pascal-case */
import React, { useState } from 'react';
import Carousel from './Carusel_ofertas/carousel';
import ConsultaProductos from './Productos/consulta_productos';
import Ofertas from './Ofertas/ofertasHome';
import Datos_tienda from './Datos_tienda/datos_tienda'
import bannerProducto from '../../imagenes/Para_CAFI.png'

export default function Home(props) {


	return (
		<div>
			<Carousel />
			<div>
				<img alt="banner-productos" src={bannerProducto} className="banner-producto" />
			</div>
			<ConsultaProductos propiedades={props} />
            <Ofertas />
            <Datos_tienda />
		</div>
	);
}
