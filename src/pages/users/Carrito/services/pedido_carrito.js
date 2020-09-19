import clienteAxios from '../../../../config/axios';
import { notification } from 'antd';

export async function AgregarPedidoCarrito(idcliente, carrito, total, token) {
	/* idcliente, idproducto, categoria, cantidad, talla, precio, total, token */
	var pedido = [];

	carrito.map((carrito) => {
		const medida = carrito.medida.map((res) => {
			if (res.talla) {
				return res.talla;
			} else if (res.numero) {
				return res.numero;
			}
        });
        var precio;
        if(!carrito.promocion){
            precio = carrito.idarticulo.precio
        }else{
            precio = carrito.promocion.precioPromocion
        }

		switch (carrito.idarticulo.tipoCategoria) {
			case 'ropa':
				pedido.push(
					{
						producto: carrito.idarticulo._id,
						cantidad: carrito.cantidad,
						talla: medida[0],
						precio: precio
					}
				);
				break;
			case 'calzado':
				pedido.push(
					{
						producto: carrito.idarticulo._id,
						cantidad: carrito.cantidad,
						numero: medida[0],
						precio: precio
					}
				);
				break;
			case 'otros':
				pedido.push(
					{
						producto: carrito.idarticulo._id,
						cantidad: carrito.cantidad,
						precio: precio
					}
				);
				break;
			default:
				break;
		}
    });

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
