import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import { StepsContext } from '../../contexts/stepsContext';

const key = 'updatable';

function RegistrarTalla() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const [ productoContext, disabledForm ] = useContext(ProductoContext);
	const [ disabled, setDisabled ] = useContext(StepsContext);
	const [ productos, setProductos ] = useState([]);

	const [ datos, setDatos ] = useState({
		talla: '',
		cantidad: ''
	});

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	const subirTalla = async () => {
		message.loading({ content: 'En proceso...', key });
		const respuesta = await clienteAxios.post(`/productos/addTalla/${productoContext}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				setDisabled(false);
				obtenerTalla();
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

	const eliminarTalla = async (idtalla) => {
		message.loading({ content: 'En proceso...', key });
		const respuesta = await clienteAxios.delete(`/productos/action/${productoContext}/talla/${idtalla}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!respuesta.data.err) {
				obtenerTalla();
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
	const obtenerTalla = async () => {
		const respuesta = await clienteAxios.get(`/productos/${productoContext}`);
		try {
			if (!respuesta.data.err) {
				setProductos(respuesta.data.tallas);
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
		var render = productos.map((tallas) => (
			<div className="m-2">
				<Badge count={tallas.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p className="rounded p-2" style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px'  }}>
							{tallas.talla}
						</p>
						<div className="icono rounded">
							<DeleteOutlined
								onClick={function() {
									eliminarTalla(tallas._id);
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
			<h4 className="text-center">Escribe la talla y la cantidad de productos disponibles de esa talla.</h4>
			<div className="d-flex justify-content-center">
				<Form onFinish={subirTalla} form={form}>
					<Input.Group>
						<Row gutter={8}>
							<Col span={5}>
								<Form.Item name="talla" label="Talla" onChange={datosForm}>
									<Input disabled={disabledForm} name="talla" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item name="cantidad" label="Cantidad" onChange={datosForm}>
									<Input disabled={disabledForm} name="cantidad" />
								</Form.Item>
							</Col>
							<Col>
								<Button disabled={disabledForm} type="dafault" htmlType="submit">
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
export default RegistrarTalla;
