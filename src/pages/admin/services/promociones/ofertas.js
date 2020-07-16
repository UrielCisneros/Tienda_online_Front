import React, { useState, useEffect, useContext } from 'react'
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, Upload} from 'antd';
import {IdProductoContext} from '../../contexts/ProductoContext'
import './ofertas.scss';

const Ofertas = () => {
	const productoContext = useContext(IdProductoContext);
    const [ producto, setProducto ] = useState([]);
	const token = localStorage.getItem('token');
	const [ promocionActual, setPromocionActual ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();
	const formData = new FormData();
	console.log("hola")

	useEffect(() => {
		obtenerProductos();
	}, [productoContext]);

	const props = {
		beforeUpload: async (file) => {
			formData.append('imagenPromocion', file);
		}
	};

	const obtenerCampo = e => {
		setPrecioPromocion(e.target.value)
	}

	const subirImagen = () => {}

	const actualizarImagen = () => {}

	const eliminarImagen = () => {}

	const subirPromocion = async () => {
		formData.append('precio', precioPromocion)
		const res = await clienteAxios.put(`/productos/${productoContext}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		})
		try {
			console.log(res)
			obtenerProductos();
		} catch (err) {
			console.log(err);
		}
	}

	const eliminarPromocion = () => {}

    const obtenerProductos = async () => {
		const res = await clienteAxios.get(`/productos/${productoContext}`)
		try {
			console.log(res)
			setProducto(res.data);
			setPromocionActual(res.data.promocion);
		} catch (err) {
			console.log(err);
		}
	};

	const precio_descuento = promocionActual.map((promo) => (
		promo.precio
	))
	const imagen_promocion = promocionActual.map((promo) => (
		promo.imagenPromocion
	))

	var porcentaje= (precio_descuento / producto.precio ) * 100;
	var intPorcentaje = Math.round( porcentaje );

    return (
        <div>
			<div>
				<p className="text-center" style={{fontSize: 20}}>En esta seccion puedes agregar una oferta especial a tu producto</p>
			</div>
            <div className="d-lg-flex d-sm-block mt-4">
				<div className="col-12 col-lg-6">
					<div className="shadow">
						<div className="imagen-box shadow-sm">
							<img className="img-producto" alt="img-producto" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`} />
						</div>
						<div className="titulo-box"> 
							<h2>{producto.nombre}</h2>
						</div>
						<div className="precio-box"> 
							<h3 className="precio-producto d-inline mr-2">${new Intl.NumberFormat().format(producto.precio)}</h3>
							<h3 className="precio-rebaja d-inline mr-2">${new Intl.NumberFormat().format(precio_descuento)}</h3>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-6">
					<div className="mt-4">
						<div className="d-flex justify-content-center mb-2">
							<Space>
								<Input label="Precio" placeholder={new Intl.NumberFormat().format(precio_descuento)} onChange={obtenerCampo}/>
								<Button onClick={subirPromocion}>Agregar</Button>
								<Button>Quitar</Button>
							</Space>
						</div>
						<div className="d-flex justify-content-center texto-descuento">
							{precio_descuento.length === 0 ?
							<p>Este producto no tiene descuento</p> :
							<p>este producto tiene el <p className="numero-descuento d-inline">{intPorcentaje}%</p> de descuento,
							tu producto tiene un precio actual de: <p className="numero-descuento d-inline">${new Intl.NumberFormat().format(precio_descuento)}</p> </p>
							}
						</div>
						{precio_descuento.length === 0 ?
						<div></div> :
						<div className="mt-4">
							<p className="mt-2 texto-imagen">Sube una imagen para la promocion, esta imagen aparecera en el carrucel de promociones</p>
							<Upload {...props} className="d-flex justify-content-center mt-3"> 
								<Button>
									Subir
								</Button>
							</Upload>
							<div className="imagen-box-promocion shadow-sm">
								<img className="img-producto-promocion" alt="img-producto" src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/1594748218418`} />
							</div>
						</div>
						}	
					</div>
				</div>
			</div>
        </div>
    )
}

export default Ofertas;