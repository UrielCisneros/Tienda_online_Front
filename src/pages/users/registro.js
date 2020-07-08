import React, { useState } from 'react';
import clienteAxios from '../../config/axios'
import { notification, Form, Input, Button } from 'antd';
import { withRouter } from 'react-router-dom';

const layout = {
	labelCol: { span: 8 },
	wrapperCol: { span: 12 }
};
const tailLayout = {
	wrapperCol: { offset: 7, span: 10}
};

function Registro(props) {
	
	const onFinish = async (values) => {
		const res = await clienteAxios.post('/cliente/', values);
		try {
			if(!res.data.user){
				notification['error']({
					message: 'Error',
					description: res.data.message,
					duration: 2
				});
			}else{
				const token = res.data.user;
				localStorage.setItem('token', token);
				props.history.push('/');
				notification['success']({
					message: 'Hecho!',
					description: 'Te has registrado correctamente',
					duration: 2
				});
			}
		} catch (error) {
			notification['error']({
				message: 'Error',
				description: 'Hubo un error',
				duration: 2
			});
		}
	}

	return (
		<div>
			<Form
				{...layout}
				name="basic"
				initialValues={{ remember: true }}
				onFinish={onFinish}
			>
				<Form.Item
					label="Nombre"
					name="nombre"
					rules={[ { required: true, message: 'El nombre es obligatorio!' } ]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Apellido"
					name="apellido"
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Correo"
					name="email"
					rules={[ { required: true, message: 'El email es obligatorio!' } ]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label="Contraseña"
					name="contrasena"
					rules={[ { required: true, message: 'La contraseña es obligatoria!' } ]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item
					label="Confirmar contraseña"
					name="repeatContrasena"
					rules={[ { required: true, message: 'La contraseña es obligatoria!' } ]}
				>
					<Input.Password />
				</Form.Item>

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Registrarse
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
export default withRouter(Registro);