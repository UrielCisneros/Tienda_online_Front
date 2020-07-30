import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import { StepsContext } from '../../contexts/stepsContext';

function RegistrarNumero() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const [ productoContext, disabledForm ] = useContext(ProductoContext);
	const [ disabled, setDisabled ] = useContext(StepsContext);
	const [ productos, setProductos ] = useState([]);

	const [ datos, setDatos ] = useState({
		numero: '',
		cantidad: ''
	});

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const subirNumero = async () => {
		await clienteAxios
			.post(`/productos/addNumero/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setDisabled(false);
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
	};

	const eliminarNumero = async (idnumero) => {
		await clienteAxios
			.delete(`/productos/action/${productoContext}/numero/${idnumero}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerNumero();
				notification.success({
					message: 'Hecho!',
					description: res.data.message,
					duration: 2
				});
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
	};
	const obtenerNumero = async () => {
		await clienteAxios
			.get(`/productos/${productoContext}`)
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
	};

	if (productos !== 0) {
		var render = productos.map((numero) => (
			<div className="m-2">
				<Badge count={numero.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
							{numero.numero}
						</p>
						<div className="icono rounded">
							<DeleteOutlined
								onClick={function() {
									eliminarNumero(numero._id);
								}}
								style={{ fontSize: 25, color: 'white' }}
							/>
						</div>
					</div>
				</Badge>
			</div>
		));
	}

	return (
		<div>
			<h4 className="text-center">
				Escribe la talla del calzado y la cantidad de productos disponibles de esa talla.
			</h4>
			<div className="d-flex justify-content-center">
				<Form onFinish={subirNumero} form={form}>
					<Input.Group>
						<Row gutter={8}>
							<Col span={5}>
								<Form.Item name="numero" label="Numero" onChange={datosForm}>
									<Input name="numero" disabled={disabledForm} />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="cantidad" label="Cantidad" onChange={datosForm}>
									<Input name="cantidad" disabled={disabledForm} />
								</Form.Item>
							</Col>
							<Col>
								<Button type="dafault" htmlType="submit" disabled={disabledForm}>
									Agregar
								</Button>
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
export default RegistrarNumero;
