import React, { useState, useContext, useEffect, useRef } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin, Space } from 'antd';
import { DeleteOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';
import './actualizar_tallas.scss';
import { IdProductoContext } from '../../contexts/ProductoContext';

const antIcon = <LoadingOutlined style={{ fontSize: 24, marginLeft: 10 }} spin />;

function ActualizarNumero() {
	const formRef = useRef(null);
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ productos, setProductos ] = useState([]);
	const [ idNumero, setIdNumero ] = useState('');
	const [ loading, setLoading ] = useState(false);
	const [ datos, setDatos ] = useState({
		numero: '',
		cantidad: ''
	});

	useEffect(
		() => {
			obtenerNumero();
		},
		[ productoID ]
	);

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	async function actualizarNumero() {
		setLoading(true);
		await clienteAxios
			.put(`/productos/action/${productoID}/numero/${idNumero}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setIdNumero('');
				setLoading(false);
				obtenerNumero();
				form.resetFields();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	}
	async function nuevoNumero() {
		setLoading(true);
		await clienteAxios
			.post(`/productos/addNumero/${productoID}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerNumero();
				setLoading(false);
				form.resetFields();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	}
	async function eliminarNumero(idNumero) {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoID}/numero/${idNumero}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				obtenerNumero();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	}
	async function obtenerNumero() {
		await clienteAxios
			.get(`/productos/${productoID}`)
			.then((res) => {
				setProductos(res.data.numeros);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
	}

	const rellenarCampos = (numero, cantidad, idNumero) => {
		setIdNumero(idNumero);
		setDatos({ ...datos, numero, cantidad });
		form.setFieldsValue({
			numero,
			cantidad
		});
	};

	if (productos !== 0) {
		var render = productos.map((numeros) => (
			<div className="mb-5 m-2" key={numeros._id}>
				<Badge count={numeros.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
							{numeros.numero}
						</p>
						<div className="icono rounded d-flex justify-content-around">
							<EditOutlined
								onClick={function() {
									rellenarCampos(numeros.numero, numeros.cantidad, numeros._id);
								}}
								style={{ fontSize: 20, color: 'white' }}
							/>
							<DeleteOutlined
								onClick={function() {
									eliminarNumero(numeros._id);
								}}
								style={{ fontSize: 20, color: 'white' }}
							/>
						</div>
					</div>
				</Badge>
			</div>
		));
	}

	return (
		<div className="ml-4">
			<div className="d-flex justify-content-center">
				<Form form={form} ref={formRef.current} onFinish={actualizarNumero}>
					<Input.Group>
						<Row gutter={8}>
							<Col span={5}>
								<Form.Item name="numero" label="numero" onChange={datosForm}>
									<Input name="numero" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="cantidad" label="Cantidad" onChange={datosForm}>
									<Input name="cantidad" />
								</Form.Item>
							</Col>
							<Col>
								{idNumero ? (
									<div>
										<Space>
											<Button type="dafault" htmlType="submit">
												Actualizar
											</Button>
											<Button
												type="dafault"
												onClick={() => {
													setIdNumero('');
													form.resetFields();
												}}
											>
												Cancelar
											</Button>
										</Space>
									</div>
								) : (
									<Button type="dafault" onClick={nuevoNumero}>
										Agregar
									</Button>
								)}
								{loading ? <Spin indicator={antIcon} /> : <div />}
							</Col>
						</Row>
					</Input.Group>
				</Form>
			</div>
			<h6 className="mensaje">Para eliminar manten presionado</h6>
			<div className="row">{render}</div>
		</div>
	);
}
export default ActualizarNumero;
