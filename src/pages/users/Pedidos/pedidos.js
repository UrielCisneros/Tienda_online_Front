import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import DetallesPedido from './detalles';
import {formatoFecha} from '../../../config/reuserFunction';
import "./pedidos.scss";



import { Card, Col, Row, Spin, Modal,  Tag, Button, Divider,List,Space,Result } from 'antd';
import { ContainerOutlined, EditOutlined,DeleteOutlined } from '@ant-design/icons';

const { Meta } = Card;



export default function PedidosUsuario(props) {
	const [ pedidos, setPedidos ] = useState([]);
	const [ visible, setVisible ] = useState(false);
	const [ loading, setLoading ] = useState(false);
	const [ showInfo, setshowInfo ] = useState(false);

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

	    //Verificar el JWT
		if(token === '' || token === null){
			props.history.push('/entrar')
		}else if(decoded['rol'] !== false){
			props.history.push('/')
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
			console.log(res);
			if(res.data.length > 0){
				setPedidos(res.data);
				setshowInfo(true);
			}
			setLoading(false);
		})
		.catch((err) => {
			console.log(err);
		});
	}

    useEffect(() => {
		obtenerPedidos();
		  setLoading(true);
		  setPedidos([]);
		  setshowInfo(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    return(
		<Spin size="large" spinning={loading}>
			<div className= "container">
				<h4>Compras</h4>
				<div>
					{showInfo !== true ? (
						<Result
							status="404"
							title="Parece que aun no tienes compras"
							subTitle="Ve y realiza tus compras para poder verlas"
						/>
					):(
						<div>
							<List
								size="large"
								dataSource={pedidos}
								renderItem={pedido => <Pedido pedido={pedido} />}
							/>
						</div>
						
					)}
					
				</div>
			</div>
		</Spin>
    )
}

function Pedido(props){
	const {pedido} = props;

	console.log(pedido);
	
	return(
		<div>
			<List.Item
				key={pedido._id}
				className="d-flex justify-content-center align-items-center m-5"
				actions={[
						<Button
							className="d-flex justify-content-top align-items-top "
							style={{ fontSize: 16 }}
							type="primary"
						>
							<EditOutlined />
							Detalle del pedido
						</Button>					
				]}
			>
				<List.Item.Meta
					avatar={
						<div
							className="d-flex justify-content-center align-items-center mr-2"
							style={{ width: 100, height: 100 }}
						>
							<p>Pedido del producto sdsdsdsd</p>
							<img
								className="imagen-promocion-principal"
								alt="producto"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${pedido.pedido[0].producto.imagen}`}
							/>
							
						</div>
					}
					title={
						<div className="titulo-producto row mostrar-pedido">

							<div className="col-lg-6">
								<p className="m-0 font-weight-bold" style={{fontSize:"15px"}} >Productos de la compra:  x {pedido.pedido.length} </p>
								<p className="m-0" style={{fontSize:"15px"}}>
									<span className="font-weight-bold">La compra esta:</span>
										<Tag
											className="ml-2"
											color={pedido.estado_pedido === 'En proceso' ? '#f0ad4e' : '#5cb85c'}
										>
											{pedido.estado_pedido}
										</Tag>
									
								</p>
								<p className="m-0" style={{fontSize:"15px"}}><span className="font-weight-bold">Total de la compra: $</span>{pedido.total}  </p>
								<p className="m-0" style={{fontSize:"15px"}}><span className="font-weight-bold">Pedido el:</span> {formatoFecha(pedido.createdAt)}</p>
								<p className="m-0" style={{fontSize:"15px"}}>{pedido.pagado === false ? 
								(
									<div>
										<p className="text-danger">Pedido cancelado</p>
										<Button
											className="d-flex justify-content-center align-items-center"
											style={{ fontSize: 16 }}
											type="primary"
										>
										Comprar
									</Button>
									</div>
								) : 
								(<p className="text-success">Pedido realizado</p>)} </p>
							</div>
							<div className="col-lg-6">
								<p className="m-0 font-weight-bold h3" style={{fontSize:"15px"}} >Mensaje de la tienda:</p>
								<p className="mt-2" style={{fontSize:"15px"}}>{pedido.mensaje_admin ? pedido.mensaje_admin : "Tu pedido esta en procesado, si tienes alguna duda no dudes en contactarnos!!"}</p>
							</div>
						</div>
					}
				/>
			</List.Item>
		</div>
	)
}
