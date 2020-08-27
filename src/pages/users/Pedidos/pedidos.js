import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import DetallesPedido from './detalles';
import "./pedidos.scss";


import { Card, Col, Row, Spin, Modal,  Tag, Button } from 'antd';
import { ContainerOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;



export default function PedidosUsuario() {

	const token = localStorage.getItem('token');
	var decoded = Jwt(token);

	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
	}

	const [ pedidos, setPedidos ] = useState([]);
    const [ visible, setVisible ] = useState(false);

    //modal del pedido
    const [ detallePedido, setDetallePedido ] = useState([]);

    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
		setVisible(false);
	};


    return(
        <div className= "container-fluid">
            <h1>Tus pedidos:</h1>


            <Col className="mb-3"  span={window.screen.width > 990 ? 8 : 24}>
			<Card
				actions={[
					<div className="d-flex justify-content-center align-items-center">
						<ContainerOutlined className="mr-2" style={{ fontSize: 20 }} />
							<p
							onClick={() => {
								setDetallePedido();
								showModal();
							}}
							className="d-inline"
						>
							Detalles de mi pedido
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
								<p className="data-info-pedidos"> </p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Creado el:</h6>
								<p className="data-info-pedidos"></p>
							</div>
							
                            <p>Fceha de envio</p>
                        
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Cliente:</h6>
								<p className="data-info-pedidos"></p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">No. de productos:</h6>
								<p className="data-info-pedidos"></p>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Estado:</h6>
								<Tag
									className="data-info-pedidos"
								>
									<p>tags 1</p>
								</Tag>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Pagado:</h6>
								<Tag
									className="data-info-pedidos"
								>
                                    <p>Pagado</p>
								</Tag>
							</div>
							<div className="my-2">
								<h6 className="titulos-info-pedidos">Total:</h6>
								<p className="precio-total-pedidos data-info-pedidos">
									
								</p>
							</div>
						</div>
					}
				/>
			</Card>
		</Col>


        <Modal
				key="detalle"
				width={600}
				style={{ top: 0 }}
				title="Detalles de este pedido"
				visible={visible}
				onCancel={handleCancel}
				footer={[
					<Button key="detalle" type="primary" onClick={handleCancel}>
						Cerrar
					</Button>
				]}
			>
				<DetallesPedido datosDetalle={detallePedido}/>
			</Modal>
        </div>
    )
}
