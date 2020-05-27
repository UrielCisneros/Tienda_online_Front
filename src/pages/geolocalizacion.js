import React, { useEffect } from 'react';

export default function Geolocalizacion({height, width, center, titleLayer, zoom, apikey, nombreMarcador}) {
    
    useEffect(() => {
        //api key
        window.L.mapquest.key = apikey;

        //inicializar el map
        const map = window.L.mapquest.map('map', {
            center,
            layers: window.L.mapquest.tileLayer(titleLayer),
            zoom
          });

          window.L.marker(center, {
            icon: window.L.mapquest.icons.marker(),
            draggable: false
          }).bindPopup(nombreMarcador).addTo(map);

          map.addControl(window.L.mapquest.control());
    })

	return (
		<div>
            <div className="bg-dark" style={{height: '20vh'}}>
                <h3 className="text-white text-center display-1">Encuentra nuestra tienda</h3>
            </div>
            <div id="map" style={{height, width}} className="d-flex justify-content-center align-items-center">
                <div class="spinner-border display-3"  style={{width: '10rem',height: '10rem'}} role="status">
                    <span class="sr-only">Loading...</span>
                </div>
		    </div>
        </div>
	);
}
