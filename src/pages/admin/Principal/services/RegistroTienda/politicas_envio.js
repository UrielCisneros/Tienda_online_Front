import React, { useState, useEffect } from 'react';
import { Form, Input, Divider, Button, Upload, notification } from 'antd';
import { PlusCircleOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Editor } from '@tinymce/tinymce-react';
import clienteAxios from '../../../../../config/axios';

export default function PoliticasEnvio(props) {
	const { datosNegocio, token, setLoading, setReloadInfo } = props;

	const [ datos, setDatos ] = useState({});
	const [ control, setControl ] = useState(false);
	const [ form ] = Form.useForm();

	const [ upload, setUpload ] = useState(false);

	const monstrarInformacionBlog = (e) => {
		form.setFieldsValue(e);
	};

	useEffect(
		() => {
			if (datosNegocio !== undefined) {
				monstrarInformacionBlog({
					nombre: datosNegocio.nombre,
					telefono: datosNegocio.telefono,
					calle_numero: datosNegocio.direccion[0].calle_numero,
					cp: datosNegocio.direccion[0].cp,
					colonia: datosNegocio.direccion[0].colonia,
					ciudad: datosNegocio.direccion[0].ciudad,
					estado: datosNegocio.direccion[0].estado,
					lat: datosNegocio.ubicacion[0].lat,
					lng: datosNegocio.ubicacion[0].lng,
					politicas: datosNegocio.politicas,
					imagenCorp: datosNegocio.imagenCorp,
					linkFace: datosNegocio.linkFace,
					linkInsta: datosNegocio.linkInsta,
					linkTweeter: datosNegocio.linkTweeter
				});
				setDatos({
					nombre: datosNegocio.nombre,
					telefono: datosNegocio.telefono,
					calle_numero: datosNegocio.direccion[0].calle_numero,
					cp: datosNegocio.direccion[0].cp,
					colonia: datosNegocio.direccion[0].colonia,
					ciudad: datosNegocio.direccion[0].ciudad,
					estado: datosNegocio.direccion[0].estado,
					lat: datosNegocio.ubicacion[0].lat,
					lng: datosNegocio.ubicacion[0].lng,
					politicas: datosNegocio.politicas,
					imagenCorp: datosNegocio.imagenCorp,
					linkFace: datosNegocio.linkFace,
					linkInsta: datosNegocio.linkInsta,
					linkTweeter: datosNegocio.linkTweeter
				});
				setControl(true);
			} else {
				setDatos({});
				setControl(false);
			}
		},
		[ datosNegocio ]
	);

	const SendForm = async () => {
		const formData = new FormData();
		formData.append('nombre', datos.nombre);
		formData.append('telefono', datos.telefono);
		formData.append('calle_numero', datos.calle_numero);
		formData.append('cp', datos.cp);
		formData.append('colonia', datos.colonia);
		formData.append('ciudad', datos.ciudad);
		formData.append('estado', datos.estado);
		formData.append('lat', datos.lat);
		formData.append('lng', datos.lng);
		formData.append('politicas', datos.politicas);
		formData.append('imagenCorp', datos.imagenCorp);
		formData.append('linkFace', datos.linkFace);
		formData.append('linkInsta', datos.linkInsta);
		formData.append('linkTweeter', datos.linkTweeter);

		if (control === false) {
			/* if (files.length === 0) {
				notification.info({
					message: 'Ups, algo salio mal',
					description: 'La imagen es obligatoria'
				});
			} else {
				setLoading(true);
				formData.append('imagen', files);
				await clienteAxios
					.post('/tienda/', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
							Authorization: `bearer ${token}`
						}
					})
					.then((res) => {
						setLoading(false);
						setReloadInfo(true);
						console.log(res);
						notification.success({
							message: 'Registro exitoso',
							description: res.data.message
						});
					})
					.catch((err) => {
						setLoading(false);
						console.log(err.response);
						if (err.response.status === 500 || err.response.status === 404) {
							notification.error({
								message: 'Error de conexion',
								description: err.response.data.message
							});
						} else {
							notification.error({
								message: 'Error de conexion',
								description: 'Parece que algo salio mal, favor de intentarlo de nuevo'
							});
						}
					});
			}
		} else {
			setLoading(true);
			if (files.length !== 0) {
				console.log(files);
				formData.append('imagen', files);
			}
			await clienteAxios
				.put(`/tienda/${datosNegocio._id}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `bearer ${token}`
					}
				})
				.then((res) => {
					setLoading(false);
					setReloadInfo(true);
					console.log(res);
					notification.success({
						message: 'Registro exitoso',
						description: res.data.message
					});
				})
				.catch((err) => {
					setLoading(false);
					console.log(err.response);
					if (err.response.status === 500 || err.response.status === 404) {
						notification.error({
							message: 'Error de conexion',
							description: err.response.data.message
						});
					} else {
						notification.error({
							message: 'Error de conexion',
							description: 'Parece que algo salio mal, favor de intentarlo de nuevo'
						});
					}
				}); */
		}
	};

	return (
		<div className="row">
			<Divider>Información de la tienda</Divider>
			<Form onFinish={SendForm} form={form}>
				<Form.Item
					className="m-2"
					label="Nombre"
					onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
				>
					<Form.Item rules={[ { required: true, message: 'Nombre obligatorio' } ]} noStyle name="nombre">
						<Input name="nombre" placeholder="Nombre del negocio" />
					</Form.Item>
				</Form.Item>
                <Form.Item
					className="m-2"
					label="Nombre"
					onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
				>
					<Form.Item rules={[ { required: true, message: 'Nombre obligatorio' } ]} noStyle name="nombre">
						<Input name="nombre" placeholder="Nombre del negocio" />
					</Form.Item>
				</Form.Item>
                <Form.Item
					className="m-2"
					label="Nombre"
					onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
				>
					<Form.Item rules={[ { required: true, message: 'Nombre obligatorio' } ]} noStyle name="nombre">
						<Input name="nombre" placeholder="Nombre del negocio" />
					</Form.Item>
				</Form.Item>

				<Form.Item className="d-flex justify-content-center align-items-center text-center">
					<Button
						className="text-center"
						size="large"
						type="primary"
						htmlType="submit"
						icon={
							control === false ? (
								<PlusCircleOutlined style={{ fontSize: 24 }} />
							) : (
								<EditOutlined style={{ fontSize: 24 }} />
							)
						}
					>
						{control === false ? 'Registrar' : 'Editar'}
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
