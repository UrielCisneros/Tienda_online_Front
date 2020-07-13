import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './actualizar_tallas.scss';
import { IdProductoContext } from '../../contexts/ProductoContext';

const key = 'updatable';

function ActualizarNumero() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ productos, setProductos ] = useState([]);
	const [ idNumero, setIdNumero ] = useState('');
	const [ datos, setDatos ] = useState({
		numero: '',
		cantidad: ''
	});

	useEffect(() => {
		obtenerNumero();
	}, []);

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	async function actualizarNumero(){
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.put(`/productos/action/${productoID}/numero/${idNumero}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerNumero();
				form.resetFields();
				message.success({
					content: res.data.message,
					key,
					duration: 1
				});
			} else {
				message.error({
					content: res.data.message,
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
	}
	async function nuevoNumero(){
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.post(`/productos/addNumero/${productoID}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerNumero();
                form.resetFields();
				message.success({
					content: res.data.message,
					key,
					duration: 1
				});
			} else {
				message.error({
					content: res.data.message,
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
	}
	async function eliminarNumero(idNumero){
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.delete(`/productos/action/${productoID}/numero/${idNumero}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerNumero();
				message.success({
					content: res.data.message,
					key,
					duration: 1
				});
			} else {
				message.error({
					content: res.data.message,
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
	}
	async function obtenerNumero() {
		const res = await clienteAxios.get(`/productos/${productoID}`);
		try {
			if (!res.data.err) {
				setProductos(res.data.numeros);
			} else {
				message.error({
					content: res.data.message,
					duration: 3
				});
			}
		} catch (error) {
			message.error({
				content: 'Hubo un error',
				duration: 3
			});
		}
	}

	const rellenarCampos = (numero, cantidad, idNumero) => {
		setIdNumero(idNumero);
		setDatos({...datos, numero, cantidad })
		form.setFieldsValue({
			numero,
			cantidad
		})
	}

	if (productos !== 0) {
		var render = productos.map((numeros) => (
			<div className="mb-5 m-2">
				<Badge count={numeros.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p className="rounded p-2" style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}>
							{numeros.numero}
						</p>
						<div className="icono rounded d-flex justify-content-around">
							<EditOutlined onClick={function() {rellenarCampos(numeros.numero, numeros.cantidad, numeros._id)}} style={{ fontSize: 20, color: 'white' }} />
							<DeleteOutlined onClick={function() {eliminarNumero(numeros._id)}} style={{ fontSize: 20, color: 'white' }} />
						</div>
					</div>
				</Badge>
			</div>
		));
	}

	return (
		<div className="ml-4">
			<div className="d-flex justify-content-center">
				<Form form={form} onFinish={actualizarNumero}>
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
								<Button type="dafault" htmlType="submit">
									Actualizar
								</Button>
							</Col>
							<Col>
								<Button type="dafault" onClick={nuevoNumero}>
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
export default ActualizarNumero;
