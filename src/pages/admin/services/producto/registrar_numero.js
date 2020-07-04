import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import { StepsContext } from '../../contexts/stepsContext';

const key = 'updatable';

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
		message.loading({ content: 'En proceso...', key });
		const respuesta = await clienteAxios.post(`/productos/addNumero/${productoContext}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				setDisabled(false);
				obtenerNumero();
				form.resetFields();
				message.success({
					content: respuesta.data.message,
					key,
					duration: 1
				});
			} else {
				message.error({
					content: respuesta.data.message,
					key,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				key,
				duration: 3,
			});
		}
	};

	const eliminarNumero = async (idnumero) => {
		message.loading({ content: 'En proceso...', key });
		const respuesta = await clienteAxios.delete(`/productos/action/${productoContext}/numero/${idnumero}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				obtenerNumero();
				message.success({
					content: respuesta.data.message,
					key,
					duration: 1
				});
			} else {
				message.error({
					content: respuesta.data.message,
					key,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				key,
				duration: 3,
			});
		}
	};
	const obtenerNumero = async () => {
		const respuesta = await clienteAxios.get(`/productos/${productoContext}`);
		try {
			if (!respuesta.data.err) {
				setProductos(respuesta.data.numeros);
			} else {
				message.error({
					content: respuesta.data.message,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				duration: 3,
			});
		}
	};

	if (productos !== 0) {
		var render = productos.map((numero) => (
			<div className="m-2">
				<Badge count={numero.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete">
						<p className="rounded p-2" style={{ backgroundColor: '#EEEEEE', fontSize: 40 }}>
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
