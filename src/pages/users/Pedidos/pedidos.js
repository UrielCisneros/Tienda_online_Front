import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../config/axios';
import jwt_decode from 'jwt-decode';
import { withRouter } from 'react-router-dom';
import DetallesPedido from './detalles';
import "./pedidos.scss";


import { Card, Col, Row, Spin, Modal,  Tag, Button, Divider,List,Space,Result } from 'antd';
import { ContainerOutlined, EditOutlined,DeleteOutlined } from '@ant-design/icons';

const { Meta } = Card;



export default function PedidosUsuario() {
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
				/* setshowInfo(true); */
			}
			setLoading(false);
			if (setPedidos() === undefined) {
				console.log("No hay productos");
			}
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
	}, []);
	
	if(decoded === null){
		return null
	}


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
						<Pedido pedidos={pedidos} />
					)}
					
				</div>
			</div>
		</Spin>
    )
}

function Pedido(props){

	const {pedido} = props;



	return(
		<div>
		<List.Item
			key=""
			className="d-flex justify-content-center align-items-center"
			actions={[
				<Space>
					<Button
						className="d-flex justify-content-center align-items-center"
						style={{ fontSize: 16 }}
						type="primary"
						onClick={() => {
/* 							setActualizar();
							setProductoID(productos._id); */
						}}
					>
						<EditOutlined />
						Actualizar
					</Button>

{/* 					<Button
						className="d-flex justify-content-center align-items-center"
						danger
						style={{ fontSize: 16 }}
						onClick={() => {
							 showDeleteConfirm(productos._id); 
						}}
					>
						<DeleteOutlined />
						Eliminar
					</Button> */}
				</Space>
			]}
		>
			<List.Item.Meta
				avatar={
					<div
						className="d-flex justify-content-center align-items-center mr-2"
						style={{ width: 100, height: 100 }}
					>
						<img
							className="imagen-promocion-principal"
							alt="producto"
							src={`https://www.redwolf.in/image/catalog/artwork-Images/mens/itachi-naruto-t-shirt-artwork-india.png`}
						/>
					</div>
				}
				title={
					<div className="titulo-producto">
						<p className="h6">Perro</p>
						<p className="h6">
							modelo
						</p>
						<p className="h6">Precio men</p>
						<p className="h6">
							Peerro
						</p>
					</div>
				}
			/>
		</List.Item>
		</div>
	)
}
