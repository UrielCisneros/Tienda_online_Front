import clienteAxios from '../../../../config/axios';
import { notification, message } from 'antd';

export async function AgregarPedido(idcliente, idproducto, categoria, cantidad, talla, precio, total, token) {
	var pedido = [];

	const medida = talla.map((res) => {
		if (res.talla) {
			return res.talla;
		} else if (res.numero) {
			return res.numero;
		}
	});

	switch (categoria) {
		case 'ropa':
			pedido = [
				{
					producto: idproducto,
					cantidad: cantidad,
					talla: medida[0],
					precio: precio
				}
			];
			break;
		case 'calzado':
			pedido = [
				{
					producto: idproducto,
					cantidad: cantidad,
					numero: medida[0],
					precio: precio
				}
			];
			break;
		case 'otros':
			pedido = [
				{
					producto: idproducto,
					cantidad: cantidad,
					precio: precio
				}
			];
			break;
		default:
			break;
	}

	await clienteAxios
		.post(
			'/pedidos/',
			{
				cliente: idcliente,
				pedido: pedido,
				total: total,
				estado_pedido: 'En proceso'
			},
			{
				headers: {
					Authorization: `bearer ${token}`
				}
			}
		)
		.then((res) => {
			window.location.href = `/confirmacion_compra/${res.data.pedido._id}`;
		})
		.catch((res) => {
			console.log(res.response);
			if (res.response.status === 404 || res.response.status === 500) {
				return notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				return notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
}

export async function AgregarApartado(idcliente, idproducto, cantidad, talla, tipoEntrega, token, categoria) {
	var apartado = [];
	const medida = talla.map((res) => {
		if (res.talla) {
			return res.talla;
		} else if (res.numero) {
			return res.numero;
		}
	});
	switch (categoria) {
		case 'ropa':
			apartado = {
				producto: idproducto,
				cliente: idcliente,
				cantidad: cantidad,
				medida: [ { talla: medida[0] } ],
				estado: 'PROCESANDO',
				tipoEntrega: tipoEntrega
			};
			break;
		case 'calzado':
			apartado = {
				producto: idproducto,
				cliente: idcliente,
				cantidad: cantidad,
				medida: [ { numero: medida[0] } ],
				estado: 'PROCESANDO',
				tipoEntrega: tipoEntrega
			};
			break;
		case 'otros':
			apartado = {
				producto: idproducto,
				cliente: idcliente,
				cantidad: cantidad,
				estado: 'PROCESANDO',
				tipoEntrega: tipoEntrega
			};
			break;
		default:
			break;
	}

	await clienteAxios
		.post(`/apartado/nuevo/${idcliente}`, apartado, {
			headers: {
				Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
			return message.success(res.data.message);
		})
		.catch((res) => {
			if (res.response.status === 404 || res.response.status === 500) {
				return notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				return notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
}

export async function EliminarArticuloCarrito(idcliente, articulo, token) {
	await clienteAxios
		.delete(`/carrito/${idcliente}/articulo/${articulo}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		})
		.then((res) => {
			return message.success(res.data.message);
		})
		.catch((res) => {
			if (res.response.status === 404 || res.response.status === 500) {
				return notification.error({
					message: 'Error',
					description: res.response.data.message,
					duration: 2
				});
			} else {
				return notification.error({
					message: 'Error',
					description: 'Hubo un error',
					duration: 2
				});
			}
		});
	return true;
}
