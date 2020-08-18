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
    const [ datos, setDatos ] = useState({
        estado_pedido: '',
        mensaje_admin: ''
    })

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
					mensaje_admin: res.data.mensaje_admin
                });
                setDatos({
                    ...datos, 'estado_pedido': res.data.estado_pedido, 'mensaje_admin': res.data.mensaje_admin
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
            ...datos, 'mensaje_admin': e.target.value
        });
        setPedido({
            ...pedido, mensaje_admin: e.target.value
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
			<Divider orientation="left">Estado del pedido</Divider>
			<Dropdown overlay={menu} disabled={IDpedido.estado_pedido === "Enviado" || disabled ? true : false}>
				<Button>
					{pedido.estado_pedido} <DownOutlined />
				</Button>
			</Dropdown>
			<Divider orientation="left">Mensaje para el cliente</Divider>
			<p>Si el producto ya fue enviado puedes mandarle un mensaje a tu cliente para notificarle</p>
			<Form onFinish={cambiarEstado} form={form}>
				<Form.Item name="mensaje_admin">
					<TextArea rows={4} name="mensaje_admin" onChange={onChange}/>
				</Form.Item>
				<Form.Item >
					<Button type="primary" htmlType="submit" className="float-right">
						Enviar
					</Button>
				</Form.Item>
			</Form>
		</Spin>
	);
};

export default EstadoPedido;
