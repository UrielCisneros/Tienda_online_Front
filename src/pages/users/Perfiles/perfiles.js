import React, { useState} from 'react';
import {withRouter } from 'react-router-dom';

import {
    Form,
    Input,
    Divider,
    Select,
    Button
  } from 'antd';

  const { Option} = Select;


export default function Perfiles() {

    return (
    <div className="container col-lg-6">
         <h1 className="mt-5 text-center">Bienvenido a tu perfil</h1>
            <div className="mt-3 px-5 mx-auto" style={{background: "white", left: "50%"}}>
                <br/>
            <Form 
                    layout="horizontal"
                    size={"large"}
                >

                    <Divider style={{fontSize: 22}}>Información Personal</Divider>
                    <br/>
                    <Form.Item >
                        <h2>Nombre</h2>
                        <Input  placeholder="Nombre" />
                    </Form.Item>
                    <Form.Item >
                        <h2>Apellidos:</h2>
                        <Input  placeholder="Apellidos" />
                    </Form.Item>

                    <Form.Item >
                        <h2>Email:</h2>
                        <Input  placeholder="usuario@usuario.hotmail.com" />
                    </Form.Item>
                    
                    <Form.Item >
                        <h2>Telefono</h2>
                        <Input  placeholder="+52 3171234567" />
                    </Form.Item>
                    <br/>
                    <Divider className="mt-5" style={{fontSize: 22}}>Datos domiciliarios</Divider>
                    
                    <Form.Item >
                        <h2>Calle y Numero</h2>
                        <Input.Group compact>
                            <Input style={{ width: '80%' }} placeholder="Calle"  />
                            <Input style={{ width: '20%' }} placeholder="Numero" />
                        </Input.Group>
                    </Form.Item>

                    <Form.Item >
                        <h2>Entre calles</h2>
                        <Input.Group compact>
                            <Input style={{ width: '50%' }} placeholder="Calle 1"  />
                            <Input style={{ width: '50%' }} placeholder="Calle 2" />
                        </Input.Group>
                    </Form.Item>

                    <Form.Item >
                        <h2>Codigo postal</h2>
                        <Input  placeholder="C.P." />
                    </Form.Item>

                    <Form.Item >
                        <h2>Colonia</h2>
                        <Input  placeholder="Colonia" />
                    </Form.Item>

                    <Form.Item >
                        <h2>Ciudad: </h2>
                        <Input  placeholder="Localidad" />
                    </Form.Item>

                    <Form.Item >
                        <h2>Estado: </h2>
                        <Input  placeholder="Estado:" />
                    </Form.Item>

                    <Form.Item >
                        <h2>País: </h2>
                        <Input  placeholder="País:" />
                    </Form.Item>

                    <Form.Item >
                        <h2>Imagen:</h2>
                        <Input  placeholder="País:" />
                    </Form.Item>

                    <Form.Item >
                        <h2>Contraseña:</h2>
                        <Input.Password placeholder="Password" />
                    </Form.Item>

                    <Form.Item >
                        <h2>Confirmar Contraseña:</h2>
                        <Input.Password placeholder="Password" />
                    </Form.Item>
            </Form>
            
            <br/>
            <div className="d-flex justify-content-center pb-3">
                <Button type="primary" size="large" style={{width: 150, fontSize: 20}}>
                    Guardar
                </Button>
            </div>

            </div>
    </div>
    )
}
