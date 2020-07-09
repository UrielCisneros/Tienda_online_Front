import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import firebaseConfig from '../config/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import clienteAxios from '../config/axios';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);

function Firebase() {
	const [ user, setUser ] = useState({ isSignedIn: false });
	let valores = {
		nombre: '',
		apellido: '',
		email: '',
		contrasena: '',
		imagen: ''
	};

	const uiConfig = {
		signInFlow: 'popup',
		signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID ]
	};

	async function onAuthStateChange(callback) {
		return firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const displayname = user.displayName.split(' ');
				valores = {
					nombre: displayname[0],
					apellido: displayname[1],
					email: user.email,
					uid: user.uid,
					imagen: user.photoURL
				};
				try {
					clienteAxios.post('/cliente/auth/firebase/', valores).then((res) => {
						if (!res.data.token) {
							notification['error']({
								message: 'Error',
								description: res.data.message,
								duration: 2
							});
						} else {
							//Usuario creado correctamente
							callback({ isSignedIn: true });
							const token = res.data.token;
							localStorage.setItem('token', token);
							window.location.reload();
							notification['success']({
								message: 'Listo!',
								duration: 2
							});
						}
					});
				} catch (error) {
					console.log(error);
					notification['error']({
						message: 'Error',
						duration: 2
					});
				}
			} else {
				callback({ isSignedIn: false });
			}
		});
	}

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
