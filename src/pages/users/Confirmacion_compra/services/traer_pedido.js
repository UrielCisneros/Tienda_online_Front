/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { List, InputNumber, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { formatoMexico } from '../../../../config/reuserFunction';

import '../confirmacion.scss';

export default function Traer_pedido(props) {
	const { datosPedido, pedidoCompleto, datosEnvio, setTotal } = props;

	return (
		<div>
			{/* <h1 className="text-center">Tu pedido:</h1> */}
			<div className="d-flex justify-content-end text-right px-4 mr-2 mt-3">
				<div className="__subs">
					{datosEnvio.costoEnvio ? (
						<p className="h6 font-weight-bold">Costo envio: $ {datosEnvio.costoEnvio} </p>
					) : (
						''
					)}
					{datosEnvio.descuento ? pedidoCompleto.total >= datosEnvio.promocionEnvio ? (
						<div>
							<p className="h6 font-weight-bold">Descuento de: $ {datosEnvio.descuento}</p>
							<p className="h6 font-weight-bold">
								Subtotal ({datosPedido.length}): $ {formatoMexico(
									pedidoCompleto.total + datosEnvio.costoEnvio
								)}{' '}
							</p>
							{/* <p className="text-success h6 font-weight-bold">El descuento si aplica</p> */}
						</div>
					) : (
						<div>
							<p className="h6 font-weight-bold">
								Subtotal ({datosPedido.length}): $ {formatoMexico(
									pedidoCompleto.total + datosEnvio.costoEnvio
								)}{' '}
							</p>
							{/* <p className="text-danger h6 font-weight-bold">El descuento no aplica</p> */}
						</div>
					) : (
						<div>
							<p className="h6 font-weight-bold">
								Subtotal ({datosPedido.length}): $ {formatoMexico(
									pedidoCompleto.total + datosEnvio.costoEnvio
								)}{' '}
							</p>
							{/* <p className="text-danger h6 font-weight-bold">El descuento no aplica</p> */}
						</div>
					)}

					<p className="mt-4 h4 font-weight-bold">
						Total: ${' '}
						{datosEnvio.descuento ? pedidoCompleto.total >= datosEnvio.promocionEnvio ? (
							formatoMexico(pedidoCompleto.total + datosEnvio.costoEnvio - datosEnvio.descuento)
						) : (
							formatoMexico(pedidoCompleto.total + datosEnvio.costoEnvio)
						) : (
							formatoMexico(pedidoCompleto.total + datosEnvio.costoEnvio)
						)}
					</p>
				</div>
			</div>
			<div>
				<List
					className="p-3"
					itemLayout="horizontal"
					size="large"
					dataSource={datosPedido}
					renderItem={(producto) => <Productos pedido={producto} />}
				/>
			</div>
		</div>
	);
}

function Productos(props) {
	const { pedido } = props;
	return (
		<List.Item>
			<div className="row">
				<div className="col-lg-7 d-flex justify-content-lg-center">
					<List.Item.Meta
						avatar={
							<img
								className="img-fluid"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${pedido.producto
									.imagen}`}
								height="80"
								width="80"
							/>
						}
						title={<p className="__nombres">{pedido.producto.nombre}</p>}
						description={<p className="__categ">{pedido.producto.categoria}</p>}
					/>
				</div>

				<div className=" col-lg-3">
					<p className="__tupedido">Cantidad: {pedido.cantidad}</p>

					{pedido.producto.tipoCategoria === 'calzado' ? (
						<div>
							<p className="__tupedido">Medida: {pedido.numero}</p>
							<p className="__tupedido">Color: {pedido.producto.color}</p>
						</div>
					) : (
						''
					)}

					{pedido.producto.tipoCategoria === 'ropa' ? (
						<div>
							<p className="__tupedido">Talla: {pedido.talla}</p>
							<p className="__tupedido">Color: {pedido.producto.color}</p>
						</div>
					) : (
						''
					)}
				</div>
				<div className=" col-lg-2 d-flex flex-row-reverse">
					<p style={{ fontSize: '20px', fontWeight: 'bold' }}>
						${formatoMexico(pedido.cantidad * pedido.precio)}
					</p>
				</div>
			</div>
		</List.Item>
	);
}
