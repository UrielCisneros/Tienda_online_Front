import React, { useState } from 'react';
import clienteAxios from '../config/axios'
import { notification } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Registro() {
	//State para mensaje
	const [ mensaje ] = useState(null);
	//Validacion del formulario
	const formik = useFormik({
		initialValues: {
			nombre: '',
			apellido: '',
			email: '',
			contrasena: '',
			repeatContrasena: ''
		},
		validationSchema: Yup.object({
			nombre: Yup.string().required('*El nombre es obligatorio'),
			apellido: Yup.string().required('*El apellido es obligatorio'),
			email: Yup.string().email('*Email no valido').required('*El email es obligatorio'),
			contrasena: Yup.string()
				.required('*El password es obligatorio')
				.min(6, '*El password deber tener un minimo de 6 caracteres'),
			repeatContrasena: Yup.string().required('La Comfirmacion de la contraseña es requerida').oneOf([Yup.ref('contrasena'), null], 'Las contraseñas no coinciden')
		}),
		onSubmit: async (valores, {resetForm}) => {

            try {
				clienteAxios.post('/cliente', valores)
					.then(res => {
						if(!res.data.err){
							//Usuario creado correctamente
							openNotificationWithIcon('success', '¡Listo!','Usuario registrado.')
							//reset al form
							resetForm({})

						}else if(res.data.err.code === 11000){
							openNotificationWithIcon('error', 'Ups...','Este correo ya esta registrado')
						}
					})  
            } catch (error) {
				openNotificationWithIcon('error', 'Ups...','Hubo un error')
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
				<form className="bg-white rouded px-5 pb-2 mb-5" onSubmit={formik.handleSubmit}>
					<div className="mb-4">
						<label className="d-block font-weight-bolder mb-2" htmlFor="nombre">
							Nombre
						</label>
						{formik.touched.nombre && formik.errors.nombre ? (
							<div className="text-left">
								<p className="margin-0 text-weight-bold text-danger">{formik.errors.nombre}</p>
							</div>
						) : null}
						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="nombre"
							type="text"
							placeholder="Nombre de usuario"
							value={formik.values.nombre}
							onChange={formik.handleChange}
						/>
					</div>
				
					<div className="mb-4">
						<label className="d-block font-weight-bolder mb-2" htmlFor="apellido">
							Apellido
						</label>
						{formik.touched.apellido && formik.errors.apellido ? (
							<div className="text-left">
								<p className="margin-0 text-weight-bold text-danger">{formik.errors.apellido}</p>
							</div>
						) : null}

						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="apellido"
							type="text"
							placeholder="Apellido de usuario"
							value={formik.values.apellido}
							onChange={formik.handleChange}
						/>
					</div>

					<div className="mb-4">
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
							value={formik.values.email}
							onChange={formik.handleChange}
						/>
					</div>

					<div className="mb-4">
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
							type="Password"
							placeholder="Password de usuario"
							value={formik.values.contrasena}
							onChange={formik.handleChange}
						/>
					</div>

					<div className="mb-4">
						<label className="d-block font-weight-bolder mb-2" htmlFor="repeatContrasena">
							Repite la contraseña
						</label>
						{formik.touched.repeatContrasena && formik.errors.repeatContrasena ? (
							<div className="text-left">
								<p className="margin-0 text-weight-bold text-danger">{formik.errors.repeatContrasena}</p>
							</div>
						) : null}
						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="repeatContrasena"
							type="Password"
							placeholder="Password de usuario"
							value={formik.values.repeatContrasena}
							onChange={formik.handleChange}
						/>
					</div>

					<input
						type="submit"
						className="btn btn-info mt-2 p-2 text-white"
						value="Crear cuenta"
					/>
				</form>
			</div>
		</div>
	);
}
export default Registro