import React,{useState,useEffect} from 'react'
import {Col,Row,Badge,Select,Form, Button,Spin,notification} from 'antd'
import './DetalleApartado.scss';
import clienteAxios from '../../../../config/axios';

const { Option } = Select;

export default function DetalleApartado(props) {

    const {detalleApartado,setFilter,setEstado} = props;
    
    const [selectEstado, setSelectEstado] = useState('')
    const [ loading, setLoading ] = useState(false);

    const token = localStorage.getItem('token')

    useEffect(() => {
        setSelectEstado(detalleApartado.estado)
        setLoading(false)
    }, [detalleApartado])


    const handleonChange = (e) => {
        setSelectEstado(e)
    }

    const guardarEstadoApartado = async () => {
        const data = {
            estado: selectEstado
        }
        setLoading(true)
        await clienteAxios.put(`/apartado/${detalleApartado._id}`,data,{
            headers: {
                Authorization: `bearer ${token}`
            }
        })
        .then((res) => {
            setEstado(true)
            console.log(res);
            setLoading(false)
            notification.success({
                message: 'Hecho!',
                description: res.data.message,
                duration: 2
            });
            
        })
        .catch((err) => {
            console.log(err.response);
            setLoading(false)
            if (err.response.status === 404 || err.response.status === 500) {
                notification.error({
                    message: 'Error',
                    description: err.response.data.message,
                    duration: 2
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Hubo un error',
                    duration: 2
                });
            }
        })

    }


    return (
        <Spin size="large" spinning={loading}>
            <div className ="detalle-apartado">
                <Row>
                    <Col span={24} className="detalle-apartado__border d-block">
                        <p className="h3 text-center">Datos Usuario</p>
                        <div className="col-sm-12 col-lg-6 m-2">
                            <h6 className=" m-2">Nombre: </h6>
                            <p className=" m-2">{detalleApartado.cliente.nombre}</p>
                            <h6 className=" m-2">Telefono: </h6>
                            <p className=" m-2">{detalleApartado.cliente.telefono}</p>
                            <h6 className=" m-2">Calle: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].calle_numero}</p>}
                            <h6 className=" m-2">Calles referentes a las que vive: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].entre_calles}</p>}
                            <h6 className=" m-2">Codigo Postal: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].cp}</p>}
                        </div>
                        <div className="col-sm-12 col-lg-6 m-2">
                        <h6 className=" m-2">Colonia: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].colonia}</p>}
                            <h6 className=" m-2">Cidudad: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].ciudad}</p>}
                            <h6 className=" m-2">Estado: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].estado}</p>}
                            <h6 className=" m-2">Pais: </h6>
                            {<p className=" m-2">{detalleApartado.cliente.direccion[0].pais}</p>}
                        </div>
                    </Col>
                    <Col span={24} className="detalle-apartado__border d-block m-2">
                        <p className="h4 text-center">Datos producto</p>
                        <div className="">
                            <div className="DetalleApartdado-imagen">
                                <img
                                    className="img-fluid"
                                    width="200"
                                    alt="imagen de base"
                                    src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${detalleApartado.producto.imagen}`}
                                />
                            </div>
                            <h6 className=" m-2">Nombre: </h6>
                            <p className=" m-2">{detalleApartado.producto.nombre}</p>
                            <h6 className=" m-2">Codigo de barras: </h6>
                            {<p className=" m-2">{detalleApartado.producto.codigo}</p>}
                            <h6 className=" m-2">Categoria: </h6>
                            {<p className=" m-2">{detalleApartado.producto.categoria}</p>}
                            <h6 className=" m-2">Precio: </h6>
                            <p className=" m-2">$ {detalleApartado.producto.precio}</p>

                        </div>
                    </Col>
                    <Col span={24} className="m-2">
                        <div>
                            <div>
                            <p className="h3 text-center">Informacion a apartar</p>
                                <h6 className=" m-2">{detalleApartado.producto.categoria === 'calzado' ? 'Numero a apartar:': detalleApartado.producto.categoria === 'ropa' ? 'Talla a apartar' : '' }</h6>
                                    {detalleApartado.producto.categoria === 'calzado' ? (
                                        <Badge className="m-2">
                                                <p 
                                                    className="detalle-contenido-talla m-2"
                                                style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '40px', height: '56px' }}
                                                >
                                                    {detalleApartado.medida[0].numero}
                                                </p>
                                            </Badge>  
                                    ): detalleApartado.producto.categoria === 'ropa' ? (
                                        <Badge className="m-2">
                                            <p 
                                                className="detalle-contenido-talla m-2"
                                            style={{ backgroundColor: '#EEEEEE', fontSize: 40, minWidth: '40px', height: '56px' }}
                                            >
                                                {detalleApartado.medida[0].talla}
                                            </p>
                                        </Badge>
                                    ) : '' }
                            </div>
                            <h6 className=" m-2">Cantidad de articulos por apartar: </h6>
                            <p className=" m-2">{detalleApartado.cantidad}</p>
                            
                            <Form onFinish={guardarEstadoApartado}>
                            <Form.Item>
                                <Select value={selectEstado} placeholder="Seleciona una categoria" onChange={handleonChange} style={{ width: 300 }}>
                                    <Option value="PROCESANDO">En proceso</Option>
                                    <Option value="ACEPTADO">Aceptado</Option>
                                    <Option value="RECHAZADO">Rechazado</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                 <Button className="float-right" type="primary" htmlType="submit" >
                                    Guardar
                                </Button>
                            </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
        </Spin>
    )
}
