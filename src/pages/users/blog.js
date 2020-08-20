import React, { useState, useEffect } from 'react';
// import clienteAxios from '../../../config/axios';


import {
    Form,
    Input,
    Button,
    Radio,
    InputNumber,
    Switch,
    Select
  } from 'antd';

  const { TextArea } = Input;
  const { Option} = Select;


export default function Blog() {

    const [componentSize, setComponentSize] = useState('default');
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    return (
        <div className="container">
            <div className=" col-lg-12 px-5 ">
        <Form 
                wrapperCol={{ span: 10 }}
                layout="horizontal"
                initialValues={{ size: componentSize }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
            >
                <Form.Item label="Puedes cambiar tu vista" name="size" className="mt-5">
                <Radio.Group>
                    <Radio.Button value="small">Pequeño</Radio.Button>
                    <Radio.Button value="default">Normal</Radio.Button>
                    <Radio.Button value="large">Grande</Radio.Button>
                </Radio.Group>
                </Form.Item>

                <h2 className="text-aling-center">Informacion Basica:</h2>

                <Form.Item help="Ingresa su nombre completo">
                    <h2>Nombre</h2>
                    <Input  placeholder="Usuario Usuario" />
                </Form.Item>

                <Form.Item 
                help="Añade un encabezamiento profesional como, Ingeniero">
                <Input  placeholder="Ingeniero en " />
                </Form.Item>

                <Form.Item >
                    <h2>Agrega una descripcion:</h2>
                    <TextArea rows={4} />
                </Form.Item>
                
                <Form.Item >
                    <h2>Selecciona Idioma:</h2>
                    <Select defaultValue="Lenguaje">
                        <Option value="Lenguaje">Lenguajes</Option>
                        <Option value="espanol">Espanol (Espana)</Option>
                    </Select>
                </Form.Item>

                <Form.Item >
                    <h2>Enlaces:</h2>
                    <Input placeholder="Pagina web (hhtp(s)://.." />
                </Form.Item>

                <Form.Item help="Agrega un usuario de Twitter">
                    <Input addonBefore="http://twitter.com/" placeholder="Perfil de Twitter" />
                </Form.Item>

                <Form.Item  help="Agrega un usuario de Facebook">
                <Input addonBefore="http://Facebook.com/" placeholder="Perfil de Facebook" />
                </Form.Item>

                <Form.Item  help="Agrega un usuario de linkedin">
                <Input addonBefore="http://linkedin.com/" placeholder="Perfil de linkedin" />
                </Form.Item>

                <Form.Item help="Agrega un usuario de Instagram">
                <Input addonBefore="http://instagram.com/" placeholder="Perfil de Instagram" />
                </Form.Item>
        </Form>
        </div>
        </div>
    )
}
