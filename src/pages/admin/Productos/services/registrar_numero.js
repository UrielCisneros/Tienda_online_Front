import React, { useState, useContext } from 'react';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, Row, Col, Badge, notification, Spin } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './registrar_talla.scss';
import { ProductoContext } from '../../contexts/ProductoContext';
/* import { StepsContext } from '../../contexts/stepsContext'; */

function RegistrarNumero(props) {
	const [ form ] = Form.useForm();
	const token = localStorage.getItem('token');
	const [ productoContext, disabledForm ] = useContext(ProductoContext);
	/* const [ disabled, setDisabled ] = useContext(StepsContext); */
	const setDisabled = props.disabledButtons;
	const [ productos, setProductos ] = useState([]);
	const [ loading, setLoading ] = useState(false);

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
		setLoading(true);
		await clienteAxios
			.post(`/productos/addNumero/${productoContext}`, datos, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
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

	const eliminarNumero = async (idnumero) => {
		setLoading(true);
		await clienteAxios
			.delete(`/productos/action/${productoContext}/numero/${idnumero}`, {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				obtenerNumero();
				setLoading(false);
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
			<div className="m-2" key={numero._id}>
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
		<Spin size="large" spinning={loading}>
			{disabledForm === false ? (
				<p className="mensaje-tallas-success">Ya puedes registrar numero de calzado.</p>
			) : (
				<p className="mensaje-tallas">Podrás registrar el numero de calzado despues de registrar tu producto</p>
			)}
			<p className="text-center mb-1">
				Escribe la talla del calzado y la cantidad de productos disponibles de esa talla.
			</p>
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
								<Button type="dafault" htmlType="submit" disabled={disabledForm} loading={loading}>
									Agregar
								</Button>
							</Col>
						</Row>
					</Input.Group>
				</Form>
			</div>
			<h6 className="mensaje">Para eliminar manten presionado</h6>
			<div className="row">{render}</div>
		</Spin>
	);
}
export default RegistrarNumero;
