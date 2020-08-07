import React,{useState,useEffect} from 'react'
import {Form, Col, Row, Input,Divider, Button,Alert} from 'antd';
import {PlusCircleOutlined,EditOutlined } from '@ant-design/icons';

export default function RegistroTienda(props) {
    const {datosNegocio} = props;

    const [datos, setDatos] = useState({})
    const [control, setControl] = useState(false)
    const [ form ] = Form.useForm();

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

    console.log(datos);

    const SendForm = () => {
        console.log(datos)
    }

    

    return (
        <div>
            <Form
                onFinish={SendForm}
            >
                <div>
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
                        <Alert
                            description="Es necesario que la ubicacion sea registrada ya que esta hara que se muestre en el mapa"
                            type="info"
                        />
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
                    <Divider>Informacion de Piliticas de la empresa</Divider>
                    
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
