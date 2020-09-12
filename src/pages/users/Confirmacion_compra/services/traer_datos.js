import React,{useCallback,useEffect,useState} from 'react';
import clienteAxios from '../../../../config/axios';

import {Form, Input, Divider, Button, notification} from 'antd';

import "../confirmacion.scss";

export default function Traer_datos(props) {

    const {datosUser,decoded,token,setLoading,setAccion} = props;
    const [datosFormulario, setdatosFormulario] = useState({});


    const [ form ] = Form.useForm();

    const mostrarDatosUser = (e) => {
        form.setFieldsValue(e)
    }


    useEffect(() => {
        console.log(datosUser);
        if(datosUser !== null){
            let direccion = {};
            if(datosUser.direccion.length > 0){
                direccion =  datosUser.direccion[0];
            }
            
            mostrarDatosUser({
                nombre: datosUser.nombre,
                calle_numero: direccion.calle_numero,
                entre_calles: direccion.entre_calles,
                cp: direccion.cp,
                colonia: direccion.colonia,
                ciudad: direccion.ciudad,
                estado: direccion.estado,
                pais: direccion.pais, 
            })
            setdatosFormulario({
                calle_numero: direccion.calle_numero,
                entre_calles: direccion.entre_calles,
                cp: direccion.cp,
                colonia: direccion.colonia,
                ciudad: direccion.ciudad,
                estado: direccion.estado,
                pais: direccion.pais, 
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [datosUser])

    async function enviarDatosUser(){
        
        const formData = new FormData();

     
        formData.append('calle_numero', datosFormulario.calle_numero);
        formData.append('entre_calles', datosFormulario.entre_calles);
        formData.append('cp', datosFormulario.cp);
        formData.append('colonia', datosFormulario.colonia);
        formData.append('ciudad', datosFormulario.ciudad);
        formData.append('estado', datosFormulario.estado);
        formData.append('pais', datosFormulario.pais);


        setAccion(true);
        await clienteAxios.put(`/cliente/${decoded._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                 Authorization: `bearer ${token}`
            }
        })
        .then((res) => {
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.setItem('token', res.data.token);
                window.location.reload();
            },1000)
            setLoading(false)
            console.log(res);
            notification.success({
                message: 'Hecho!',
                description: res.data.message,
                duration: 2
            });
        })
        .catch((res) => {
            console.log(res.response);
            setLoading(false);
            if(res.response.status === 404 || res.response.status === 500){
                notification.error({
                    message: 'Error',
                    description: `${res.response.data.message}`,
                    duration: 2
                });
            }else{
                notification.error({
                    message: 'Error',
                    description: 'Error de conexion',
                    duration: 2
                });
            }

        });
    }

      if(decoded === null){
          return null
      }

      const datosForm = (e) => {
		setdatosFormulario({
			...datosFormulario,
			[e.target.name]: e.target.value
		});
    };
    
   
    return (
        <div>
            <h2 style={{fontSize: 18, textAlign: "center"}}>Hola, favor de verificar que tus datos esten correctos o de igual manera completar los restantes:</h2>
            
             <Form 
                layout="horizontal"
                size={"large"}
                form={form}
                onFinish={enviarDatosUser}
            >
                <Divider className="mt-5" style={{fontSize: 22}}>Datos domiciliarios</Divider>
                    
                    <h5>Direccion:</h5>
                    <Form.Item name="calle_numero"  onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'Direccion obligatoria' }]}  noStyle name="calle_numero" >
                            <Input name="calle_numero" a placeholder="Calle y numero de calle"  />
                        </Form.Item>
                    </Form.Item>


                    <h5>Referencia:</h5>
                    <Form.Item name="entre_calles" onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'Referencia obligatoria' }]}  noStyle name="entre_calles" >
                            <Input name="entre_calles" a placeholder="Calles de referencia"  />
                        </Form.Item>
                    </Form.Item>

                    <h5>Codigo postal:</h5>
                    <Form.Item name="cp" onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'Codigo postal obligatorio' }]}  noStyle name="cp" >
                            <Input name="cp" a placeholder="Codigo Postal"  />
                        </Form.Item>
                    </Form.Item>

                    <h5>Colonia:</h5>
                    <Form.Item name="colonia" onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'Colonia obligatoria' }]}  noStyle name="colonia" >
                            <Input name="colonia" a placeholder="Colonia"  />
                        </Form.Item>
                    </Form.Item>

                    <h5>Ciudad: </h5>
                    <Form.Item name="ciudad" onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'Localidad obligatoria' }]}  noStyle name="ciudad" >
                            <Input name="ciudad" a placeholder="Localidad"  />
                        </Form.Item>
                    </Form.Item>

                    <h5>Estado:</h5>
                    <Form.Item name="estado" onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'Estado obligatoria' }]}  noStyle name="estado" >
                            <Input name="estado" a placeholder="Estado"  />
                        </Form.Item>
                    </Form.Item>

                    <h5>País:</h5>
                    <Form.Item name="pais" onChange={datosForm}>
                        <Form.Item rules={[{ required: true, message: 'País obligatoria' }]}  noStyle name="pais" >
                            <Input name="pais" a placeholder="País"  />
                        </Form.Item>
                    </Form.Item>

            </Form>
            <div className="d-flex justify-content-center pb-3">
                <Button htmlType="submit" type="primary" size="large" style={{width: 150, fontSize: 20}}>
                    Guardar
                </Button>
            </div>
        </div>
    )
}
