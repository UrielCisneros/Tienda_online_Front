import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import firebaseConfig from '../../config/firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import clienteAxios from '../../config/axios';
import * as firebase from 'firebase/app';
/* import * as firebaseui from 'firebaseui'; */
import 'firebase/auth';
import 'firebase/firestore';

firebase.initializeApp(firebaseConfig);
/* var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.disableAutoSignIn(); */

function Firebase() {
	const [ user, setUser ] = useState(false);

	const uiConfig = {
		signInFlow: 'popup',
		signInOptions: [ firebase.auth.GoogleAuthProvider.PROVIDER_ID ],
		callbacks: {
		  // Avoid redirects after sign-in.
		  signInSuccessWithAuthResult: () => false
		}
	};
 
	useEffect(() => {
		let valores = {
			nombre: '',
			apellido: '',
			email: '',
			contrasena: '',
			imagen: ''
		};
		function onAuthStateChange() {
			return firebase.auth().onAuthStateChanged(async (user) => {
				if (user) {
					console.log(user.photoURL)
					const displayname = user.displayName.split(' ');
					valores = {
						nombre: displayname[0],
						apellido: displayname[1],
						email: user.email,
						uid: user.uid,
						imagen: user.photoURL
					};
	
					await clienteAxios
						.post('/cliente/auth/firebase/', valores)
						.then((res) => {
							//Usuario creado correctamente
							setUser(!!user);
							const token = res.data.token;
							localStorage.setItem('token', token);
							window.location.href = '/'
							notification['success']({
								message: 'Listo!',
								duration: 2
							});
						})
						.catch((res) => {
							if (res.response.status === 404 || res.response.status === 500) {
								notification['error']({
									message: 'Error',
									description: res.response.data.message,
									duration: 2
								});
							} else {
								notification['error']({
									message: 'Error',
									description: 'Hubo un error',
									duration: 2
								});
							}
						});
				} else {
					setUser(false);
				}
			});
		}
		onAuthStateChange();
	}, []);

	return (
		<div className="App">
			{user ? (
				<span>
					<div>Signed In!</div>
				</span>
			) : (
				<StyledFirebaseAuth uiCallback={ui => ui.disableAutoSignIn()} uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
			)}
		</div>
	);
}

export default Firebase;
