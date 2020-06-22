import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import { notification } from 'antd';
import firebaseConfig from '../config/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import clienteAxios from '../config/axios';

firebase.initializeApp(firebaseConfig);

function Firebase() {
	const [ user, setUser ] = useState({ isSignedIn: false });
	let valores = {
		nombre: '',
		apellido: '',
		email: '',
		contrasena: '',
		repeatContrasena: '',
		imagen: ''
	};
	let credenciales = {
		email: '',
		contrasena: ''
	};

	const uiConfig = {
		signInFlow: 'popup',
		signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID ]
	};

	const openNotificationWithIcon = (type, titulo, mensaje) => {
		notification[type]({
			message: titulo,
			description: mensaje
		});
	};

	const onAuthStateChange = async (callback) => {
		return firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const displayname = user.displayName.split(' ');
				valores = {
					nombre: displayname[0],
					apellido: displayname[1],
					email: user.email,
					contrasena: user.uid,
					repeatContrasena: user.uid,
					imagen: user.photoURL
				};
				credenciales = {
					email: user.email,
					contrasena: user.uid
				};
				try {
					clienteAxios.post('/cliente', valores).then((res) => {
						if (!res.data.err) {
							//Usuario creado correctamente
							openNotificationWithIcon('success', '¡Listo!', 'Usuario registrado.');
							callback({ isSignedIn: true });
							setTimeout(() => {
								//AQUI VAMOS A REDIRECCIONAR
								window.location.reload()
							}, 2000);
						} else if (res.data.err.code === 11000) {
							//si ese correo ya existe se inicia sesion
							try {
								clienteAxios.post('/cliente/auth', credenciales).then((res) => {
									const token = res.data;
									localStorage.setItem('token', token);
									callback({ isSignedIn: true });
									//redireccionar
									window.location.reload()
								});
							} catch (error) {
								openNotificationWithIcon('error', 'Error', error.response.data.message);
							}
						}
					});
				} catch (error) {
					openNotificationWithIcon('error', 'Error', error.response.data.message);
				}
			} else {
				callback({ isSignedIn: false });
			}
		});
	};

	useEffect(() => {
		onAuthStateChange(setUser);
	}, []);

	return (
		<div className="App">
			{user.isSignedIn ? (
				<span>
					<div>Signed In!</div>
				</span>
			) : (
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
			)}
		</div>
	);
}

export default Firebase;
