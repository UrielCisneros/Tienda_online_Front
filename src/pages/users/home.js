import React, { useState } from 'react';
import Carousel from './Carusel_ofertas/carousel';
import ConsultaProductos from './Productos/consulta_productos';
import Geolocalizacion from './geolocalizacion';
import Ofertas from './Ofertas/ofertasHome';

export default function Home(props) {
    const [lat] = useState("19.767980")
    const [lng] = useState("-104.358159")

	return (
		<div>
			<Carousel />
			<ConsultaProductos propiedades={props} />
            <Ofertas />
            <Geolocalizacion 
                height="60vh"
                width="100%"
                center={[lat, lng]}
                titleLayer={'map'}
                zoom={15}
                apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                nombreMarcador = "AB soluciones Empresariales"
                tituloheader={true}
                draggable={false}
            />
		</div>
	);
}
