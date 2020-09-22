import clienteAxios from '../../../../config/axios';
import { notification } from 'antd';

export async function AgregarCarrito(idcliente, idproducto, cantidad, talla, numero, token) {
	await clienteAxios
			.post(
				`/carrito/nuevo/${idcliente}`,
				{
					cliente: idcliente,
					articulos: [
						{ idarticulo: idproducto, cantidad: cantidad, medida: [ { talla: talla, numero: numero } ] }
					]
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: res.data.message,
					duration: 2
				});
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

export async function AgregarApartado(idcliente, idproducto, cantidad, talla, numero, tipoEntrega, token) {
	if (talla) {
		await clienteAxios
			.post(
				`/apartado/nuevo/${idcliente}`,
				{
					producto: idproducto,
					cliente: idcliente,
					cantidad: cantidad,
					medida: [ { talla: talla } ],
					estado: 'PROCESANDO',
					tipoEntrega: tipoEntrega
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: res.data.message,
					duration: 2
				});
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
	} else if (numero) {
		await clienteAxios
			.post(
				`/apartado/nuevo/${idcliente}`,
				{
					producto: idproducto,
					cliente: idcliente,
					cantidad: cantidad,
					medida: [ { numero: numero } ],
					estado: 'PROCESANDO',
					tipoEntrega: tipoEntrega
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: res.data.message,
					duration: 2
				});
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
	} else if (!talla && !numero) {
		await clienteAxios
			.post(
				`/apartado/nuevo/${idcliente}`,
				{
					producto: idproducto,
					cliente: idcliente,
					cantidad: cantidad,
					estado: 'PROCESANDO',
					tipoEntrega: tipoEntrega
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				return notification.success({
					message: res.data.message,
					duration: 2
				});
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
}

export async function AgregarPedido(idcliente, idproducto, cantidad, talla, numero, precio, total, token) {
	if (!numero) {
		await clienteAxios
			.post(
				'/pedidos/',
				{
                    cliente: idcliente,
                    pedido:[{
                        producto: idproducto,
                        cantidad: cantidad,
						talla: talla,
						precio: precio
                    }],
                    total: total,
                    estado_pedido: 'En proceso',
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				window.location.href = `/confirmacion_compra/${res.data.pedido._id}`				
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
	} else if (!talla) {
		await clienteAxios
			.post(
				'/pedidos/',
				{
                    cliente: idcliente,
                    pedido:[{
                        producto: idproducto,
                        cantidad: cantidad,
						numero: numero,
						precio: precio
                    }],
                    total: total,
                    estado_pedido: 'En proceso',
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				window.location.href = `/confirmacion_compra/${res.data.pedido._id}`
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
	} else if (!talla && !numero) {
		await clienteAxios
			.post(
				'/pedidos/',
				{
                    cliente: idcliente,
                    pedido:[{
                        producto: idproducto,
						cantidad: cantidad,
						precio: precio
                    }],
                    total: total,
                    estado_pedido: 'En proceso',
				},
				{
					headers: {
						Authorization: `bearer ${token}`
					}
				}
			)
			.then((res) => {
				window.location.href = `/confirmacion_compra/${res.data.pedido._id}`
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
}
