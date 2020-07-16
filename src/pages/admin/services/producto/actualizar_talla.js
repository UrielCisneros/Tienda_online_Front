import React, { useState, useContext, useEffect } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, message } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './actualizar_tallas.scss';
import { IdProductoContext } from '../../contexts/ProductoContext';

const key = 'updatable';

function ActualizarTalla() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const productoID = useContext(IdProductoContext);
	const [ productos, setProductos ] = useState([]);
	const [ idTalla, setIdTalla ] = useState('');
	const [ datos, setDatos ] = useState({
		talla: '',
		cantidad: ''
	});

	useEffect(() => {
		obtenerTalla();
	}, []);

	const datosForm = (e) => {
		setDatos({
			...datos,
			[e.target.name]: e.target.value
		});
	};

	async function actualizarTalla(){
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.put(`/productos/action/${productoID}/talla/${idTalla}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerTalla();
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
	async function nuevaTalla(){
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.post(`/productos/addTalla/${productoID}`, datos, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerTalla();
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
	async function eliminarTalla(idTalla){
		message.loading({ content: 'En proceso...', key });
		const res = await clienteAxios.delete(`/productos/action/${productoID}/talla/${idTalla}`, {
			headers: {
				Authorization: `bearer ${token}`
			}
		});
		try {
			if (!res.data.err) {
				obtenerTalla();
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
	async function obtenerTalla() {
		const res = await clienteAxios.get(`/productos/${productoID}`);
		try {
			if (!res.data.err) {
				setProductos(res.data.tallas);
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

	const rellenarCampos = (talla, cantidad, idTallas) => {
		setIdTalla(idTallas);
		setDatos({...datos, talla, cantidad })
		form.setFieldsValue({
			talla,
			cantidad
		})
	}

	if (productos !== 0) {
		var render = productos.map((tallas) => (
			<div className="mb-5 m-2">
				<Badge count={tallas.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p className="rounded p-2" style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}>
							{tallas.talla}
						</p>
						<div className="icono rounded d-flex justify-content-around">
							<EditOutlined onClick={function() {rellenarCampos(tallas.talla, tallas.cantidad, tallas._id)}} style={{ fontSize: 20, color: 'white' }} />
							<DeleteOutlined onClick={function() {eliminarTalla(tallas._id)}} style={{ fontSize: 20, color: 'white' }} />
						</div>
					</div>
				</Badge>
			</div>
		));
	}

	return (
		<div className="ml-4">
			<div className="d-flex justify-content-center">
				<Form form={form} onFinish={actualizarTalla}>
					<Input.Group>
						<Row gutter={8}>
							<Col span={5}>
								<Form.Item name="talla" label="Talla" onChange={datosForm}>
									<Input name="talla" />
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
								<Button type="dafault" onClick={nuevaTalla}>
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
export default ActualizarTalla;
