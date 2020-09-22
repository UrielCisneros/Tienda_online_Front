import React,{useState,useEffect} from 'react'
import {Button,Drawer,Row,Col,Alert,notification,Empty} from 'antd';
import clienteAxios from '../../../../../config/axios';
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Geolocalizacion from '../../../../users/geolocalizacion'
import './MostrarRegistroTienda.scss';
import {PlusCircleOutlined,EditOutlined,EyeOutlined,FacebookFilled,InstagramFilled,TwitterCircleFilled } from '@ant-design/icons';
import Spin from '../../../../../components/Spin';
import RegistroTienda from './RegistroTienda';
import {Link} from 'react-router-dom';




 function MostrarRegistroTienda(props) {

    const {token} = props;

    const [action, setAction] = useState(false)
    const [visible, setVisible] = useState(false);
    const [ loading, setLoading ] = useState(false);
    const [datosNegocio, setDatosNegocio] = useState({})
    const [face, setFace] = useState('')
    const [insta, setInsta] = useState('')
    const [twitter, setTwitter] = useState('')

    const [ reloadInfo, setReloadInfo ] = useState(false);
    const [ politicasEnvio, setPoliticasEnvio ] = useState([]);

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
            setLoading(false);
            setDatosNegocio(res.data[0])
            if(res.data[0]){
                setAction(true)
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
                if(res.data[0].linkFace !== 'undefined' && res.data[0].linkFace !== ''){
                    setFace(res.data[0].linkFace);
                }
                if(res.data[0].linkInsta !== 'undefined' && res.data[0].linkInsta !== ''){
                    setInsta(res.data[0].linkInsta);
                }
                if(res.data[0].linkTweeter !== 'undefined' && res.data[0].linkTweeter !== ''){
                    setTwitter(res.data[0].linkTweeter);
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
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
        })
    }

    async function obtenerPoliticasEnvio() {
		await clienteAxios
			.get('/politicasEnvio/', {
				headers: {
					Authorization: `bearer ${token}`
				}
			})
			.then((res) => {
				setLoading(false);
				setPoliticasEnvio(res.data);
			})
			.catch((res) => {
				if (res.response.status === 404 || res.response.status === 500) {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: res.response.data.message,
						duration: 2
					});
				} else {
					setLoading(false);
					notification.error({
						message: 'Error',
						description: 'Hubo un error',
						duration: 2
					});
				}
			});
    }

    useEffect(() => {
        peticionDatosTienda();
        obtenerPoliticasEnvio();
        setReloadInfo(false)
    }, [reloadInfo])

    if (loading) {
        return <Spin/>;
    }


    
    return (
        <div className="info-tienda">
                <Drawer
                    title={action === false ? "Registrando la información del negocio" : "Actualizando la información del negocio"}
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
                    {action === false ? "Agregar información tienda" : "Actualizar información tienda"}
                </Button>
            </div>

            <div className="text-center mt-3">
                <h2 className="text-center h2 mb-4">{action === false ? "Ey aún no agregas la información de tu negocio.":"Información de tu negocio"} </h2>
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

                    <div className="row m-4">
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                                <p>Nombre del negocio: <span className="h6"> {action === false ? "Nombre de tu negocio": datosNegocio.nombre} </span> </p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                                <p>Teléfono:<span className="h6"> {action === false ? "Teléfono": datosNegocio.telefono} </span></p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                                <p>Código Postal:<span className="h6"> {action === false ? "Código Postal": datosNegocio.direccion[0].cp} </span></p>
                            </div>
                    </div>

                    <div className="row m-4">
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                                <p>Calle:<span className="h6"> {action === false ? "Calle": datosNegocio.direccion[0].calle_numero} </span></p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                                <p>Colonia:<span className="h6"> {action === false ? "Colonia": datosNegocio.direccion[0].colonia} </span></p>
                            </div>
                            <div className="col-lg-4 col-md-4 col-sm-12 mb-2">
                                <p>Ciudad:<span className="h6"> {action === false ? "Colonia": datosNegocio.direccion[0].ciudad} Ciudad</span></p>
                            </div>
                    </div>

                    <div className="row">
                            <div className="col-lg-6 col-sm-12">
                                <p>Estado:<span className="h6"> {action === false ? "Estado": datosNegocio.direccion[0].estado}</span></p>
                            </div>
                            <div className="col-lg-6 col-sm-12">
                                <p className="m-2" >Redes sociales:</p>
                                {face !== '' ? 
                                    (
                                    <a href={`https://${face}`} className="m-2" target="_blank">
                                        <FacebookFilled style={{fontSize: 45, color:"gray"}} />
                                    </a>
                                    ):('')
                        
                                }
                                {insta !== '' ? 
                                    (
                                    <a href={`https://${insta}`} className="m-2" target="_blank">
                                        <InstagramFilled style={{fontSize: 45, color:"gray"}} />
                                    </a>
                                    ):('')
                                }
                                
                                {twitter !== '' ? 
                                    (
                                    <a href={`https://${twitter}`} className="m-2" target="_blank">
                                        <TwitterCircleFilled style={{fontSize: 45, color:"gray"}} />
                                    </a>
                                    ):('')
                                }
                            </div>  
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <p className="m-3 ">Ubicación actual: </p>
                                <Geolocalizacion 
                                    height="60vh"
                                    width="100%"
                                    center={[lat, lng]}
                                    titleLayer={'map'}
                                    zoom={15}
                                    apikey = 'I0G4Jr6RUg71dsHIRF0qGzn0l39bAY1V'
                                    nombreMarcador = "AB soluciones Empresariales"
                                />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 col-sm-12">
                            <p className="m-3 h3">Políticas de envío</p>
                            {politicasEnvio.length === 0 ? (
                                <Empty description={<p className="h6">Aún no hay información</p>} />
                            ):(
                                <div className="politicas-p mt-4">
                                    <p>Costo por envío de paqueteria: <strong>${politicasEnvio.costoEnvio}</strong></p>
                                    <p>Promoción de envío: <strong>${politicasEnvio.promocionEnvio}</strong></p>
                                    <p>Costo de promocion de envío: <strong>${politicasEnvio.descuento}</strong></p>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-4 col-sm-12">
                            <p className="m-3 h3">Políticas de privacidad</p>
                            {action === false ? (
                                <Empty description={<p className="h6">Aún no hay información</p>} />
                            ):(
                                <Empty image="https://es.seaicons.com/wp-content/uploads/2015/11/Review-Post-icon1.png" description={<p className="h6">Información existente</p>} >
                                    <Link to={`/`} target="_blank">
                                        <Button type="dashed">
                                            <EyeOutlined /> Ver
                                        </Button>
                                    </Link>
                                </Empty>
                            )}
                        </div>
                        <div className="col-lg-4 col-sm-12">
                            <p className="m-3 h3">Imagen corporativa</p>
                            {action === false ? (
                                <Empty description={<p className="h6">Aún no hay información</p>} />
                            ):(
                                <Empty image="https://es.seaicons.com/wp-content/uploads/2015/11/Review-Post-icon1.png" description={<p className="h6">Información existente</p>} >
                                    <Link to={`/`} target="_blank">
                                        <Button type="dashed">
                                            <EyeOutlined /> Ver
                                        </Button>
                                    </Link>
                                </Empty>
                            )}
                        </div>
                    </div>
            </div>
        </div>
    )
}


function AlertTienda(){

    return(
        <div>
            <p className="h6">Recuerda que tener la información de tu negocio es importante, ya que esta informacion ayudará que tu negocio sea encontrado fácilmente.</p>
        </div>
    )
}

export default withRouter(MostrarRegistroTienda);
