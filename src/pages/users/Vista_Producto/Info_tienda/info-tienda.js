import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../../config/axios';
import { notification, Spin, Avatar, Row } from 'antd';
import './info-tienda.scss';
import Geolocalizacion from '../../../../pages/users/geolocalizacion';

const InfoTienda = () => {
	const [ loading, setLoading ] = useState(false);
	const [ tienda, setTienda ] = useState([]);

	useEffect(() => {
		obtenerTienda();
	}, []);

	async function obtenerTienda() {
		setLoading(true);
		await clienteAxios
			.get(`/tienda/`)
			.then((res) => {
				res.data.forEach((element) => setTienda(element));
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

	if (tienda.length === 0) {
		return null;
	}

	return (
		<Spin spinning={loading}>
			<p className="titulos-vista-productos text-center">Ubicación</p>
			{tienda.length !== 0 ? (
				tienda.direccion.map((direccion) => {
					return (
						<div key={direccion._id} className="container">
							<p className="direccion-tienda-vista-producto">
								Dirección: {direccion.calle_numero}, Col. {direccion.colonia}, {direccion.ciudad},{' '}
								{direccion.cp}
							</p>
						</div>
					);
				})
			) : (
				<p />
			)}
			{tienda.length !== 0 ? (
				tienda.ubicacion.map((ubicacion) => {
					return (
						<div key={ubicacion._id}>
							<Geolocalizacion
								height="50vh"
								width="100%"
								center={[ ubicacion.lat, ubicacion.lng ]}
								titleLayer={'map'}
								zoom={16}
								apikey="I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V"
								nombreMarcador="AB soluciones Empresariales"
								tituloheader={false}
								draggable={false}
							/>
						</div>
					);
				})
			) : (
				<p />
			)}
		</Spin>
	);
};

export default InfoTienda;
