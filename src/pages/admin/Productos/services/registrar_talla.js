import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin } from 'antd';
import { DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
import { StepsContext } from '../../contexts/stepsContext';

const antIcon = <LoadingOutlined style={{ fontSize: 24, marginLeft: 10 }} spin />;

function RegistrarTalla() {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const [ productoContext, disabledForm ] = useContext(ProductoContext);
	const [ disabled, setDisabled ] = useContext(StepsContext);
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

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
		setLoading(true);
		await clienteAxios
			.post(`/productos/addTalla/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setDisabled(false);
				obtenerTalla();
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
	};

	const eliminarTalla = async (idtalla) => {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoContext}/talla/${idtalla}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				obtenerTalla();
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
	};
	const obtenerTalla = async () => {
		await clienteAxios
			.get(`/productos/${productoContext}`)
			.then((res) => {
				setProductos(res.data.tallas);
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
		var render = productos.map((tallas) => (
			<div className="m-2" key={tallas._id}>
				<Badge count={tallas.cantidad} style={{ backgroundColor: '#52c41a' }}>
					<div className="hover-delete d-flex text-center">
						<p
							className="rounded p-2"
							style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '60px', height: '56px' }}
						>
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
			{disabledForm === false ? (
				<p className="mensaje-tallas-success">Ya puedes registrar tallas.</p>
			) : (
				<p className="mensaje-tallas">Podrás registrar tallas despues de registrar tu producto</p>
			)}
			<p className="text-center mb-1">Escribe la talla y la cantidad de productos disponibles de esa talla.</p>
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
								<Button disabled={disabledForm} type="dafault" htmlType="submit" loading={loading}>
									Agregar
								</Button>
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
export default RegistrarTalla;
