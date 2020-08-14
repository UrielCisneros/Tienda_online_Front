import React,{useState,useEffect} from 'react'
import {Button,Drawer,Row,Col,Alert,notification,Empty} from 'antd';
import clienteAxios from '../../../../../config/axios';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Geolocalizacion from '../../../../users/geolocalizacion'
import './MostrarRegistroTienda.scss';
import {PlusCircleOutlined,EditOutlined,EyeOutlined } from '@ant-design/icons';
import Spin from '../../../../../components/Spin';
import RegistroTienda from './RegistroTienda';
import {Link} from 'react-router-dom';




 function MostrarRegistroTienda(props) {

    const {token} = props;

    const [action, setAction] = useState(false)
    const [visible, setVisible] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [datosNegocio, setDatosNegocio] = useState({})

    const [ reloadInfo, setReloadInfo ] = useState(false);

    const [lat,setLat] = useState("")
    const [lng,setLng] = useState("")

    const showDrawer = () => {
        setVisible(true);
      };
    const drawnerClose = () => {
        setVisible(false);
    };

    function peticionDatosTienda(){
        setLoading(true);
        clienteAxios.get(`/tienda/`)
        .then((res) => {
            console.log(res.data)
            setLoading(false);
            setDatosNegocio(res.data[0])
            if(res.data[0]){
                setAction(true)
                console.log(res.data[0].ubicacion[0].lat)
                console.log(res.data[0].ubicacion[0].lng)
                if(res.data[0].ubicacion[0].lat === "" || res.data[0].ubicacion[0].lat === "undefined"){
                    setLat("19.767980")
                }else{
                    setLat(res.data[0].ubicacion[0].lat)
                }
                if(res.data[0].ubicacion[0].lng === "" || res.data[0].ubicacion[0].lng === "undefined"){
                    setLng("-104.358159") 
                }else{
                    setLng(res.data[0].ubicacion[0].lng) 
                }
            }else{
                setLat("19.767980")
                setLng("-104.358159")
            }
/*             if(res.data[0] !== {}){
                setAction(true)
                setLat(res.data[0].ubicacion[0].lat)
                setLng(res.data[0].ubicacion[0].lng)
            }else{
                setLat("19.767980")
                setLng("-104.358159")
            } */
        }).catch((err) => {
            setLoading(false);
            setLat("19.767980")
            setLng("-104.358159")
            setDatosNegocio({})
            console.log(err)
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
        })
    }

    useEffect(() => {
        peticionDatosTienda();
        setReloadInfo(false)
    }, [reloadInfo])

    if (loading) {
        return <Spin/>;
    }


    
    return (
        <div className="info-tienda">
                <Drawer
                    title={action === false ? "Registrando la informacion del negocio" : "Actualizando la informacion del negocio"}
                    width={window.screen.width > 768 ? 1000 : window.screen.width}
                    placement={'right'}
                    onClose={drawnerClose}
                    visible={visible}
                    bodyStyle={{ paddingBottom: 80 }}
                    footer={
                        <div
                            style={{
                                textAlign: 'right'
                            }}
                        >
                            <Button onClick={drawnerClose} type="primary">
                                Cerrar
                            </Button>
                        </div>
                    }
                >
                    <RegistroTienda datosNegocio={datosNegocio} token={token} setLoading={setLoading} setReloadInfo={setReloadInfo} />
                </Drawer>
            
            <div className="d-flex">
                <Button
                    type="primary"
                    className="mostrarRegistroTienda-button m-3"
                    size="large"
                    icon={action === false ? (<PlusCircleOutlined style={{ fontSize: 24 }} />):(<EditOutlined style={{ fontSize: 24 }} />) }
                    onClick={() => {
                        showDrawer();
                    }}
                >
                    {action === false ? "Agregar informacion tienda" : "Actualizar informacion tienda"}
                </Button>
            </div>

            <div className="text-center mt-3">
                <h2 className="text-center h2 mb-4">{action === false ? "Parece que aun no agregas la inforacion de tu negocio":"Informacion de tu negocio"} </h2>
                <div className="w-50" style={{margin: "auto"}} >
                    {action === false ? (
                        <Alert
                            message="Nota:"
                            description={<AlertTienda />}
                            type="info"
                            showIcon
                        />
                    ): (
                        ""
                    )}
                </div>
                        {action === false ? "" : (
                            <div>
                                <p>Logo del negocio:</p>
                                <div className="mostrarRegistroTienda-imagen m-3">
                                    <img
                                        className="d-block img-fluid "
                                        width="200"
                                        alt="imagen de base"
                                        src={`https://prueba-imagenes-uploads.s3.us-west-1.amazonaws.com/${datosNegocio.imagenLogo}`}
                                    />
                                </div>
                            </div>
                        )}


                    <Row className="m-4">
                        <Col span={8}>
                            <p>Nombre del negocio: <span className="h6"> {action === false ? "Nombre de tu negocio": datosNegocio.nombre} </span> </p>
                        </Col>
                        <Col span={8}>
                            <p>Telefono:<span className="h6"> {action === false ? "Telefono": datosNegocio.telefono} </span></p>
                        </Col>
                        <Col span={8}> 
                            <p>Codigo Postal:<span className="h6"> {action === false ? "Codigo Postal": datosNegocio.direccion[0].cp} </span></p>
                        </Col>
                    </Row>


                    <Row className="m-4">
                        <Col span={8}>
                            <p>Calle:<span className="h6"> {action === false ? "Calle": datosNegocio.direccion[0].calle_numero} </span></p>
                        </Col>
                        <Col span={8}>
                            <p>Colonia:<span className="h6"> {action === false ? "Colonia": datosNegocio.direccion[0].colonia} </span></p>
                        </Col>
                        <Col span={8}>
                            <p>Ciudad:<span className="h6"> {action === false ? "Colonia": datosNegocio.direccion[0].ciudad} Ciudad</span></p>
                        </Col>
                    </Row>


                    <Row className="m-4">
                        <Col span={24}>
                            <p>Estado:<span className="h6"> {action === false ? "Estado": datosNegocio.direccion[0].estado}</span></p>
                        </Col>
                    </Row>
                    
                    <Row className="m-4">
                        <Col span={24}>
                        <p className="m-3 ">Ubicacion actual: </p>
                            <Geolocalizacion 
                                height="60vh"
                                width="100%"
                                center={[lat, lng]}
                                titleLayer={'map'}
                                zoom={15}
                                apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                                nombreMarcador = "AB soluciones Empresariales"
                            />
                        </Col>   
                    </Row>

                    <Row>
                        <Col span={12}>
                        <p className="m-3 h3">Politicas de provacidad</p>
                        {action === false ? (
                            <Empty description={<p className="h6">Aun no hay informacion</p>} />
                        ):(
                            <Empty image="https://es.seaicons.com/wp-content/uploads/2015/11/Review-Post-icon1.png" description={<p className="h6">Informacion existente</p>} >
                                <Link to={`/`} target="_blank">
                                    <Button type="dashed">
                                        <EyeOutlined /> Ver
                                    </Button>
                                </Link>
                            </Empty>
                        )}
                            
                        </Col>
                        <Col span={12}>
                        <p className="m-3 h3">Imagen coorporativa</p>
                        {action === false ? (
                            <Empty description={<p className="h6">Aun no hay informacion</p>} />
                        ):(
                            <Empty image="https://es.seaicons.com/wp-content/uploads/2015/11/Review-Post-icon1.png" description={<p className="h6">Informacion existente</p>} >
                                <Link to={`/`} target="_blank">
                                    <Button type="dashed">
                                        <EyeOutlined /> Ver
                                    </Button>
                                </Link>
                            </Empty>
                        )}
                        </Col>
                    </Row>


            </div>
        </div>
    )
}


function AlertTienda(){

    return(
        <div>
            <p className="h6">Recuerda que tener la informacion de tu negocio es importante, ya que esta informacion ayudara que tu negocio sea encontrado mas facilmente.</p>
        </div>
    )
}

export default withRouter(MostrarRegistroTienda);