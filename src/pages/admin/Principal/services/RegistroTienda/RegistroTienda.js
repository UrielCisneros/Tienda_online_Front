import React,{useState,useEffect} from 'react'
import {Form, Col, Row, Input,Divider, Button,Alert,Upload,notification} from 'antd';
import {PlusCircleOutlined,EditOutlined,UploadOutlined } from '@ant-design/icons';
import {Editor} from '@tinymce/tinymce-react';
import clienteAxios from '../../../../../config/axios';

export default function RegistroTienda(props) {
    const {datosNegocio,token} = props;

    const [datos, setDatos] = useState({})
    const [control, setControl] = useState(false)
    const [ form ] = Form.useForm();

    const [ upload, setUpload ] = useState(false);
    //Variables que guardan las imagenes
    const [ files, setFiles ] = useState([]);

    const monstrarInformacionBlog = (e) => {
        form.setFieldsValue(e)
     }

    useEffect(() => {
        if(!datosNegocio){
            setDatos(datosNegocio);
            setControl(true);
        }else{
            setDatos({});
            setControl(false);
        }
    }, [datosNegocio])

    const capturarPoliticasEditor = (content, editor) => {
        setDatos({...datos, politicas: content})
      }

      const capturarImagenCorpEditor = (content, editor) => {
        setDatos({...datos, imagenCorp: content})
      }

      const propss = {
		listType: 'picture',
		beforeUpload: (file) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (e) => {
				file.thumbUrl = e.target.result;
                setFiles(file);
            };
            setUpload(true)
			return false;
        },
        onRemove: (file) => {
            setUpload(false)
            setFiles([]);
        }
    };

    const SendForm = async () => {

            const datosEnvio = {
                nombre: datos.nombre,
                telefono:datos.telefono,
                direccion:[{
                        calle_numero: datos.calle_numero,
                        cp:datos.cp,
                        colonia:datos.colonia,
                        ciudad:datos.ciudad
                    }],
                ubicacion:[{
                        lat:datos.lat,
                        lng:datos.lng
                    }],
                politicas:datos.politicas,
                imagenCorp:datos.imagenCorp
            }
                

            

            const formData = new FormData();
            formData.append('nombre', datosEnvio.nombre);
            formData.append('telefono', datosEnvio.telefono);
            formData.append('direccion',datosEnvio.direccion);
            formData.append('ubicacion',datosEnvio.ubicacion);
            formData.append('politicas', datos.politicas);
            formData.append('imagenCorp', datos.imagenCorp);
            formData.append('imagen', files);

            if(control === false){
                await clienteAxios.post('/tienda/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `bearer ${token}`
                    }
                }).then((res) => {
                    console.log(res);
                        notification.success({
                            message: 'Registro exitoso',
                            description: res.data.message,
                          })

                })
                .catch((err) => {   
                    console.log(err.response);                 
                    if(err.response.status === 500 || err.response.status === 404){
                        notification.error({
                            message: 'Error de conexion',
                            description: err.response.data.message,
                          })
                    }else{
                        notification.error({
                            message: 'Error de conexion',
                            description: "Parece que algo salio mal, favor de intentarlo de nuevo",
                          })
                    }
                });        
            }else{

            }



        
    }

    

    return (
        <div>
            <Form
                onFinish={SendForm}
            >
                <div>
                <Divider>Logo del negocio</Divider>
                    <div className="m-auto">
                        <Form.Item label="Logo" >
                            <Upload {...propss} name="imagen">
                                <Button disabled={upload}>
                                    <UploadOutlined /> Subir
                                </Button>
                            </Upload>
                        </Form.Item>  
                        {control === false ? "" : (
                            <Form.Item label="Imagen Actual">
                                <img
                                    className="d-block img-fluid mt-2"
                                    width="200"
                                    alt="imagen de base"
                                    src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${datos.imagen}`}
                                />
                            </Form.Item>
                        )}
                    </div>
                <Divider>Informacion de la tienda</Divider>
                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Nombre"  onChange={ e => setDatos({ ...datos, nombre: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Nombre obligatorio' }]}  noStyle name="nombre" >
                                    <Input value={datos.nombre} name="nombre" placeholder="Nombre del negocio"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Telefono "  onChange={ e => setDatos({ ...datos, telefono: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Telefono obligatorio' }]}  noStyle name="telefono" >
                                    <Input value={datos.telefono} name="telefono" placeholder="Telefono"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Calle"  onChange={ e => setDatos({ ...datos, calle_numero: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Direccion obligatoria' }]}  noStyle name="calle_numero" >
                                    <Input value={datos.calle_numero} name="calle_numero" placeholder="Calle y Numero"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Codigo Postal "  onChange={ e => setDatos({ ...datos, cp: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Codigo Postal obligatorio' }]}  noStyle name="cp" >
                                    <Input value={datos.cp} name="cp" placeholder="Codigo Postal"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Colonia "  onChange={ e => setDatos({ ...datos, colonia: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Colonia obligatoria' }]}  noStyle name="colonia" >
                                    <Input value={datos.colonia} name="colonia" placeholder="Colonia"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Ciudad"  onChange={ e => setDatos({ ...datos, ciudad: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Direccion obligatoria' }]}  noStyle name="ciudad" >
                                    <Input value={datos.ciudad} name="ciudad" placeholder="Calle y Numero"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider>Ubicacion</Divider>
                    <div className="w-50" style={{margin: "auto"}} >
                        {control === false ? (                       
                             <Alert
                                description="Es necesario que la ubicacion sea registrada ya que esta hara que se muestre en el mapa"
                                type="info"
                            />)
                        : ""}

                    </div>

                    <Row>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Latitud "  onChange={ e => setDatos({ ...datos, lat: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Latitud obligatoria' }]}  noStyle name="lat" >
                                    <Input value={datos.lat} name="lat" placeholder="Latitud"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item className="m-2" label="Longitud"  onChange={ e => setDatos({ ...datos, lng: e.target.value }) }>
                                <Form.Item rules={[{ required: true, message: 'Longitud obligatoria' }]}  noStyle name="lng" >
                                    <Input value={datos.lng} name="lng" placeholder="Latitud"  />
                                </Form.Item>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Divider>Informacion de Politicas de la empresa</Divider>
                    <Row>
                        <Col span={24}>
                            <Form.Item className="m-2" >
                                <Form.Item rules={[{ required: true, message: 'Politicas de privacidad obligatorias' }]}  noStyle name="politicas" >
                                    <Editor
                                        disabled={false}
                                        init={{
                                            height: 450,
                                            menubar: true,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help'
                                        }}
                                        onEditorChange={capturarPoliticasEditor}
                                    />
                                </Form.Item>
                            </Form.Item>
                        </Col>
{/*                         <div className="w-50" style={{margin: "auto"}} >
                        {control === false ? (                       
                             <Alert
                                description="Recurda que en este apartado podras poner todas las politicas que sigue tu empresa, de manera legal"
                                type="info"
                            />)
                        : ""}
                    </div> */}
                    </Row>

                    <Divider>Imagen corporativa</Divider>
                    <Row>
                        <Col span={24}>
                            <Form.Item className="m-2" >
                                <Form.Item rules={[{ required: true, message: 'Imagen corporativa es obligatoria' }]}  noStyle name="imagenCorp" >
                                    <Editor
                                        disabled={false}
                                        init={{
                                            height: 450,
                                            menubar: true,
                                            plugins: [
                                                'advlist autolink lists link image charmap print preview anchor',
                                                'searchreplace visualblocks code fullscreen',
                                                'insertdatetime media table paste code help wordcount'
                                            ],
                                            toolbar:
                                                'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help'
                                        }}
                                        onEditorChange={capturarImagenCorpEditor}
                                    />
                                </Form.Item>
                            </Form.Item>
                        </Col>
{/*                         <div className="w-50" style={{margin: "auto"}} >
                        {control === false ? (                       
                             <Alert
                                description="Recurda que en este apartado podras poner todas las politicas que sigue tu empresa, de manera legal"
                                type="info"
                            />)
                        : ""}
                    </div> */}
                    </Row>
                </div>
                <Form.Item className="d-flex justify-content-center align-items-center text-center">
                    <Button className="text-center" size="large" type="primary" htmlType="submit" icon={control === false ? (<PlusCircleOutlined style={{ fontSize: 24 }} />):(<EditOutlined style={{ fontSize: 24 }} />)}>
                        {control === false ? "Registrar" : "Editar"}
                    </Button>
                </Form.Item>

            </Form>
        </div>
    )
}
