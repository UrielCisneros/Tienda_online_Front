import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { Form, Button, Input, InputNumber, Select, Steps, message, Upload, Modal } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import './registrar_producto.scss'
import ManualUpload from './registrar_galeria'

const { Option } = Select;
const { Step } = Steps;

///Layout para formulario(columnas)
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

function RegistrarProducto(props) {
    ///Autorizacion a la pagina con Token
    const token = localStorage.getItem('token');
    const rol = parseJwt(token);

    function parseJwt(token) {
		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch (e) {
			return null;
		}
	}

	useEffect(() => {
		if (token === '' || token === null) {
			props.history.push('/entrar');
		} else if (rol['rol'] !== true) {
			props.history.push('/');
		}
    });
    
    ////Activar y desactivar los botones Next y Prev
    
    const [ disabled, setDisabled ] = useState(true)
    const [ disabledPrev, setDisabledPrev ] = useState(false)
    
    const next = () => {
        setCurrent(current + 1);
        console.log(current)
        if(current === 0){
            setDisabled(true)
        }else if(current >= 1){
            setDisabledPrev(true)
        }else{
            setDisabledPrev(false)
        }  
	};

	const prev = () => {
        setCurrent(current - 1);
    };
    
    ///UPLOAD ANTD PRODUCTO
    const [files, setFiles ] = useState([])
    const propss = {
        listType: 'picture',
        beforeUpload: (file) => { 
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = e => {
                file.thumbUrl = e.target.result;
                setFiles(file)       
            };              
            return false;
        }      
    }; 
    
    ///capturar datos maualmente}
    const [datos, setDatos] = useState({
        nombre: '',
        talla: '',
        numero: '',
        cantidad: '',
        precio: '',
        descripcion: '',
        imagen: ''
    })
    //// Capturar valores del select
    const [ select, setSelect ] = useState('');

    const onSelect = value => {
        setSelect(value)
        if(value){
            setDisabled(false)
        }else{
            setDisabled(true)
        }
    };
    const datosForm = (e) => {
        setDatos({
            ...datos,
        [e.target.name] : e.target.value    
        })
    }
    /// Guardar y almacenar en la api REST
    async function onFinish(){
  
        const formData = new FormData();
        formData.append('nombre',datos.nombre);
        formData.append('categoria',select);
        formData.append('talla',datos.talla);
        formData.append('numero',datos.numero);
        formData.append('cantidad',datos.cantidad);
        formData.append('precio',datos.precio);
        formData.append('descripcion',datos.descripcion);
        formData.append('imagen',files);

        const respuesta = await clienteAxios.post('/productos/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
			try {
                console.log(respuesta)
            } catch (error) {
                console.log(error)
        }
        setDisabled(false)
    }; 
    
    /// Declaracion de variables para los pasos
    const [ current, setCurrent ] = useState(0);
    
    ////CONTENIDO DE LOS PASOS
	const steps = [
		{
			title: 'Categoria',
			content: 
                <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
                    <div className="text-center">
                        <h2 className="mb-5">Selecciona una categoria para continuar</h2>
                        <Select placeholder="Seleciona una categoria" onChange={onSelect} style={{ width: 300 }}>
                            <Option value="ropa">Ropa</Option>
                            <Option value="calzado">Calzado</Option>
                            <Option value="otros">Otros</Option>
                        </Select>
                    </div>
                </div>
		},
		{
			title: 'Producto',
            content: 
                <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
                    <div style={{width: 700}}>
                        <h2 className="mb-5 text-center">Registrar el producto</h2>
                        <div>
                            <Form {...layout} 
                                name="nest-messages" 
                                onFinish={onFinish} 
                                initialValues={{categoria: select, precio: 0}}>
                                <Form.Item label="Nombre del producto" onChange={datosForm}>
                                    <Input name='nombre' />
                                </Form.Item>
                                {/* {select === 'ropa' ?
                                <Form.Item label="Talla" onChange={datosForm}>
                                    <Input name='talla' />
                                </Form.Item> : <></>}
                                {select === 'calzado' ? 
                                <Form.Item label="Numero de calzado" onChange={datosForm}>
                                    <InputNumber name='numero' />
                                </Form.Item> :  <></>} */}
    
                                <Form.Item label="Cantidad" onChange={datosForm}>
                                    <InputNumber name='cantidad' />
                                </Form.Item>
                                <Form.Item label="Precio del producto" onChange={datosForm}>
                                    <InputNumber
                                        name='precio'
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                                <Form.Item label="Descripcion del producto" onChange={datosForm}>
                                    <Input.TextArea name='descripcion'/>
                                </Form.Item>
                                <Form.Item label="Imagen principal">
                                    <Upload {...propss}>
                                        <Button>
                                            <UploadOutlined /> Upload
                                        </Button>
                                    </Upload>
                                </Form.Item>
                                <Form.Item className="d-flex justify-content-center align-items-center text-center">
                                    <Button type="primary" htmlType="submit">
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                            {select === 'ropa' || select === 'calzado' ?
                            <div className="border">
                                hola
                            </div> : <></>
                            }
                        </div>
                    </div>
                </div>
		},
		{
			title: 'Galeria',
            content: 
                <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
                    <div className="text-center">
                        <h2 className="mb-5">Agrega mas imagenes para tu prodcuto</h2>
                        <p>Puedes agregar mas imagenes de tu producto para que tus clientes puedan verlas</p>
                        <h5>(Opcional) </h5>
                        <ManualUpload />
                    </div>
                </div>
		},
		{
			title: 'Descuento',
			content: 'fourth-content'
		},
		{
			title: 'promocionar',
			content: 'Last-content'
		}
	];

	return (
		<div>
			<Steps current={current}>{steps.map((item) => <Step key={item.title} title={item.title} />)}</Steps>
			<div className="steps-content">{steps[current].content}</div>
			<div className="steps-action d-flex justify-content-center align-items-center">
				{current < steps.length - 1 && (
					<Button type="primary" onClick={next} /* disabled={disabled} */>
						Next
					</Button>
				)}
				{current === steps.length - 1 && (
					<Button type="primary" onClick={() => message.success('Processing complete!')}>
						Done
					</Button>
				)}
				{current > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={prev} /* disabled={disabledPrev} */>
						Previous
					</Button>
				)}
			</div>
		</div>
	);
}
export default withRouter(RegistrarProducto);
