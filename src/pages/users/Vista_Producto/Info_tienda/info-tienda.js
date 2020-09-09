import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../../config/axios';
import { Spin, Avatar } from 'antd';
import './info-tienda.scss';
import Geolocalizacion from '../../../../pages/users/geolocalizacion';
import { withRouter } from 'react-router-dom';

const InfoTienda = (props) => {
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
				setLoading(false);
				console.log(res)
			});
	}

	if (tienda.length === 0) {
		return null;
	}

	return (
		<Spin spinning={loading}>
			<div className="contenedor-info-tienda">
			<p className="titulos-vista-productos text-center">Encuentra nuestra tienda</p>
			<div className="text-center">
				<Avatar size={64} src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${tienda.imagenLogo}`} />
				<div className="text-center">
					<p style={{fontSize: 20}}>{tienda.nombre}</p>
				</div>
			</div>
			{tienda.length !== 0 ? (
				tienda.direccion.map((direccion) => {
					return (
						<div key={direccion._id} className="container">
							<p className="direccion-tienda-vista-producto">
								Dirección: {direccion.calle_numero}, Col. {direccion.colonia}, {direccion.ciudad},{' '}
								{direccion.cp}
							</p>
							<p className="direccion-tienda-vista-producto">
								Telefono: {tienda.telefono}
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
			</div>
		</Spin>
	);
};

export default withRouter(InfoTienda);
