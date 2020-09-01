import React,{useEffect,useState} from 'react'
import { withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import clienteAxios from '../../../config/axios';
import {notification,Card, Col,Tag,Spin,Radio,Result,Row,Modal,Button } from 'antd'
import queryString from 'query-string';
import MostrarDatosTargeta from './services/MostrarDatosTargeta'
import DetalleApartado from './services/DetalleApartado';
import Pagination from '../../../components/Pagination/pagination'




function SistemaApartado(props) {

	//Tomar la paginacion actual
	const { location, history } = props;
	const { page = 1 } = queryString.parse(location.search);


    const [ loading, setLoading ] = useState(false);
    const [ apartados, setApartados ] = useState([]);
	const [ detalleApartado, setDetalleApartado ] = useState([]);
	const [apartadoPaginacion, setApartadoPaginacion] = useState([])

    const [colorTag, setColorTag] = useState('')

    const [filter, setFilter] = useState('')

    const [ visible, setVisible ] = useState(false);
	const [ estado, setEstado ] = useState(false);

    const token = localStorage.getItem('token')
    var decoded = Jwt(token) 
	
	function Jwt(token) {
		try {
			return jwt_decode(token);
		} catch (e) {
			return null;
		}
    }
    
    function obtenerDatos(limit,page,filter){
        clienteAxios.get(`/apartado/?limit=${limit}&page=${page}&filter=${filter}`,{
			headers: {
				'Content-Type': 'multipart/form-data',
				Authorization: `bearer ${token}`
			}
		})
        .then((res) => {
			setLoading(false);
			setApartados(res.data.docs)
			setApartadoPaginacion(res.data)
        }).catch((err) => {
			setLoading(false);
			console.log(err.response);
            notification.error({
                message: 'Error del servidor',
                description:
                  'Paso algo en el servidor, al parecer la conexion esta fallando.',
              });
        })
    }

    useEffect(() => {
		obtenerDatos(10,page,filter);
		setLoading(true);
		setEstado(false)
    }, [page,filter,estado])

    if(token === '' || token === null){
        props.history.push('/entrar')
    }else if(decoded['rol'] !== true){
        props.history.push('/')
    }

    function handleChange(e){
        console.log(e.target.value);
        setFilter(e.target.value)
    }
    const showModal = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
    };

    return (
       <div>
			<Spin size="large" spinning={loading}>
				<div>
					<p style={{ fontSize: 20 }}>
						Aqui puedes ver todas las solicitudes de productos a apartar.
					</p>
					<div className="mt-4">
						<p className="d-lg-inline d-block mr-5">Mostrar por:</p>
						<Radio.Group name="radiogroup" defaultValue="" size="mediun">
							<Radio className="d-lg-inline d-block mb-1" value="" onChange={e => {handleChange(e)}} >
								Todas las solicitudes
							</Radio>
							<Radio className="d-lg-inline d-block mb-1" value="PROCESANDO" onChange={e => {handleChange(e)}} >
								Solicitudes en proceso
							</Radio>
							<Radio className="d-lg-inline d-block mb-1" value="ACEPTADO" onChange={e => {handleChange(e)}}>
								Solicitudes aceptadas
							</Radio>
							<Radio className="d-lg-inline d-block mb-1" value="RECHAZADO" onChange={e => {handleChange(e)}}>
								Solicitudes rechazadas
							</Radio>
						</Radio.Group>
					</div>
					<div className="mt-4">
						{apartados.length === 0 ? (
							<div className="w-100 d-flex justify-content-center align-items-center">
								<Result status="404" title="No hay resultados" />
							</div>
						) : (
							<Row gutter={16}>{
								apartados.map((apartado) => (							
									<MostrarDatosTargeta 
										key={apartado._id}
										setDetalleApartado={setDetalleApartado} 
										showModal={showModal} 
										apartado={apartado} 
									/>
								))
								}
							</Row>
						)}
					</div>
				</div>
				<Modal
					key="detalle"
					width={600}
					style={{ top: 0 }}
					title="Detalles de este pedido"
					visible={visible}
					onCancel={handleCancel}
					footer={[
						''
					]}
				>
					<DetalleApartado detalleApartado={detalleApartado} setEstado={setEstado} setFilter={setFilter} />
				</Modal>
				<Pagination blogs={apartadoPaginacion} location={location} history={history} />
			</Spin>
       </div>
    )
}

export default withRouter(SistemaApartado);
