import React from 'react';
import { Tag, Divider } from 'antd';


const DetallesPedido = (props) => {
	const pedido = props.datosDetalle;

	return (
		<div className="card-p-pedidos">
			<Divider className="text-center">Detalles del pedido</Divider>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">ID del pedido: </h6>
				<p className="data-info-pedidos"></p>
			</div>

			<div className="my-2">
				<h6 className="titulos-info-pedidos">Fecha de pedido:</h6>
				<p className="data-info-pedidos"></p>
			</div>
			
			<div className="my-2">
				<h6 className="titulos-info-pedidos">No. de productos:</h6>
				<p className="data-info-pedidos"></p>
			</div>
            
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Estado:</h6>
				<Tag className="data-info-pedidos">
					Si
				</Tag>
			</div>

			<div className="my-2">
				<h6 className="titulos-info-pedidos">Pagado:</h6>
				<Tag className="data-info-pedidos">
					Si
				</Tag>
			</div>

			<div className="my-2">
				<h6 className="titulos-info-pedidos">Total:</h6>
				<p className="precio-total-pedidos data-info-pedidos"></p>
			</div>


			<Divider className="text-center">Detalles del cliente</Divider>

			<div className="my-2">
				<h6 className="titulos-info-pedidos">Cliente:</h6>
				<p className="data-info-pedidos"></p>
			</div>
			<div className="my-2">
				<h6 className="titulos-info-pedidos">Email:</h6>
				<p className="data-info-pedidos"></p>
			</div>
           

			<Divider className="text-center">Detalles del producto</Divider>
            
			<h2>Detalles de cada producto con funciones map</h2>

			<div className="my-2">
				<h6 className="titulos-info-pedidos">Total:</h6>
				<p className="precio-total-pedidos data-info-pedidos"></p>
			</div>
		</div>
	);
};

export default DetallesPedido;