import React, { useState, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import clienteAxios from '../../../../config/axios';
import { Form, Button, Input, InputNumber, Select, Steps, message, Upload} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './registrar_producto.scss'
import { ProductoContext } from '../../contexts/ProductoContext'
import { StepsContext } from '../../contexts/stepsContext'
import RegistrarGaleria from './registrar_galeria'
import RegistrarTalla from './registrar_talla'
import RegistrarNumero from './registrar_numero'

const { Option } = Select;
const { Step } = Steps;
const key = 'updatable';

///Layout para formulario(columnas)
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};

function RegistrarProducto(props) {
    const [ disabled, setDisabled ] = useContext(StepsContext);
    ///Autorizacion a la pagina con Token
    const token = localStorage.getItem('token');
    
    ////Activar y desactivar los botones Next y Prev
    
    /* const [ disabled, setDisabled ] = useState(true) */
    const [ disabledPrev, setDisabledPrev ] = useState(false)
    const [ disabledform, setDisabledForm ] = useState(true)
    const [ disabledformProductos, setDisabledFormProductos ] = useState(false)
    
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
    
    const [ productoID, setProductoID ] = useState('');
    
    async function onFinish(){
        const formData = new FormData();
        formData.append('nombre',datos.nombre);
        formData.append('categoria',select);
        formData.append('cantidad',datos.cantidad);
        formData.append('precio',datos.precio);
        formData.append('descripcion',datos.descripcion);
        formData.append('imagen',files);

        message.loading({ content: 'En proceso...', key });
        const respuesta = await clienteAxios.post('/productos/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                    Authorization: `bearer ${token}`
            }
        });
			try {
                if(!respuesta.data.err){
                        setDisabledPrev(true)
                        setDisabledFormProductos(true)
                        setDisabledForm(false)
                        setProductoID(respuesta.data.userStored._id)
                        message.success({
                            content: respuesta.data.message,
                            key,
                            duration: 3,
                        }); 
                }else{
                    message.error({
                        content: respuesta.data.message,
                        key,
                        duration: 3,
                    });
                }                
            } catch (error) {
                console.log(error)
                message.error({
                    content: 'Hubo un error',
                    key,
                    duration: 3,
                });
        }
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
                                    <Input name='nombre' disabled={disabledformProductos}/>
                                </Form.Item>
                                {select === 'otros' ?
                                <Form.Item label="Cantidad" onChange={datosForm}>
                                    <InputNumber min={1} name='cantidad' disabled={disabledformProductos} />
                                </Form.Item> : <></>}
                                <Form.Item label="Precio del producto" onChange={datosForm}>
                                    <InputNumber
                                        disabled={disabledformProductos}
                                        min={1}
                                        name='precio'
                                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                                <Form.Item label="Descripcion del producto" onChange={datosForm}>
                                    <Input.TextArea name='descripcion' disabled={disabledformProductos} />
                                </Form.Item>
                                <Form.Item label="Imagen principal">
                                    <Upload {...propss}>
                                        <Button disabled={disabledformProductos}>
                                            <UploadOutlined /> Upload
                                        </Button>
                                    </Upload>
                                </Form.Item>
                                <Form.Item className="d-flex justify-content-center align-items-center text-center">
                                    <Button type="primary" htmlType="submit" disabled={disabledformProductos}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                            {select === 'ropa' ?
                            <div className="d-flex justify-content-center">
                                <ProductoContext.Provider value={[productoID, disabledform]}>
                                    <RegistrarTalla />
                                </ProductoContext.Provider>
                            </div> : <></>
                            }
                            {select === 'calzado' ?
                            <div>
                                <ProductoContext.Provider value={productoID}>
                                    <RegistrarNumero />
                                </ProductoContext.Provider>
                            </div> : <></>
                            }
                        </div>
                    </div>
                </div>
		},
		{
			title: 'Galeria',
            content: 
                <div className="contenedor-galeria d-flex justify-content-center align-items-center mt-4 mb-5">
                    <div className="text-center" style={{width: '90%'}}>
                        <h2>Agrega mas imagenes para tu prodcuto</h2>
                        <p>Puedes agregar mas imagenes de tu producto para que tus clientes puedan verlas</p>
                        <ProductoContext.Provider value={productoID}>
                            <RegistrarGaleria /> 
                        </ProductoContext.Provider>               
                    </div>
                </div>
		}
	];

	return (
		<div>
            <div className="d-flex justify-content-center">
                <div style={{width: '80%'}}>
                    <Steps current={current}>{steps.map((item) => <Step key={item.title} title={item.title} />)}</Steps>
                </div>
            </div>
			<div className="steps-content">{steps[current].content}</div>
			<div className="steps-action d-flex justify-content-center align-items-center">
				{current < steps.length - 1 && (
					<Button type="primary" onClick={next} disabled={disabled}>
						Next
					</Button>
				)}
				{current === steps.length - 1 && (
                    <Button type="primary" 
                    onClick={() => {
                        message.success('Producto Creado!')
                        setTimeout(() => {
                            window.location.reload()
                        }, 3000)
                    }}>
                        
						Done
					</Button>
				)}
				{current > 0 && (
					<Button style={{ margin: '0 8px' }} onClick={prev} disabled={disabledPrev}>
						Previous
					</Button>
				)}
			</div>
		</div>
	);
}
export default withRouter(RegistrarProducto);

