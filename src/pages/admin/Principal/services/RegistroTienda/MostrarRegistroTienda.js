import React,{useState,useEffect} from 'react'
import {Button,Drawer,Form,Row,Col,Alert,notification} from 'antd';
import clienteAxios from '../../../../../config/axios';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Geolocalizacion from '../../../../users/geolocalizacion'
import './MostrarRegistroTienda.scss';
import {PlusCircleOutlined,EditOutlined } from '@ant-design/icons';
import Spin from '../../../../../components/Spin';
import RegistroTienda from './RegistroTienda';




 function MostrarRegistroTienda(props) {

    const [action, setAction] = useState(false)
    const [visible, setVisible] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [datosNegocio, setDatosNegocio] = useState([])

    const [lat] = useState("19.767980")
    const [lng] = useState("-104.358159")

    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 

        //Verificar el JWT
    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }
    
    //Decodificar el JWT
	function Jwt(token) {
		try {
            return jwt_decode(token);
		} catch (e) {
			return null;
		}
    }



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
            console.log(res);
            setLoading(false);
            setDatosNegocio(res.data)
        }).catch((err) => {
            setLoading(false);
            console.log(err)
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
        })
    }

    useEffect(() => {
        peticionDatosTienda()
    }, [])

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
                    <RegistroTienda datosNegocio={datosNegocio} />
                </Drawer>
            
            <div className="d-flex">
                <Button
                    type="primary"
                    className="float-right ml-3"
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


                    <Row className="m-4">
                        <Col span={8}>
                            <p>Nombre del negocio: <span className="h6"> Nombre del negocio</span> </p>
                        </Col>
                        <Col span={8}>
                            <p>Telefono:<span className="h6">Telefono</span></p>
                        </Col>
                        <Col span={8}> 
                            <p>Codigo Postal:<span className="h6">Codigo Postal</span></p>
                        </Col>
                    </Row>


                    <Row className="m-4">
                        <Col span={8}>
                            <p>Calle:<span className="h6">Calle</span></p>
                        </Col>
                        <Col span={8}>
                            <p>Colonia:<span className="h6">Colonia</span></p>
                        </Col>
                        <Col span={8}>
                            <p>Ciudad:<span className="h6">Ciudad</span></p>
                        </Col>
                    </Row>


                    <Row className="m-4">
                        <Col span={12}>
                            <p>Estado:<span className="h6">Estado</span></p>
                        </Col>
                        <Col span={12}>
                            <p>Ciudad:<span className="h6">Ciudad</span></p>
                        </Col>
                    </Row>

                    <Row className="m-4">
                        <Col span={24}>
                        <p className="m-3">Ubicacion actual: </p>
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
