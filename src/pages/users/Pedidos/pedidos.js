import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import "./pedidos.scss";

import { Card, Col, Row, Modal, notification, Result, Spin, Radio, Tag, Button } from 'antd';
import { ContainerOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function PedidosUsuario() {
    return(
        <div>
            <h1>Tus pedidos:</h1>


            <Col className="mb-3"  span={window.screen.width > 990 ? 8 : 24}>
			<Card
				actions={[
					<div className="d-flex justify-content-center align-items-center">
						<ContainerOutlined className="mr-2" style={{ fontSize: 20 }} />
						<p
							onClick={() => {
				                }}
							className="d-inline"
						>
							Detalles del pedido
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
                                    <p>tags</p>
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
        </div>
    )
}
