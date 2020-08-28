import React, { useState } from 'react';
import Ofertas from './Carusel_ofertas/ofertas'
import ConsultaProductos from './Productos/consulta_productos'
import Geolocalizacion from './geolocalizacion'
import Datos_tienda from './Datos_tienda/datos_tienda'

export default function Home(props) {
    const [lat] = useState("19.767980")
    const [lng] = useState("-104.358159")

	return (
		<div>
			<Ofertas />
			<ConsultaProductos propiedades={props} />
            {/* <Geolocalizacion 
                height="60vh"
                width="100%"
                center={[lat, lng]}
                titleLayer={'map'}
                zoom={15}
                apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                nombreMarcador = "AB soluciones Empresariales"
            /> */}
            <Datos_tienda />
		</div>
	);
}
