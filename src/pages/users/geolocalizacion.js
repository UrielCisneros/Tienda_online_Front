import React, { useEffect } from 'react';

export default function Geolocalizacion({height, width, center, titleLayer, zoom, apikey, nombreMarcador}) {
    
    useEffect(() => {
        //api key
        window.L.mapquest.key = apikey;

        var container = window.L.DomUtil.get('map');
        if(container != null){
        container._leaflet_id = null;
        }

        //inicializar el map
        const map = window.L.mapquest.map('map', {
            center,
            layers: window.L.mapquest.tileLayer(titleLayer),
            zoom
          });

          console.log(map);

          window.L.marker(center, {
            icon: window.L.mapquest.icons.marker(),
            draggable: true
          }).bindPopup(nombreMarcador).addTo(map);

          map.addControl(window.L.mapquest.control());
          console.log(window.L.mapquest.control())
    })

	return (
		<div>
            <div className="bg-dark" style={{height: '5vh'}}>
                <h3 className="text-white text-center h2 m-3">Encuentra nuestra tienda</h3>
            </div>
            <div id="map" style={{height, width}} className="d-flex justify-content-center align-items-center">
                <div className="spinner-border display-3"  style={{width: '10rem',height: '10rem'}} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
		    </div>
        </div>
	);
}
