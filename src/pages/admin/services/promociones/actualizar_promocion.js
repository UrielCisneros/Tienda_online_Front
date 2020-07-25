import React, { useState, useEffect, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Button, Input, Space, Upload, Spin, message } from 'antd';
import { IdProductoContext } from '../../contexts/ProductoContext';
import './registrar_promocion.scss';

const ActualizarPromocion = () => {
	const token = localStorage.getItem('token');
	const productoContext = useContext(IdProductoContext);

	const [ loading, setLoading ] = useState(true);
	const [ loadingButton, setLoadingButton ] = useState(false);

	const [ producto, setProducto ] = useState([]);
	const [ promocion, setPromocion ] = useState([]);
	const [ precioPromocion, setPrecioPromocion ] = useState();

	useEffect(
		() => {
			obtenerPromocion();
		},
		[ productoContext ]
	);

	const props = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			subirImagen(formDataImagen);
		}
	};
	const propsActualizar = {
		beforeUpload: async (file) => {
			const formDataImagen = new FormData();
			formDataImagen.append('imagen', file);
			actualizarImagen(formDataImagen);
		}
	};

	const obtenerCampo = (e) => {
		setPrecioPromocion(e.target.value);
	};

	const obtenerPromocion = async () => {
		const res = await clienteAxios.get(`/productos/promocion/${productoContext}`);
		try {
			setProducto(res.data.productoPromocion);
			setPromocion(res.data);
			setLoading(false);
		} catch (err) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	const subirImagen = async (formDataImagen) => {
		setLoadingButton(true);
		const res = await clienteAxios.put(`/productos/promocion/${productoContext}`, formDataImagen, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: 'imagen guardada',
					duration: 2
				});
				obtenerPromocion();
				setLoadingButton(false);
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			message.error({
				content: 'hubo un error',
				duration: 2
			});
		}
	};

	const actualizarImagen = async (formDataImagen) => {
		setLoadingButton(true);
		const res = await clienteAxios.put(`/productos/promocion/${productoContext}`, formDataImagen, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: res.data.message,
					duration: 2
				});
				obtenerPromocion();
				setLoadingButton(false);
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	const eliminarImagen = async () => {
		setLoadingButton(true);
		const res = await clienteAxios.delete(`/productos/promocion/EliminarImagen/${productoContext}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: res.data.message,
					duration: 2
				});
				obtenerPromocion();
				setLoadingButton(false);
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	const actualizarPromocion = async () => {
		const formData = new FormData();
		formData.append('precioPromocion', precioPromocion);
		const res = await clienteAxios.put(`/productos/promocion/${productoContext}`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				message.success({
					content: res.data.message,
					duration: 2
				});
				obtenerPromocion();
			} else {
				message.error({
					content: res.data.message,
					duration: 2
				});
			}
		} catch (err) {
			message.error({
				content: 'Hubo un error',
				duration: 2
			});
		}
	};

	if (loading) {
		return (
			<div className="d-flex justify-content-center align-items-center">
				<Spin size="large" />
			</div>
		);
	}

	return (
		<div>
			<div className="d-lg-flex d-sm-block mt-4">
				<div className="col-12 col-lg-6">
					<div className="shadow">
						<div className="imagen-box shadow-sm">
							<img
								className="img-producto"
								alt="img-producto"
								src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${producto.imagen}`}
							/>
						</div>
						<div className="titulo-box">
							<h2>{producto.nombre}</h2>
						</div>
						<div className="precio-box">
							<h3 className="precio-producto d-inline mr-2">
								${new Intl.NumberFormat().format(producto.precio)}
							</h3>
							<h3 className="precio-rebaja d-inline mr-2">
								${new Intl.NumberFormat().format(promocion.precioPromocion)}
							</h3>
						</div>
					</div>
				</div>
				<div className="col-12 col-lg-6">
					<div className="mt-4">
						<div className="d-flex justify-content-center mb-2">
							<Space>
								<Input
									type="number"
									label="Precio"
									placeholder={new Intl.NumberFormat().format(promocion.precioPromocion)}
									onChange={obtenerCampo}
								/>
								<Button onClick={actualizarPromocion}>Actualizar</Button>
								<Button>Quitar</Button>
							</Space>
						</div>
						<div className="mt-4">
							<p className="mt-2 texto-imagen">
								Actualizar imagen de promocion, recuerda que esta imagen aparecera en el carrucel de
								promociones
							</p>
							<Space className="mt-3 d-flex justify-content-center">
								{!promocion.imagenPromocion ? (
									<Upload {...props}>
										<Button loading={loadingButton}>Subir imagen</Button>
									</Upload>
								) : (
									<Upload {...propsActualizar}>
										<Button loading={loadingButton}>Actualizar imagen</Button>
									</Upload>
								)}
								<Button
									onClick={() => {
										eliminarImagen();
									}}
								>
									Quitar imagen
								</Button>
							</Space>
							<div className="imagen-box-promocion shadow-sm mt-2">
								{!promocion.imagenPromocion ? (
									<div>Sube una imagen</div>
								) : (
									<img
										className="img-producto-promocion"
										alt="img-producto"
										src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${promocion.imagenPromocion}`}
									/>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ActualizarPromocion;
