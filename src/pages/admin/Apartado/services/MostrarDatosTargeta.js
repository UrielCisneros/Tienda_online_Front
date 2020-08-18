import React from 'react'
import {Card, Col,Tag} from 'antd'
import { ContainerOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

const formatoMexico = (number) => {
	if (!number) {
		return null;
	} else {
		const exp = /(\d)(?=(\d{3})+(?!\d))/g;
		const rep = '$1,';
		return number.toString().replace(exp, rep);
	}
};

const formatoFecha = (fecha) => {
	if (!fecha) {
		return null;
	} else {
		var newdate = new Date(fecha);
		return newdate.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	}
};

export default function MostrarDatosTargeta(props) {

    const {setDetalleApartado,showModal,apartado,showModalEstado} = props;

    return (
            <Col className="mb-3" span={window.screen.width > 990 ? 8 : 24} key={apartado._id}>
				<Card
					className="shadow-sm"
					actions={[
						<div className="d-flex justify-content-center align-items-center">
							<ContainerOutlined className="mr-2" style={{ fontSize: 20 }} />
							<p
								onClick={() => {
									setDetalleApartado(apartado);
									showModal();
								}}
								className="d-inline"
							>
								Detalles del pedido
							</p>
						</div>,
						<div className="d-flex justify-content-center align-items-center">
							<EditOutlined className="mr-2" style={{ fontSize: 20 }} />
							<p
								onClick={() => {
									setDetalleApartado(apartado);
									showModalEstado();
								}}
								className="d-inline"
							>
								Cambiar estado
							</p>
						</div>
					]}
				>
					<Meta
						className="contenedor-card-pedidos"
						description={
							<div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">ID del pedido: </h6>
									<p className="data-info-pedidos">{apartado._id}</p>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Creado el:</h6>
									<p className="data-info-pedidos">{formatoFecha(apartado.createdAt)}</p>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Cliente:</h6>
									<p className="data-info-pedidos">{apartado.cliente.nombre}</p>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Estado:</h6>
									
									<Tag
										className="data-info-pedidos"
										color={apartado.estado === 'ACEPTADO' ?  '#5cb85c' : apartado.estado === 'PROCESANDO' ? '#0275d8' : '#F75048'}
									>
										{apartado.estado}
									</Tag>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Pagado:</h6>
									<Tag
										className="data-info-pedidos"
										color={apartado.pagado === true ? '#5cb85c' : '#f0ad4e'}
									>
										{apartado.pagado === true ? 'Si' : 'No'}
									</Tag>
								</div>
								<div className="my-2">
									<h6 className="titulos-info-pedidos">Total:</h6>
									<p className="precio-total-pedidos data-info-pedidos">
										$ {formatoMexico(apartado.total)}
									</p>
								</div>
							</div>
						}
					/>
				</Card>
			</Col>
    )
}
