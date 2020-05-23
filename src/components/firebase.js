import React, { Component } from "react"
import firebase from "firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

firebase.initializeApp({
  apiKey: "AIzaSyBXX7Q1VZ0CRwxmMEeDZl7VRQXs6QA9xuo",
  authDomain: "tienda-online-ab.firebaseapp.com"
})

class Firebase extends Component {
  state = { isSignedIn: false }
  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccess: () => false
    }
  }

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user })
      console.log("user", user)
    })
  }

  render() {
    console.log(firebase.auth())
    return (
      <div className="App">
        {this.state.isSignedIn ? (
          <span>
            <div>Signed In!</div>
            <button onClick={() => firebase.auth().signOut()}>Sign out!</button>
            <h5>Nombre: {firebase.auth().currentUser.displayName}</h5>
            <h5>email: {firebase.auth().currentUser.email}</h5>
            <h5>url imagen: {firebase.auth().currentUser.photoURL}</h5>
            <h5>user id: {firebase.auth().currentUser.uid}</h5>
            <h5>token {firebase.auth().currentUser.refreshToken}</h5>
            <img
              alt="profile picture"
              src={firebase.auth().currentUser.photoURL}
            />
          </span>
        ) : (
          <StyledFirebaseAuth
            uiConfig={this.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        )}
      </div>
    )
  }
}

export default Firebase