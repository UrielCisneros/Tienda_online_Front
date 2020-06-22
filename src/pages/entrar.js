import React, { useEffect } from 'react'
import Registro from './registro'
import Login from './login'
import Firebase from '../components/firebase'
import { Tabs } from 'antd'
import './entrar.scss'
import { withRouter } from 'react-router-dom'

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
  }

function Entrar(props) {
    const token = localStorage.getItem('token')

    useEffect( () => {
        if(token){
            props.history.push('/')
        }
    })

    return(
        <div>
            <h4 className="text-center mb-4 mt-4">
                Si aun no tienes cuenta regístrate dando click en "Crear cuenta"
            </h4>
            <div className="tabs">
                <Tabs className="shadow col-4 bg-white rounded" defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Iniciar Sesión" key="1">
                        <div>
                            <h5 className="">Accede con tu cuenta de Google o Facebook.</h5>
                            <Firebase />
                        </div>
                        <div className="mt-5 border-bottom"></div>
                        <div className="mt-3">
                            <h5>Inicia sesión con tu cuenta.</h5>
                            <Login />
                        </div>
                    </TabPane>
                    <TabPane tab="Crear cuenta" key="2">
                        <div className="mt-3">
                            <Registro />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}

export default withRouter(Entrar)