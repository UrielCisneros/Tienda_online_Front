import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './login.scss';

export default function Registro() {
	//State para mensaje
	const [ mensaje /* guardarMensaje  */] = useState(null);
	//Validacion del formulario
	const formik = useFormik({
		initialValues: {
			nombre: '',
			apellido: '',
			email: '',
			password: ''
		},
		validationSchema: Yup.object({
			nombre: Yup.string().required('*El nombre es obligatorio'),
			apellido: Yup.string().required('*El apellido es obligatorio'),
			email: Yup.string().email('*Email no valido').required('*El email es obligatorio'),
			password: Yup.string()
				.required('*El password es obligatorio')
				.min(6, '*El password deber tener un minimo de 6 caracteres')
		})
		/* onSubmit: async valores => {
            const { nombre, apellido, email, password } = valores;

            try {
                const { data } = await nuevoUsuario({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                })
                console.log(data);
                //Usuario creado correctamente
                guardarMensaje(`Se creo correctamente el usuario`);
                //redirigir usuario para iniciar sesion
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/login')
                }, 3000);
            } catch (error) {
                guardarMensaje(error.message.replace('GraphQL error:', ''));

                setTimeout(() => {
                    guardarMensaje(null);
                }, 3000);
            }
        } */
	});

	const mostrarMensaje = () => {
		return (
			<div className="bg-white py-2 px.3 w-full my-3 max-w-sm text-center mx-auto">
				<p>{mensaje}</p>
			</div>
		);
	};

	return (
		<div>
			{mensaje && mostrarMensaje()}
            {formik.touched.nombre && formik.errors.nombre ? (
				<div className="alerta p-1">
					<p className="mb-1">{formik.errors.nombre}</p>
				</div>
			) : null}
			{formik.touched.apellido && formik.errors.apellido ? (
				<div className="alerta p-1">
                    <p className="mb-1">{formik.errors.apellido}</p>
				</div>
			) : null}
			{formik.touched.email && formik.errors.email ? (
				<div className="alerta p-1">
                    <p className="mb-1">{formik.errors.email}</p>
				</div>
			) : null}
			{formik.touched.password && formik.errors.password ? (
				<div className="alerta p-1">
                    <p className="mb-1">{formik.errors.password}</p>
				</div>
			) : null}

			<div className="mt-2">
				<form className="bg-white rouded px-5 pb-2 mb-5" onSubmit={formik.handleSubmit}>
					<div className="mb-4">
						<label className="d-block font-weight-bolder mb-2" htmlFor="nombre">
							Nombre
						</label>
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
						<label className="d-block font-weight-bolder mb-2" htmlFor="password">
							Password
						</label>
						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="password"
							type="Password"
							placeholder="Password de usuario"
							value={formik.values.password}
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
