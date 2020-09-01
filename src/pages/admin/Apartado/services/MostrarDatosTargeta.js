import React from 'react'
import {Card, Col,Tag} from 'antd'
import { ContainerOutlined } from '@ant-design/icons';
import {formatoFecha} from '../../../../config/reuserFunction'

import './MostrarDatosTargeta.scss';

const { Meta } = Card;


export default function MostrarDatosTargeta(props) {

    const {setDetalleApartado,showModal,apartado} = props;

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
								Detalle de solicitud de apartado
							</p>
						</div>
					]}
				>
					<Meta
						className="contenedor-card-apartados"
						description={
							<div className="">
								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Id apartado: </h6>
									<p className="data-info-apartados">{apartado._id}</p>
								</div>
								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Pedido el:</h6>
									<p className="data-info-apartados">{formatoFecha(apartado.createdAt)}</p>
								</div>
								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Cliente:</h6>
									<p className="data-info-apartados">{apartado.cliente.nombre}</p>
								</div>
								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Estado:</h6>
									<Tag
										className="data-info-apartados"
										color={apartado.estado === 'ACEPTADO' ?  '#5cb85c' : apartado.estado === 'PROCESANDO' ? '#0275d8' :  apartado.estado === 'ENVIADO' ? "#5cb85c": "#F75048"}
									>
										{apartado.estado}
									</Tag>
								</div>

								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Tipo de entrega:</h6>
									<Tag
										className="data-info-apartados"
										color={apartado.tipoEntrega === 'Envio' ?  '#5cb85c' : '#0275d8'}
									>
										{apartado.tipoEntrega === 'Envio' ? 'Envio a domicilio' : 'Pasaran por el'}
									</Tag>
								</div>

								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Producto:</h6>
									<p className="data-info-apartados">{apartado.producto.nombre}</p>
								</div>
								<div className="sistema-apartado m-2">
									<h6 className="titulos-info-apartados">Cantidad de articulos:</h6>
									<p className="data-info-apartados">{apartado.cantidad}</p>	
								</div>
							</div>
						}
					/>
				</Card>
			</Col>
    )
}
