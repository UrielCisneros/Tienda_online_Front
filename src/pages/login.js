import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './login.scss'

export default function Login() {
	//State para mensaje
	const [ mensaje, guardarMensaje ] = useState(null);
	//Validacion del formulario
	const formik = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema: Yup.object({
			email: Yup.string().email('El email no es valido').required('El email no puede ir vacio'),
			password: Yup.string().required('El password es obligatorio')
		})
		/* onSubmit: async valores => {
            const { email, password } = valores;

            try {
                const { data } = await autenticarUsuario({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                })
                console.log(data);
                //Usuario creado correctamente
                guardarMensaje('Autenticando...');
                //guadar tolken en localStorage
                const { token } = data.autenticarUsuario;
                localStorage.setItem('token', token);
                //redirigir usuario para iniciar sesion
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/')
                }, 2000);
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
			<div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
				<p>{mensaje}</p>
			</div>
		);
	};

	return (
		<div>
			{mensaje && mostrarMensaje()}

			<div className="mt-5">
				<form className="bg-white rouded px-5 pt-2 pb-2 mb-5" onSubmit={formik.handleSubmit}>
					<div className="mb-4">
						<label className="d-block font-weight-bolder mb-2" htmlFor="email">
							Email
						</label>
						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="email"
							type="email"
							placeholder="Email de usuario"
							onChange={formik.handleChange}
							value={formik.values.email}
						/>
					</div>

					{formik.touched.email && formik.errors.email ? (
						<div className="alerta p-1">
							<p className="font-weight-bolder mb-0">Error</p>
							<p className="mb-1">{formik.errors.email}</p>
						</div>
					) : null}

					<div className="mb-4">
						<label className="d-block font-weight-bolder mb-2" htmlFor="password">
							Password
						</label>
						<input
							className="form-control shadow border rounded font-weight-lighter py-2 px-3"
							id="password"
							type="password"
							placeholder="Password de usuario"
							onChange={formik.handleChange}
							value={formik.values.password}
						/>
					</div>

					{formik.touched.password && formik.errors.password ? (
						<div className="alerta p-1">
							<p className="font-weight-bolder mb-0">Error</p>
							<p className="mb-1">{formik.errors.password}</p>
						</div>
					) : null}

					<input
						type="submit"
						className="btn btn-info mt-2 p-2 text-white"
						value="Iniciar Sesión"
					/>
				</form>
			</div>
		</div>
	);
}
