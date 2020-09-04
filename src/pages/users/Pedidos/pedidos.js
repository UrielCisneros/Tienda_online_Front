import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import DetallesPedido from './detalles';
import "./pedidos.scss";


import { Card, Col, Row, Spin, Modal,  Tag, Button, Divider } from 'antd';
import { ContainerOutlined, EditOutlined } from '@ant-design/icons';

const { Meta } = Card;



export default function PedidosUsuario() {
	const [ pedidos, setPedidos ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ loading, setLoading ] = useState(false);

    //modal del pedido
    const [ detallePedido, setDetallePedido ] = useState([]);

    const showModal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
		setVisible(false);
	};

	const token = localStorage.getItem('token');
  	var decoded = Jwt(token);
  
	function Jwt(token) {
	try {
		return jwt_decode(token);
	} catch (e) {
		return null;
	}
	}


	async function obtenerPedidos(){
		setLoading(true);
		await clienteAxios
			.get(`/pedidos/${decoded._id}`,{
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		})

			.then((res) => {
			if(decoded._id===null){
				console.log("no hay codigo");
			}
				setPedidos(res.data);
				setLoading(false);
				if (setPedidos() === undefined) {
					console.log("No hay productos");
				}

				console.log(decoded);
			})

			.catch((err) => {
			console.log(err);
			console.log(err.response);
		});
	}

    useEffect(() => {
		obtenerPedidos();
      setLoading(true);
	}, []);
	



    return(
        <div className= "container">
            <h1>Tus pedidos:</h1>


        <Col className="mb-3" span={window.screen.width > 990 ? 8 : 24} >
			<Card
				actions={[
					<div className="">
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
							<div className="my-2 ">
								 <h6 className="titulos-info-pedidos">Cliente:</h6>
								<p className="data-info-pedidos">Brayan Antonio</p>
							</div>
							<Divider/>
							<div className="my-2 mt-3">
								<h6 className="titulos-info-pedidos">ID del pedido: </h6>
								<p className="data-info-pedidos">ASSSSS5S22</p>
							</div>
							<div className="my-2 mt-3">
								<h6 className="titulos-info-pedidos">Hecho el dia:</h6>
								<p className="data-info-pedidos">22 / 05 / 2020</p>
							</div>
							
								
							<div className="my-2 mt-3">
								<h6 className="titulos-info-pedidos">No. de productos:</h6>
								<p className="data-info-pedidos">XXXXX</p>
							</div>

							<div className="my-2 mt-3">
								<h6 className="titulos-info-pedidos">Estado:</h6>
								<Tag
									className="data-info-pedidos"
								>
									<p>Entregado</p>
								</Tag>
							</div>

							<div className="my-2 mt-3">
								<h6 className="titulos-info-pedidos">Pagado:</h6>
								<Tag
									className="data-info-pedidos"
								>
                                    <p>Pagado</p>
								</Tag>
							</div>

							<div className="my-2 mt-3">
								<h6 className="titulos-info-pedidos">Total:</h6>
								<p className="precio-total-pedidos data-info-pedidos">
									10202
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
