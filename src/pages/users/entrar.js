import React, { useEffect } from 'react'
import Registro from './registro'
import Login from './login'
import Firebase from '../../components/firebase'
import { Tabs, Divider } from 'antd'
import './entrar.scss'
import { withRouter } from 'react-router-dom'

const { TabPane } = Tabs;

function Entrar(props) {
    const token = localStorage.getItem('token')

    useEffect( () => {
        if(token){
            props.history.push('/')
        }
    })

    return(
        <div>
            <p className="text-center mb-4 mt-4">
                Si aun no tienes cuenta regístrate dando click en <strong>Crear cuenta</strong>
            </p>
            <div className="tabs">
                <Tabs className="shadow col-12 col-lg-4 bg-white rounded" defaultActiveKey="1">
                    <TabPane tab="Iniciar Sesión" key="1">
                        <div className="mt-3">
                            <Login />
                        </div>
                        <Divider />
                        <div>
                            <p >Accede con tu cuenta de Google o Facebook.</p>
                            <Firebase />
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