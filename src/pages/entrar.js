import React from 'react'
import Registro from './registro'
import Login from './login'
import Firebase from '../components/firebase'
import { Tabs } from 'antd'
import './entrar.scss'

const { TabPane } = Tabs;

function callback(key) {
    console.log(key);
  }

export default function Entrar() {
    return(
        <div>
            <h4 className="text-center mb-5">
                Si aun no tienes cuenta regístrate dando click en "Crear cuenta"
            </h4>
            <div className="tabs">
                <Tabs className="shadow col-4 bg-white rounded" defaultActiveKey="1" onChange={callback}>
                    <TabPane tab="Iniciar Sesión" key="1">
                        <Login />
                        <Firebase />
                    </TabPane>
                    <TabPane tab="Crear cuenta" key="2">
                        <Registro />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}
