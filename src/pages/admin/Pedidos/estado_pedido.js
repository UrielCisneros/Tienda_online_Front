import React, { useState, useEffect } from 'react';
import { Divider, Menu, Dropdown, Button, notification, Input, Form, Spin } from 'antd';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import clienteAxios from '../../../config/axios';

const { TextArea } = Input;

const EstadoPedido = (props) => {
    const [ form ] = Form.useForm();
    const token = localStorage.getItem('token');
    const IDpedido = props.datosPedido;
    const [ pedido, setPedido ] = useState([]);
    const pedidoID = props.datosPedido;
    const setReload = props.reload;
    const [ loading, setLoading ] = useState(false);
    const [ disabled, setDisabled ] = useState(false);
    const [ datos, setDatos ] = useState({})

    useEffect(() => {
        obtenerPedido();
		setDisabled(false);
    }, [IDpedido])

	const cambiarEstado = async () => {
		setLoading(true);
		await clienteAxios
			.put(`/pedidos/info/${pedidoID._id}`, datos,  {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
                setReload(true);
                setLoading(false);
                setDisabled(true);
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
	
    const obtenerPedido = async () => {
		setLoading(true);
		await clienteAxios
			.get(`/pedidos/pedido/${IDpedido._id}`,  {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setPedido(res.data);
                form.setFieldsValue({
					estado_pedido: res.data.estado_pedido, 
					mensaje_admin: res.data.mensaje_admin,
					url: res.data.url,
					paqueteria: res.data.paqueteria,
					codigo_seguimiento: res.data.codigo_seguimiento,
			   });
                setDatos({
					 estado_pedido: res.data.estado_pedido, 
					 mensaje_admin: res.data.mensaje_admin,
					 url: res.data.url,
					 paqueteria: res.data.paqueteria,
					 codigo_seguimiento: res.data.codigo_seguimiento,
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

	function handleMenuClick(e) {
        setDatos({
            ...datos, 'estado_pedido': e.key
        });
        setPedido({
            ...pedido, estado_pedido: e.key
        });
    }
    function onChange(e) {
        setDatos({
            ...datos, [e.target.name]: e.target.value
        });
        setPedido({
            ...pedido, [e.target.name]: e.target.value
        });
	}

	const menu = (
		<Menu onClick={handleMenuClick}>
			<Menu.Item key="En proceso" icon={<UserOutlined />}>
				En proceso
			</Menu.Item>
			<Menu.Item key="Enviado" icon={<UserOutlined />}>
				Enviado
			</Menu.Item>
		</Menu>
	);

	return (
		<Spin size="large" spinning={loading}>
			<Divider orientation="left">Actualiza el estado del pedido</Divider>
			<Dropdown overlay={menu} disabled={IDpedido.estado_pedido === "Enviado" || disabled ? true : false}>
				<Button>
					{pedido.estado_pedido} <DownOutlined />
				</Button>
			</Dropdown>
			<Divider orientation="left">Informacion de envio</Divider>
			<p style={{fontSize: 16}}>Si el producto ya fue enviado puedes agregar la información de envío.</p>

			<Form onFinish={cambiarEstado} form={form} className="form-paqueteria">
				<h6>Mensaje:</h6>
				<Form.Item name="mensaje_admin">
					<TextArea rows={4} name="mensaje_admin" placeholder="Mensaje para el usuario"  onChange={onChange}/>
				</Form.Item>
				<h6>Url de vinculación:</h6>
				<Form.Item name="url" onChange={onChange}>
					<Input name="url" placeholder="Url de vinculacion del paquete" />
				</Form.Item>
				<h6>Paquetería:</h6>
				<Form.Item name="paqueteria" onChange={onChange}>
					<Input name="paqueteria" placeholder="Nombre del Autor" />
				</Form.Item>
				<h6>Código de seguimiento:</h6>
				<Form.Item name="codigo_seguimiento" onChange={onChange}>
					<Input name="codigo_seguimiento" placeholder="Nombre del Autor" />
				</Form.Item>
				<Form.Item >
					<Button type="primary" htmlType="submit" className="float-right">
						Guardar
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
};

export default EstadoPedido;
