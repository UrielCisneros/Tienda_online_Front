import React from 'react';
import clienteAxios from '../../config/axios';
import { withRouter } from 'react-router-dom';
import { notification, Form, Input, Button } from 'antd';

const layout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 14 }
};
const tailLayout = {
	wrapperCol: { offset: 7, span: 10 }
};

function Login(props) {
	const onFinish = async (values) => {
		await clienteAxios
			.post('/cliente/auth', values)
			.then((res) => {
				const token = res.data.token;
				localStorage.setItem('token', token);
				props.history.push('/admin');
				notification.success({
					message: 'Bienvenido!',
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

	return (
		<div>
			<Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish}>
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

				<Form.Item {...tailLayout}>
					<Button type="primary" htmlType="submit">
						Acceder
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
}
export default withRouter(Login);
