import React, { useState } from 'react';
import clienteAxios from '../config/axios';
import { withRouter } from 'react-router-dom';
import { useFormik } from 'formik';
import { notification } from 'antd';
import * as Yup from 'yup';

function Login(props) {
	//State para mensaje
	const [ mensaje ] = useState(null);
	//Validacion del formulario
	const formik = useFormik({
		initialValues: {
			email: '',
			contrasena: ''
		},
		validationSchema: Yup.object({
			email: Yup.string().email('*El email no es valido').required('*El email no puede ir vacio'),
			contrasena: Yup.string().required('*La contraseña es obligatoria')
		}),
		onSubmit: async (valores) => {
			try {
				const respuesta = await clienteAxios.post('/cliente/auth', valores);
				const token = respuesta.data;
				//coloca en local storage del navegador
				localStorage.setItem('token', token);
				//redireccionar
				props.history.push('/');
			} catch (error) {
				if(error.response.data.message === 'Este usuario no existe'){
					try {
						const respuesta = await clienteAxios.post('/admin/auth', valores);
						const token = respuesta.data;
						//coloca en local storage del navegador
						localStorage.setItem('token', token);
						//redireccionar
						props.history.push('/admin');
					} catch (error) {
						openNotificationWithIcon('error', 'Error',error.response.data.message)
					}
				}else{
					openNotificationWithIcon('error', 'Error',error.response.data.message)
				}				
			}
		}
	});

	const openNotificationWithIcon = (type, titulo, mensaje) => {
		notification[type]({
		  message: titulo,
		  description: mensaje
		});
	};

	const mostrarMensaje = () => {
		return (
			<div className="py-2 px-3 my-3 text-center mx-auto">
				<p>{mensaje}</p>
			</div>
		);
	};

	return (
		<div>
			{mensaje && mostrarMensaje()}

			<div className="mt-2">
				<form className="bg-white rouded px-5 pt-2 pb-2 mb-2" onSubmit={formik.handleSubmit}>
					<div className="mb-2">
						<label className="d-block font-weight-bolder mb-2" htmlFor="email">
							Email
						</label>
						{formik.touched.email && formik.errors.email ? (
							<div className="text-left">
								<p className="margin-0 text-weight-bold text-danger">{formik.errors.email}</p>
							</div>
						) : null}

						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="email"
							type="email"
							placeholder="Email de usuario"
							onChange={formik.handleChange}
							value={formik.values.email}
						/>
					</div>

					<div className="mb-2">
						<label className="d-block font-weight-bolder mb-2" htmlFor="contrasena">
							Contraseña
						</label>
						{formik.touched.contrasena && formik.errors.contrasena ? (
							<div className="text-left">
								<p className="margin-0 text-weight-bold text-danger">{formik.errors.contrasena}</p>
							</div>
						) : null}

						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="contrasena"
							type="password"
							placeholder="Contrasena"
							onChange={formik.handleChange}
							value={formik.values.contrasena}
						/>
					</div>

					<input type="submit" className="btn btn-info mt-2 p-2 text-white" value="Iniciar Sesión" />
				</form>
			</div>
		</div>
	);
}
export default withRouter(Login);
