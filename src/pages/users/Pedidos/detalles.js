import React from 'react';
import { Tag, Divider,Button,Col,Card } from 'antd';
import {formatoFecha,formatoMexico} from '../../../config/reuserFunction';
import { Link } from 'react-router-dom';

const gridStyle = { width: '100%', padding: 0, marginBottom: '1.5rem' };
const { Meta } = Card;


const DetallesPedido = (props) => {

	const {detallePedido} = props;

	console.log(detallePedido);

	return (
		<div className="card-p-pedidos">
			<Divider className="text-center">Detalles del pedido</Divider>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">ID del pedido: </h6>
					<p className=""> {detallePedido._id}  </p>
				</div>

				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Fecha de pedido:</h6>
					<p className=""> {formatoFecha(detallePedido.createdAt)}  </p>
				</div>
				
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">No. de productos:</h6>
					<p className="">x {detallePedido.pedido.length} </p>
				</div>
			</div>

			<div className="row">
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">El pedido esta:</h6>
					<p>										
						<Tag
							className="my-2"
							color={detallePedido.estado_pedido === 'En proceso' ? '#f0ad4e' : '#5cb85c'}
						>
							{detallePedido.estado_pedido}
						</Tag></p>
				</div>
				<div className="my-2 col-lg-4">
					<h6 className="titulos-info-pedidos">Pagado:</h6>
					<p>
						{detallePedido.pagado === false ? 
							(
								<div>
									<p className="text-danger my-2">Pedido cancelado</p>
								</div>
							) : 
							(<p className="text-success my-2">Pedido realizado</p>)}	
					</p>
				</div>

				<div className="my-2 ">
					<h6 className="titulos-info-pedidos">Total:</h6>
					<p className=""> $ { formatoMexico(detallePedido.total)} </p>
				</div>
			</div> 

			<Divider className="text-center">Productos del pedido</Divider>
			<div className="row" >
				{detallePedido.pedido.map((producto) => <Producto producto={producto} />)}
			</div>
			
			<div className="my-2">
				<h6 className="titulos-info-pedidos h4 mt-3">Total: $ { formatoMexico(detallePedido.total)}</h6>
			</div>
		</div>
	);
};

function Producto(props){

	const {producto} = props;

	return(
		<div>
			<Col span={4} key={producto.producto._id} className="col-lg-4 col-sm-12">
				<Link to={`/vista_producto/${producto.producto._id}`}>
					<Card
						hoverable
						style={{ width: 250 }}
						cover={<img alt="example" className="img-fluid" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.producto.imagen}`} />}
					>
						<Meta 
							title={producto.producto.nombre} 
							description={<h2 className="h5 precio-rebaja">${formatoMexico(producto.precio)}</h2>} />
					</Card>
				</Link>
			</Col>
		</div>
	)
}

export default DetallesPedido;