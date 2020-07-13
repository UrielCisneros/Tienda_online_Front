import React, { useState, useEffect, useContext } from 'react'
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space} from 'antd';
import {IdProductoContext} from '../../contexts/ProductoContext'
import './ofertas.scss';

const Ofertas = () => {
	const productoContext = useContext(IdProductoContext);
    const [ producto, setProducto ] = useState([]);
	const token = localStorage.getItem('token');
	const [ promocion, setPromocion ] = useState([]);
	console.log("hola")

	useEffect(() => {
		obtenerProductos();
	}, [productoContext]);

    const obtenerProductos = async () => {
		clienteAxios
			.get(`/productos/${productoContext}`)
			.then((res) => {
				console.log(res)
				setProducto(res.data);
				setPromocion(res.data.promocion);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const promo = promocion.map((promo) => (
		promo.precio
	))

	var porcentaje= (promo / producto.precio ) * 100;
	var intPorcentaje = Math.round( porcentaje );

/* coment */
    return (
        <div>
			<div>
				<p className="text-center" style={{fontSize: 20}}>En esta seccion puedes agregar una oferta especial a tu producto</p>
			</div>
            <div className="d-lg-flex d-sm-block mt-4">
				<div className="col-12 col-lg-6">
					<div className="shadow">
						<div className="imagen-box shadow-sm">
							<img className="img-producto" alt="img-producto" src={`http://localhost:4000/${producto.imagen}`} />
						</div>
						<div className="titulo-box"> 
							<h2>{producto.nombre}</h2>
						</div>
						<div className="precio-box"> 
							<h3 className="precio-producto d-inline mr-2">${new Intl.NumberFormat().format(producto.precio)}</h3>
							<h3 className="precio-rebaja d-inline mr-2">${new Intl.NumberFormat().format(promo)}</h3>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-6">
					<div className="mt-4">
						<div className="d-flex justify-content-center mb-5">
							<Space>
								<Input label="Precio" value={new Intl.NumberFormat().format(producto.precio)}/>
								<Button>Agregar</Button>
								<Button>Quitar</Button>
							</Space>
						</div>
						<div className="d-flex justify-content-center texto-descuento">
							{producto.promocion === 0 ?
							<p>Este producto no tiene descuento</p> :
							<p>este producto tiene el <p className="numero-descuento">{intPorcentaje}%</p> de descuento,
							tu producto tiene un precio actual de: <p className="numero-descuento">${new Intl.NumberFormat().format(producto.precio)}</p> </p>
							}
						</div>
					</div>
				</div>
			</div>
        </div>
    )
}

export default Ofertas;