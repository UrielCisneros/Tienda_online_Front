import React, { useEffect, useState } from 'react';
import clienteAxios from '../../../../config/axios';

import { Form, Input, Button, Result, Spin, notification } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import '../confirmacion.scss';

export default function Traer_datos(props) {
	const { datosUser, decoded, setCurrent, current, setDatosActualizados, token } = props;
	const [ datosFormulario, setdatosFormulario ] = useState({});

	const [ loading, setLoading ] = useState(false);

	const [ form ] = Form.useForm();

	const mostrarDatosUser = (e) => {
		form.setFieldsValue(e);
	};

	useEffect(
		() => {
			if (datosUser !== null) {
				let direccion = {};
				if (datosUser.direccion.length > 0) {
					direccion = datosUser.direccion[0];
				}
				mostrarDatosUser({
					nombre: datosUser.nombre,
					apellido: datosUser.apellido,
					telefono: datosUser.telefono,
					calle_numero: direccion.calle_numero,
					entre_calles: direccion.entre_calles,
					cp: direccion.cp,
					colonia: direccion.colonia,
					ciudad: direccion.ciudad,
					estado: direccion.estado,
					pais: direccion.pais
				});
				setdatosFormulario({
					nombre: datosUser.nombre,
					apellido: datosUser.apellido,
					email: datosUser.email,
					telefono: datosUser.telefono,
					calle_numero: direccion.calle_numero,
					entre_calles: direccion.entre_calles,
					cp: direccion.cp,
					colonia: direccion.colonia,
					ciudad: direccion.ciudad,
					estado: direccion.estado,
					pais: direccion.pais
				});
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		},
		[ datosUser ]
	);

	async function enviarDatosUser() {
		const formData = new FormData();

		formData.append('nombre', datosFormulario.nombre);
		formData.append('apellido', datosFormulario.apellido);
		formData.append('email', datosFormulario.email);
		formData.append('telefono', datosFormulario.telefono);
		formData.append('calle_numero', datosFormulario.calle_numero);
		formData.append('entre_calles', datosFormulario.entre_calles);
		formData.append('cp', datosFormulario.cp);
		formData.append('colonia', datosFormulario.colonia);
		formData.append('ciudad', datosFormulario.ciudad);
		formData.append('estado', datosFormulario.estado);
		formData.append('pais', datosFormulario.pais);

		setLoading(true);
		await clienteAxios
			.put(`/cliente/${decoded._id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setDatosActualizados(datosFormulario);
				setLoading(false);
				setCurrent(current + 1);
			})
			.catch((res) => {
				console.log(res.response);
				setLoading(false);
				if (res.response.status === 404 || res.response.status === 500) {
					notification.error({
						message: 'Error',
						description: `${res.response.data.message}`,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error',
						description: 'Error de conexion',
						duration: 2
					});
				}
			});
	}

	if (decoded === null) {
		return null;
	}

	const datosForm = (e) => {
		setdatosFormulario({
			...datosFormulario,
			[e.target.name]: e.target.value
		});
	};

	return (
		<Spin spinning={loading} size="large">
			<div className="shadow-lg bg-white rounded">
				<Form className="mt-5" layout="horizontal" size={'middle'} form={form} onFinish={enviarDatosUser}>
					<Result
						className="m-0"
						icon={<FontAwesomeIcon icon={faUser} style={{ fontSize: '100px' }} />}
						extra={
							<div className="row m-4">
								<div className="col-lg-12 col-sm-12">
									<div className="row">
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Nombre:</p>
											<Form.Item name="nombre" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Nombre obligatorio' } ]}
													noStyle
													name="nombre"
												>
													<Input name="nombre" a placeholder="Nombre" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Apellidos:</p>
											<Form.Item name="apellido" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Apellidos obligatorios' } ]}
													noStyle
													name="apellido"
												>
													<Input name="apellido" a placeholder="Apellidos" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Teléfono:</p>
											<Form.Item name="telefono" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Telefono obligatorio' } ]}
													noStyle
													name="telefono"
												>
													<Input name="telefono" a placeholder="+52 3171234567" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Dirección:</p>
											<Form.Item name="calle_numero" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Direccion obligatoria' } ]}
													noStyle
													name="calle_numero"
												>
													<Input
														name="calle_numero"
														a
														placeholder="Calle y numero de calle"
													/>
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-4 col-sm-12">
											<p className="font-weight-bold">Referencia:</p>
											<Form.Item name="entre_calles" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Referencia obligatoria' } ]}
													noStyle
													name="entre_calles"
												>
													<Input name="entre_calles" a placeholder="Calles de referencia" />
												</Form.Item>
											</Form.Item>
										</div>
									</div>

									<div className="row">
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Código postal:</p>
											<Form.Item name="cp" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Codigo postal obligatorio' } ]}
													noStyle
													name="cp"
												>
													<Input name="cp" a placeholder="Codigo Postal" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Colonia:</p>
											<Form.Item name="colonia" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Colonia obligatoria' } ]}
													noStyle
													name="colonia"
												>
													<Input name="colonia" a placeholder="Colonia" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-4 col-sm-12">
											<p className="font-weight-bold">Ciudad:</p>
											<Form.Item name="ciudad" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Localidad obligatoria' } ]}
													noStyle
													name="ciudad"
												>
													<Input name="ciudad" a placeholder="Localidad" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">Estado:</p>
											<Form.Item name="estado" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'Estado obligatoria' } ]}
													noStyle
													name="estado"
												>
													<Input name="estado" a placeholder="Estado" />
												</Form.Item>
											</Form.Item>
										</div>
										<div className="col-lg-2 col-sm-12">
											<p className="font-weight-bold">País:</p>
											<Form.Item name="pais" onChange={datosForm}>
												<Form.Item
													rules={[ { required: true, message: 'País obligatoria' } ]}
													noStyle
													name="pais"
												>
													<Input name="pais" a placeholder="País" />
												</Form.Item>
											</Form.Item>
										</div>
									</div>
								</div>
							</div>
						}
					/>
					<div className="steps-action d-flex justify-content-center align-items-center p-3">
						<Button type="primary" htmlType="submit" size="large">
							Siguiente
						</Button>
					</div>
				</Form>
			</div>
		</Spin>
	);
}
